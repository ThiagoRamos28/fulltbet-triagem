import { createClient } from '@supabase/supabase-js'

// Mesma URL/anon key do index.html legado — chave pública de propósito, restrita por RLS a uma
// janela rolante de 3 dias (ver PRODUCT.md, "Operating Context").
const SUPABASE_URL = 'https://qfhzmvfaudnxnumlosmy.supabase.co'
const ANON_KEY = 'sb_publishable_CbZOTQfv9WeRsKSFcGfFvA_I4e62k7K'

export const supabase = createClient(SUPABASE_URL, ANON_KEY)
