// ============================================================
// Data Service — abstraction layer for comp data + submissions
//
// Currently backed by localStorage (MVP).
// To switch to Supabase:
//   1. npm install @supabase/supabase-js
//   2. Create a .env file:
//        VITE_SUPABASE_URL=https://your-project.supabase.co
//        VITE_SUPABASE_ANON_KEY=your-anon-key
//   3. Uncomment the Supabase block below and remove the
//      localStorage implementations.
//
// Supabase tables needed:
//   submissions  (id, created_at, family, subfamily, level,
//                 company_stage, base_salary, total_comp,
//                 employment_type, verification_method, is_verified)
//   comp_data    (id, level, subfamily, p25, p50, p75, p90,
//                 sample_size, last_updated)
// ============================================================

// ─── Supabase client (uncomment when ready) ─────────────────
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

const SUBMISSIONS_KEY = 'mycryptodevpay_submissions'
const COMP_DATA_KEY   = 'mycryptodevpay_comp_data'

// ─── Submissions ─────────────────────────────────────────────

/**
 * saveSubmission
 * Stores an anonymous compensation submission.
 *
 * @param {object} data  - { family, subfamily, level, companyStage,
 *                           base, totalComp, employmentType, verificationMethod }
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveSubmission(data) {
  try {
    // ── Supabase (swap in when ready) ───────────────────────
    // const { error } = await supabase.from('submissions').insert([{
    //   family:             data.family,
    //   subfamily:          data.subfamily,
    //   level:              data.level,
    //   company_stage:      data.companyStage,
    //   base_salary:        data.base,
    //   total_comp:         data.totalComp,
    //   employment_type:    data.employmentType,
    //   verification_method: data.verificationMethod,
    //   is_verified:        data.verificationMethod !== 'honor',
    // }])
    // if (error) throw error
    // return { success: true }

    // ── localStorage (MVP) ──────────────────────────────────
    const existing = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]')
    existing.push({
      ...data,
      id:        crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing))
    return { success: true }
  } catch (err) {
    console.error('[dataService] saveSubmission error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * getSubmissions
 * Retrieves all stored submissions (admin / debug use).
 *
 * @returns {Promise<object[]>}
 */
export async function getSubmissions() {
  try {
    // ── Supabase ─────────────────────────────────────────────
    // const { data, error } = await supabase
    //   .from('submissions')
    //   .select('*')
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return data ?? []

    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]')
  } catch (err) {
    console.error('[dataService] getSubmissions error:', err)
    return []
  }
}

// ─── Comp data ───────────────────────────────────────────────

/**
 * loadCompData
 * Returns the active comp dataset.
 * Priority: Supabase → localStorage (CSV import) → bundled defaults.
 *
 * @returns {Promise<object|null>}  keyed by level code
 */
export async function loadCompData() {
  try {
    // ── Supabase ─────────────────────────────────────────────
    // const { data, error } = await supabase
    //   .from('comp_data')
    //   .select('*')
    // if (error) throw error
    // if (data?.length) return normalizeSupabaseCompData(data)

    // ── localStorage (populated via CSV import) ───────────────
    const stored = localStorage.getItem(COMP_DATA_KEY)
    if (stored) return JSON.parse(stored)

    return null  // caller falls back to bundled baseCompData
  } catch (err) {
    console.error('[dataService] loadCompData error:', err)
    return null
  }
}

/**
 * importCompDataFromCSV
 * Parses a CSV string and persists it to localStorage.
 * Expected CSV columns (case-insensitive):
 *   level, p25, p50, p75, p90
 *
 * @param {string} csvText
 * @returns {{ success: boolean, rowsImported: number, errors: string[] }}
 */
export function importCompDataFromCSV(csvText) {
  const lines  = csvText.trim().split('\n')
  const header = lines[0].toLowerCase().split(',').map(h => h.trim())

  const idx = {
    level: header.indexOf('level'),
    p25:   header.indexOf('p25'),
    p50:   header.indexOf('p50'),
    p75:   header.indexOf('p75'),
    p90:   header.indexOf('p90'),
  }

  const errors = []
  if (idx.level < 0) errors.push('Missing "level" column')
  if (idx.p25   < 0) errors.push('Missing "p25" column')
  if (idx.p50   < 0) errors.push('Missing "p50" column')
  if (idx.p75   < 0) errors.push('Missing "p75" column')
  if (idx.p90   < 0) errors.push('Missing "p90" column')
  if (errors.length) return { success: false, rowsImported: 0, errors }

  const result = {}
  let rowsImported = 0

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/[^0-9.]/g, ''))
    const raw  = lines[i].split(',')
    const level = raw[idx.level]?.trim().toUpperCase()
    if (!level) continue

    const p25 = parseFloat(cols[idx.p25])
    const p50 = parseFloat(cols[idx.p50])
    const p75 = parseFloat(cols[idx.p75])
    const p90 = parseFloat(cols[idx.p90])

    if ([p25, p50, p75, p90].some(isNaN)) {
      errors.push(`Row ${i + 1}: invalid numeric value for level "${level}"`)
      continue
    }

    result[level] = { p25, p50, p75, p90 }
    rowsImported++
  }

  if (rowsImported > 0) {
    localStorage.setItem(COMP_DATA_KEY, JSON.stringify(result))
  }

  return { success: rowsImported > 0, rowsImported, errors }
}

/**
 * clearImportedCompData
 * Removes CSV-imported data, reverting to bundled defaults.
 */
export function clearImportedCompData() {
  localStorage.removeItem(COMP_DATA_KEY)
}
