import { supabase } from '../core/supabase.js';

/**
 * Serviço responsável por gerenciar operações de Clientes no Supabase.
 */
export class ClientService {
    
    /**
     * Busca todos os clientes no banco de dados.
     * @returns {Promise<Array>}
     */
    static async getAll() {
        // SELECT * FROM clients ORDER BY created_at DESC
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }

        // Mapeamos para garantir compatibilidade com nossa interface
        return data.map(client => ({
            id: client.id,
            nome: client.name,          // O banco usa 'name', a UI usa 'nome'
            telefone: client.phone,     // O banco usa 'phone', a UI usa 'telefone'
            ultimoCorte: client.last_cut ? new Date(client.last_cut).toLocaleDateString('pt-BR') : '-',
            status: client.status
        }));
    }

    /**
     * Adiciona um novo cliente no banco.
     */
    static async create(cliente) {
        // INSERT INTO clients (name, phone) VALUES (...)
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                name: cliente.nome,
                phone: cliente.telefone,
                status: 'ativo'
                // tenant_id: '...' (Futuramente vamos passar o ID da barbearia aqui)
            }])
            .select(); // O .select() retorna o dado inserido

        if (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }

        return data[0];
    }
}