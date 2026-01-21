// Importamos a lib direto do CDN oficial
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- CONFIGURAÇÃO ---
// Substitua AQUI pelos dados que você pegou no Passo 1
const SUPABASE_URL = 'https://olmdeccaimdzquuccota.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_Dr8Og7DE0rXxVec8J4gxeg_zeJ_ZyWj';

// Cria a instância única do cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);