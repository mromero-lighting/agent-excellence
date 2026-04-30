// useAppData — in-memory for demo mode
// All state lives in React, no async Supabase calls that can corrupt state
// Swap individual functions for real Supabase calls when auth is ready

export function useAppData({ seedScores, ANNUAL_ACTIONS, KB_SEED, FORUM_SEED }) {
  // This hook intentionally returns null — all state is managed directly in App
  // keeping this file as a placeholder for the future Supabase integration
  return null
}
