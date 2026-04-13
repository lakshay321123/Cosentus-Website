'use client'

import { useEffect } from 'react'
import { supabase } from './supabase'

/** Subscribe to real-time changes on a Supabase table */
export function useRealtimeTable(
  table: string,
  onInsert?: (record: any) => void,
  onUpdate?: (record: any) => void,
  onDelete?: (record: any) => void,
) {
  useEffect(() => {
    const channel = supabase
      .channel(`crm-${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
        onInsert?.(payload.new)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload) => {
        onUpdate?.(payload.new)
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload) => {
        onDelete?.(payload.old)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table, onInsert, onUpdate, onDelete])
}
