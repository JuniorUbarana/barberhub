// Banco de dados simulado de agendamentos
// Formato: YYYY-MM-DD
const MOCK_APPOINTMENTS = [
    { id: 1, date: '2026-01-21', time: '09:00', client: 'Carlos Silva', service: 'Corte Degradê', status: 'confirmed' },
    { id: 2, date: '2026-01-21', time: '10:00', client: 'Roberto Almeida', service: 'Barba e Cabelo', status: 'confirmed' },
    { id: 3, date: '2026-01-21', time: '14:00', client: 'Fernando Souza', service: 'Corte Simples', status: 'pending' }
];

export class ScheduleService {
    
    /**
     * Busca agendamentos de uma data específica
     * @param {string} dateString - Data no formato YYYY-MM-DD
     */
    static async getByDate(dateString) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = MOCK_APPOINTMENTS.filter(app => app.date === dateString);
                resolve(results);
            }, 300);
        });
    }

    /**
     * Cria um agendamento simples
     */
    static async create(appointment) {
        return new Promise((resolve) => {
            setTimeout(() => {
                appointment.id = Date.now();
                appointment.status = 'confirmed';
                MOCK_APPOINTMENTS.push(appointment);
                resolve(appointment);
            }, 300);
        });
    }
}