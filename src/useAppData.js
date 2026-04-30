import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabaseClient'

// ─── helpers ──────────────────────────────────────────────────────────────
const nowISO = () => new Date().toISOString()
const currentMonth = () => new Date().toLocaleString('en-US', { month: 'long' })
const currentYear = () => new Date().getFullYear()

// ─── useAppData ────────────────────────────────────────────────────────────
// Central hook. Returns all persistent state + setters that auto-sync to Supabase.
// Falls back to seed data if DB is empty or offline.
export function useAppData({ user, seedScores, ANNUAL_ACTIONS, KB_SEED, FORUM_SEED }) {
  // ── scores ──
  const [scores, setScoresLocal] = useState(seedScores)
  const [scoresLoaded, setScoresLoaded] = useState(false)

  // ── locks + snapshots + history ──
  const [locks, setLocksLocal] = useState({})
  const [snapshots, setSnapshots] = useState({})
  const [evalHistory, setEvalHistory] = useState([])

  // ── annual actions ──
  const [annualActions, setAnnualActionsLocal] = useState(ANNUAL_ACTIONS)

  // ── knowledge cards ──
  const [knowledgeCards, setKnowledgeCards] = useState(KB_SEED)
  const [knowledgeLoaded, setKnowledgeLoaded] = useState(false)

  // ── forum ──
  const [forumPosts, setForumPosts] = useState(FORUM_SEED.map(p => ({ ...p, replies: p.replies || [] })))
  const [forumLoaded, setForumLoaded] = useState(false)
  const [votedMap, setVotedMap] = useState({})

  const uid = user?.id || null
  const userName = user?.name || 'Unknown'

  // ── LOAD ALL ON MOUNT ──────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return
    loadScores()
    loadLocks()
    loadHistory()
    loadSnapshots()
    loadAnnualActions()
    loadKnowledge()
    loadForum()
  }, [uid])

  // ── SCORES ──────────────────────────────────────────────────────────────
  const loadScores = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_scores')
      if (error || !data || data.length === 0) { setScoresLoaded(true); return }
      const built = {}
      data.forEach(row => {
        if (!built[row.agency_name]) built[row.agency_name] = {}
        built[row.agency_name][row.segment + '_' + row.criterion_key] = row.score
      })
      setScoresLocal(built)
      setScoresLoaded(true)
    } catch { setScoresLoaded(true) }
  }

  const setScores = useCallback(async (updater) => {
    setScoresLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      // Persist changed rows
      Object.keys(next).forEach(agency => {
        Object.keys(next[agency] || {}).forEach(key => {
          const [seg, ...rest] = key.split('_')
          const crit = rest.join('_')
          const val = next[agency][key]
          if (val !== prev[agency]?.[key]) {
            supabase.rpc('upsert_score', {
              p_agency_name: agency,
              p_segment: seg,
              p_criterion_key: crit,
              p_score: val,
              p_evaluated_by: uid,
            }).catch(console.error)
          }
        })
      })
      return next
    })
  }, [uid])

  // ── LOCKS ──────────────────────────────────────────────────────────────
  const loadLocks = async () => {
    try {
      const { data } = await supabase.from('eval_locks').select('*')
      if (!data) return
      const built = {}
      data.forEach(row => { built[row.agency_name] = row.is_locked })
      setLocksLocal(built)
    } catch {}
  }

  const setLocks = useCallback(async (updater) => {
    setLocksLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      // Persist changed locks
      Object.keys(next).forEach(agency => {
        if (next[agency] !== prev[agency]) {
          supabase.from('eval_locks').upsert({
            agency_name: agency,
            is_locked: next[agency],
            locked_by: userName,
            locked_at: next[agency] ? nowISO() : null,
            updated_at: nowISO(),
          }, { onConflict: 'agency_name' }).catch(console.error)
        }
      })
      return next
    })
  }, [userName])

  // ── SNAPSHOTS ──────────────────────────────────────────────────────────
  const loadSnapshots = async () => {
    try {
      const { data } = await supabase.from('eval_snapshots').select('*')
      if (!data) return
      const built = {}
      data.forEach(row => {
        if (!built[row.month]) built[row.month] = {}
        built[row.month][row.agency_name] = row.scores
      })
      setSnapshots(built)
    } catch {}
  }

  const saveSnapshot = useCallback(async (month, year, agencyName, agencyScores) => {
    try {
      await supabase.from('eval_snapshots').upsert({
        month, year, agency_name: agencyName, scores: agencyScores, created_at: nowISO(),
      }, { onConflict: 'month,year,agency_name' })
    } catch {}
  }, [])

  // ── EVAL HISTORY ────────────────────────────────────────────────────────
  const loadHistory = async () => {
    try {
      const { data } = await supabase.from('eval_history')
        .select('*').order('created_at', { ascending: false })
      if (!data) return
      setEvalHistory(data.map(row => ({
        agency: row.agency_name,
        month: row.month,
        year: row.year,
        timestamp: new Date(row.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }) + ' · ' + new Date(row.created_at).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit'
        }),
        lockedBy: row.locked_by,
        segScores: row.seg_scores,
        overall: row.overall,
        prevSegScores: row.prev_seg_scores,
        prevOverall: row.prev_overall,
      })))
    } catch {}
  }

  const saveHistoryEntry = useCallback(async (entry) => {
    try {
      await supabase.from('eval_history').insert({
        agency_name: entry.agency,
        month: entry.month,
        year: entry.year,
        locked_by: entry.lockedBy,
        seg_scores: entry.segScores,
        overall: entry.overall,
        prev_seg_scores: entry.prevSegScores,
        prev_overall: entry.prevOverall,
      })
    } catch {}
  }, [])

  // ── LOCK CALLBACK (called from ScorecardPage) ──────────────────────────
  const onLock = useCallback(async (agency, currentScores) => {
    const now = new Date()
    const month = currentMonth()
    const year = currentYear()
    const ts = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    // Build snapshot for the locked agency only
    const agSnap = { ...(currentScores[agency] || {}) }

    setSnapshots(prev => ({ ...prev, [month]: { ...(prev[month] || {}), [agency]: agSnap } }))
    await saveSnapshot(month, year, agency, agSnap)

    const prevEntry = [...evalHistory].reverse().find(e => e.agency === agency)
    const entry = {
      agency, month, year, timestamp: ts, lockedBy: userName,
      segScores: {}, overall: 0,
      prevSegScores: prevEntry?.segScores ?? null,
      prevOverall: prevEntry?.overall ?? null,
    }

    setEvalHistory(prev => [...prev, entry])
    await saveHistoryEntry(entry)
  }, [userName, evalHistory, saveSnapshot, saveHistoryEntry])

  // ── ANNUAL ACTIONS ────────────────────────────────────────────────────
  const loadAnnualActions = async () => {
    try {
      const { data } = await supabase.from('annual_actions_state').select('*')
      if (!data || data.length === 0) return
      setAnnualActionsLocal(prev => prev.map(action => {
        const saved = data.find(d => d.action_number === action.id)
        if (!saved) return action
        return { ...action, weeks: saved.week_data }
      }))
    } catch {}
  }

  const setAnnualActions = useCallback(async (updater) => {
    setAnnualActionsLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      // Find changed actions and persist
      next.forEach((action, i) => {
        const prevAction = prev[i]
        if (JSON.stringify(action.weeks) !== JSON.stringify(prevAction?.weeks)) {
          supabase.from('annual_actions_state').upsert({
            action_number: action.id,
            agency_name: 'shared',
            week_data: action.weeks,
            updated_at: nowISO(),
          }, { onConflict: 'action_number,agency_name' }).catch(console.error)
        }
      })
      return next
    })
  }, [])

  // ── KNOWLEDGE CARDS ───────────────────────────────────────────────────
  const loadKnowledge = async () => {
    try {
      const { data } = await supabase.from('knowledge_cards')
        .select('*').order('created_at', { ascending: false })
      if (!data || data.length === 0) { setKnowledgeLoaded(true); return }
      setKnowledgeCards(data.map(r => ({ ...r, tags: r.tags || [] })))
      setKnowledgeLoaded(true)
    } catch { setKnowledgeLoaded(true) }
  }

  const saveKnowledgeCard = useCallback(async (card, isEdit) => {
    try {
      if (isEdit) {
        await supabase.from('knowledge_cards').update({ ...card, tags: card.tags }).eq('id', card.id)
        setKnowledgeCards(prev => prev.map(c => c.id === card.id ? { ...c, ...card } : c))
      } else {
        const { data } = await supabase.from('knowledge_cards')
          .insert({ ...card, created_by: uid, tags: card.tags }).select().single()
        if (data) setKnowledgeCards(prev => [{ ...data, tags: data.tags || [] }, ...prev])
        return data
      }
    } catch (e) { console.error('saveKnowledgeCard', e) }
  }, [uid])

  const deleteKnowledgeCard = useCallback(async (id) => {
    try {
      await supabase.from('knowledge_cards').delete().eq('id', id)
      setKnowledgeCards(prev => prev.filter(c => c.id !== id))
    } catch {}
  }, [])

  const likeKnowledgeCard = useCallback(async (id) => {
    const card = knowledgeCards.find(c => c.id === id)
    const newLikes = (card?.likes || 0) + 1
    setKnowledgeCards(prev => prev.map(c => c.id === id ? { ...c, likes: newLikes } : c))
    try { await supabase.from('knowledge_cards').update({ likes: newLikes }).eq('id', id) }
    catch {}
  }, [knowledgeCards])

  const pinKnowledgeCard = useCallback(async (id) => {
    const card = knowledgeCards.find(c => c.id === id)
    const newPinned = !card?.pinned
    setKnowledgeCards(prev => prev.map(c => c.id === id ? { ...c, pinned: newPinned } : c))
    try { await supabase.from('knowledge_cards').update({ pinned: newPinned }).eq('id', id) }
    catch {}
  }, [knowledgeCards])

  // ── FORUM ──────────────────────────────────────────────────────────────
  const loadForum = async () => {
    try {
      const { data: postData } = await supabase.from('forum_posts')
        .select('*').order('created_at', { ascending: false })
      const { data: replyData } = await supabase.from('forum_replies')
        .select('*').order('created_at', { ascending: true })
      const { data: voteData } = uid
        ? await supabase.from('forum_votes').select('reply_id').eq('user_id', uid)
        : { data: [] }

      const vm = {}
        ; (voteData || []).forEach(v => { vm[v.reply_id] = true })
      setVotedMap(vm)

      if (postData && postData.length > 0) {
        setForumPosts(postData.map(p => ({
          ...p, tags: p.tags || [],
          replies: (replyData || []).filter(r => r.post_id === p.id),
        })))
      }
      setForumLoaded(true)
    } catch { setForumLoaded(true) }
  }

  const saveForumPost = useCallback(async (postData) => {
    try {
      const { data } = await supabase.from('forum_posts').insert(postData).select().single()
      if (data) setForumPosts(prev => [{ ...data, tags: data.tags || [], replies: [] }, ...prev])
      return data
    } catch { return null }
  }, [])

  const saveForumReply = useCallback(async (replyData) => {
    try {
      const { data } = await supabase.from('forum_replies').insert(replyData).select().single()
      if (data) {
        setForumPosts(prev => prev.map(p =>
          p.id === replyData.post_id ? { ...p, replies: [...p.replies, data] } : p
        ))
      }
      return data
    } catch { return null }
  }, [])

  const toggleForumVote = useCallback(async (replyId, postId) => {
    if (!uid) return
    const already = votedMap[replyId]
    setVotedMap(prev => ({ ...prev, [replyId]: !already }))
    setForumPosts(prev => prev.map(p => ({
      ...p, replies: p.replies.map(r =>
        r.id === replyId ? { ...r, votes: r.votes + (already ? -1 : 1) } : r
      )
    })))
    try {
      if (already) {
        await supabase.from('forum_votes').delete().eq('reply_id', replyId).eq('user_id', uid)
        const post = forumPosts.find(p => p.id === postId)
        const reply = post?.replies.find(r => r.id === replyId)
        await supabase.from('forum_replies').update({ votes: (reply?.votes || 1) - 1 }).eq('id', replyId)
      } else {
        await supabase.from('forum_votes').insert({ reply_id: replyId, user_id: uid })
        const post = forumPosts.find(p => p.id === postId)
        const reply = post?.replies.find(r => r.id === replyId)
        await supabase.from('forum_replies').update({ votes: (reply?.votes || 0) + 1 }).eq('id', replyId)
      }
    } catch {}
  }, [uid, votedMap, forumPosts])

  const markBestAnswer = useCallback(async (postId, replyId) => {
    const post = forumPosts.find(p => p.id === postId)
    const newBest = post?.best_answer_id === replyId ? null : replyId
    setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, best_answer_id: newBest } : p))
    try { await supabase.from('forum_posts').update({ best_answer_id: newBest }).eq('id', postId) }
    catch {}
  }, [forumPosts])

  const incrementPostViews = useCallback(async (postId) => {
    setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p))
    try {
      const post = forumPosts.find(p => p.id === postId)
      await supabase.from('forum_posts').update({ views: (post?.views || 0) + 1 }).eq('id', postId)
    } catch {}
  }, [forumPosts])

  const voteSameQuestion = useCallback(async (postId) => {
    if (!uid) return
    setForumPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const users = p.sameQuestionUsers || []
      const already = users.includes(uid)
      return {
        ...p,
        sameQuestionUsers: already ? users.filter(u => u !== uid) : [...users, uid],
        sameQuestion: (p.sameQuestion || 0) + (already ? -1 : 1),
      }
    }))
    // Note: sameQuestionUsers is in-memory for demo; add a forum_same_votes table for full persistence
  }, [uid])

  return {
    // scores
    scores, setScores, scoresLoaded,
    // locks
    locks, setLocks,
    // snapshots + history
    snapshots, setSnapshots, evalHistory, setEvalHistory, onLock,
    // annual actions
    annualActions, setAnnualActions,
    // knowledge
    knowledgeCards, setKnowledgeCards, knowledgeLoaded,
    saveKnowledgeCard, deleteKnowledgeCard, likeKnowledgeCard, pinKnowledgeCard,
    // forum
    forumPosts, setForumPosts, forumLoaded, votedMap, setVotedMap,
    saveForumPost, saveForumReply, toggleForumVote, markBestAnswer,
    incrementPostViews, voteSameQuestion,
  }
}
