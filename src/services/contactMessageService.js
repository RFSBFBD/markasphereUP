import { supabase } from '@/lib/supabase'

// Public contact form submissions -> contact_messages table.
// Reads/status changes are used by the Dashboard Inbox (requires an
// authenticated admin session on the same supabase client).

const TABLE = 'contact_messages'

function buildRow(form) {
  const fullName = (form.full_name || form.name || '').trim()
  const row = {
    full_name: fullName,
    name: fullName, // legacy column kept for backward compatibility
    email: (form.email || '').trim(),
    phone: (form.phone || '').trim() || null,
    company: (form.company || '').trim() || null,
    subject: (form.subject || '').trim() || null,
    message: (form.message || '').trim(),
    status: 'Unread',
  }
  return row
}

export const contactMessageService = {
  // Public insert (any visitor). Gracefully degrades to core columns
  // if the extended columns are not yet present in the DB schema.
  async submit(form) {
    const row = buildRow(form)
    const { data, error } = await supabase.from(TABLE).insert(row).select().maybeSingle()
    if (error) {
      // Fallback: only the original core columns (name/email/message).
      const fallback = {
        name: row.name,
        email: row.email,
        message: row.message,
      }
      const res = await supabase.from(TABLE).insert(fallback).select().maybeSingle()
      if (res.error) throw new Error(res.error.message)
      return res.data
    }
    return data
  },

  // ---- Dashboard Inbox (requires authenticated admin session) ----

  async list({ page = 1, perPage = 12, search = '', status = '' } = {}) {
    let query = supabase.from(TABLE).select('*', { count: 'exact' })
    if (search) {
      const s = `%${search}%`
      query = query.or(`full_name.ilike.${s},email.ilike.${s},phone.ilike.${s},company.ilike.${s},subject.ilike.${s},message.ilike.${s}`)
    }
    if (status) query = query.eq('status', status)
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.order('created_at', { ascending: false }).range(from, to)
    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return {
      data: data || [],
      total: count || 0,
      pages: perPage ? Math.max(1, Math.ceil((count || 0) / perPage)) : 1,
    }
  },

  async stats() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('status, created_at')
    if (error) throw new Error(error.message)
    const rows = data || []
    const today = new Date().toISOString().slice(0, 10)
    return {
      total: rows.length,
      unread: rows.filter((r) => r.status === 'Unread').length,
      archived: rows.filter((r) => r.status === 'Archived').length,
      today: rows.filter((r) => (r.created_at || '').slice(0, 10) === today).length,
    }
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },
}
