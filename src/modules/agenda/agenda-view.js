import { Component } from '../../core/component.js';
import { ScheduleService } from '../../services/schedule-service.js';
import { WhatsAppHelper } from '../../core/whatsapp.js'; // <--- Importação Nova

/**
 * Componente de Agenda Diária
 * Tag: <agenda-view></agenda-view>
 */
export class AgendaView extends Component {
    
    constructor() {
        super();
        const hoje = new Date().toISOString().split('T')[0];
        this.state = {
            loading: true,
            date: hoje,
            appointments: []
        };
    }

    async connectedCallback() {
        this.loadSchedule();
    }

    async loadSchedule() {
        this.state.loading = true;
        this.render();

        try {
            const data = await ScheduleService.getByDate(this.state.date);
            this.state.appointments = data;
        } catch (error) {
            console.error(error);
        } finally {
            this.state.loading = false;
            this.render();
        }
    }

    generateTimeSlots() {
        const slots = [];
        for (let i = 8; i <= 20; i++) {
            const time = `${i.toString().padStart(2, '0')}:00`;
            const appointment = this.state.appointments.find(a => a.time === time);
            slots.push({ time, appointment });
        }
        return slots;
    }

    template() {
        if (this.state.loading) return `<div style="text-align:center; padding: 50px;">📅 Carregando agenda...</div>`;

        const slots = this.generateTimeSlots();

        const slotsHtml = slots.map(slot => {
            let content = '';

            if (slot.appointment) {
                // CASE 1: Horário Ocupado
                const color = slot.appointment.status === 'confirmed' ? '#d4edda' : '#fff3cd'; 
                const border = slot.appointment.status === 'confirmed' ? '#c3e6cb' : '#ffeeba';
                
                // Botão de Confirmação via Zap
                const zapBtn = `
                    <button class="btn-confirm-zap" data-client="${slot.appointment.client}" data-time="${slot.time}" title="Confirmar via WhatsApp"
                        style="background: #25d366; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                        💬
                    </button>
                `;

                content = `
                    <div style="background: ${color}; border: 1px solid ${border}; padding: 10px; border-radius: 6px; width: 100%; display: flex; align-items: center;">
                        <div>
                            <div style="font-weight: bold; color: #333;">${slot.appointment.client}</div>
                            <div style="font-size: 0.85rem; color: #666;">✂️ ${slot.appointment.service}</div>
                        </div>
                        ${zapBtn}
                    </div>
                `;
            } else {
                // CASE 2: Horário Livre
                content = `
                    <button class="btn-agendar" data-time="${slot.time}" style="width: 100%; height: 100%; border: 1px dashed #ccc; background: transparent; color: #999; cursor: pointer; border-radius: 6px; padding: 10px; text-align: left; transition: all 0.2s;">
                        + Agendar Horário
                    </button>
                `;
            }

            return `
                <div style="display: grid; grid-template-columns: 70px 1fr; gap: 15px; margin-bottom: 15px; min-height: 60px;">
                    <div style="text-align: right; padding-top: 10px; color: #555; font-weight: 600; font-size: 0.9rem;">
                        ${slot.time}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #333;">Agenda Diária</h2>
                    <input type="date" id="date-picker" value="${this.state.date}" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    ${slotsHtml}
                </div>
            </div>
        `;
    }

    addEvents() {
        // 1. Mudar Data
        const datePicker = this.querySelector('#date-picker');
        if (datePicker) {
            datePicker.addEventListener('change', (e) => {
                this.state.date = e.target.value;
                this.loadSchedule();
            });
        }

        // 2. Novo Agendamento
        const btns = this.querySelectorAll('.btn-agendar');
        btns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const time = e.target.dataset.time;
                const cliente = prompt(`Agendar para as ${time}\nNome do Cliente:`);
                
                if (cliente) {
                    await ScheduleService.create({
                        date: this.state.date,
                        time: time,
                        client: cliente,
                        service: 'Corte (Rápido)',
                    });
                    await this.loadSchedule();
                }
            });
            
            // Hover simples
            btn.addEventListener('mouseenter', () => { btn.style.background = '#f8f9fa'; btn.style.borderColor = '#aaa'; });
            btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent'; btn.style.borderColor = '#ccc'; });
        });

        // 3. Confirmar via WhatsApp (Novo)
        const zapBtns = this.querySelectorAll('.btn-confirm-zap');
        zapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const clientName = btn.dataset.client;
                const time = btn.dataset.time;
                
                // Simulação: Num sistema real, pegaríamos o telefone do objeto appointment
                const fakePhone = '11999990000'; 
                
                const msg = `Olá ${clientName}, confirmamos seu corte hoje às ${time}?`;
                WhatsAppHelper.openChat(fakePhone, msg);
            });
        });
    }
}

customElements.define('agenda-view', AgendaView);