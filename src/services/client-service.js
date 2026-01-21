// Simulação de banco de dados em memória (o estado persiste enquanto a página não fecha)
let MOCK_DB = [
    { id: 1, nome: 'Carlos Silva', telefone: '(11) 99999-1234', ultimoCorte: '20/01/2026', status: 'ativo' },
    { id: 2, nome: 'Roberto Almeida', telefone: '(21) 98888-5678', ultimoCorte: '15/01/2026', status: 'inativo' },
    { id: 3, nome: 'Fernando Souza', telefone: '(31) 97777-9090', ultimoCorte: '10/01/2026', status: 'ativo' },
    { id: 4, nome: 'André Santos', telefone: '(41) 96666-1122', ultimoCorte: '05/01/2026', status: 'ativo' }
];

/**
 * Serviço responsável por gerenciar operações de Clientes.
 */
export class ClientService {
    
    /**
     * Busca todos os clientes.
     */
    static async getAll() {
        return new Promise((resolve) => {
            // Delay de 300ms para simular rede
            setTimeout(() => {
                resolve([...MOCK_DB]);
            }, 300);
        });
    }

    /**
     * Adiciona um novo cliente.
     */
    static async create(cliente) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const novoCliente = {
                    id: Date.now(),
                    nome: cliente.nome,
                    telefone: cliente.telefone,
                    ultimoCorte: '-',
                    status: 'ativo'
                };
                
                // Adiciona ao topo da lista
                MOCK_DB.unshift(novoCliente);
                
                resolve(novoCliente);
            }, 300);
        });
    }
}