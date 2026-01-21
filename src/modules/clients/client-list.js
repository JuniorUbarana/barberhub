import { Component } from '../../core/component.js';
import { ClientService } from '../../services/client-service.js';
import { WhatsAppHelper } from '../../core/whatsapp.js';

/**
 * Componente de Listagem e Cadastro de Clientes
 * Tag: <client-list></client-list>
 */
export class ClientList extends Component {
    
    constructor() {
        super();
        this.state = {
            loading: true,
            clients: []
        };
    }

    async connectedCallback() {
        this.loadData();
    }

    async loadData() {
        this.state.loading = true;
        this.render(); 

        try {
            const data = await ClientService.getAll();
            this.state.clients = data;
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            this.state.loading = false;
            this.render(); 
        }
    }

    template() {
        // 1. Modal de Cadastro
        // ATENÇÃO: Adicionei maxlength="15" no input de telefone
        const modalTemplate = `
            <dialog id="modal-novo-cliente" style="border: none; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 0; min-width: 350px;">
                <div style="padding: 20px; border-bottom: 1px solid #eee; background: #f8f9fa;">
                    <h3 style="margin: 0; color: #333;">Novo Cliente</h3>
                </div>
                <form id="form-cliente" style="padding: 20px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500; font-size: 0.9rem;">Nome Completo</label>
                        <input type="text" name="nome" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500; font-size: 0.9rem;">WhatsApp / Telefone</label>
                        <input type="tel" name="telefone" id="input-telefone" maxlength="15" required placeholder="(00) 90000-0000" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                    </div>
                    <div style="text-align: right; display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" id="btn-cancelar" style="padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="submit" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Salvar Cliente</button>
                    </div>
                </form>
            </dialog>
        `;

        if (this.state.loading) {
            return `<div style="text-align: center; padding: 4rem; color: #666;">⏳ Buscando clientes...</div>`;
        }

        const linhas = this.state.clients.map(client => `
            <tr style="border-bottom: 1px solid #eee; transition: background 0.2s;">
                <td style="padding: 12px 15px;">${client.nome}</td>
                <td style="padding: 12px 15px;">
                    <button class="btn-whatsapp" data-phone="${client.telefone}" data-name="${client.nome}" 
                            title="Abrir WhatsApp"
                            style="border: 1px solid #28a745; background: #f0fff4; color: #28a745; border-radius: 4px; padding: 4px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 0.9rem;">
                        <span>📱</span> ${client.telefone}
                    </button>
                </td>
                <td style="padding: 12px 15px;">${client.ultimoCorte}</td>
                <td style="padding: 12px 15px;">
                    <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 600; background: ${client.status === 'ativo' ? '#d4edda' : '#f8d7da'}; color: ${client.status === 'ativo' ? '#155724' : '#721c24'};">
                        ${client.status.toUpperCase()}
                    </span>
                </td>
            </tr>
        `).join('');

        return `
            ${modalTemplate}
            
            <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin: 0; font-size: 1.2rem; color: #333;">Meus Clientes</h2>
                        <span style="font-size: 0.85rem; color: #777;">Gerencie sua base de contatos</span>
                    </div>
                    <button id="btn-novo" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        <span>+</span> Novo Cliente
                    </button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; min-width: 600px;">
                        <thead>
                            <tr style="background: #f8f9fa; text-align: left;">
                                <th style="padding: 12px 15px; font-weight: 600; color: #555;">NOME</th>
                                <th style="padding: 12px 15px; font-weight: 600; color: #555;">CONTATO</th>
                                <th style="padding: 12px 15px; font-weight: 600; color: #555;">ÚLTIMO CORTE</th>
                                <th style="padding: 12px 15px; font-weight: 600; color: #555;">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.state.clients.length ? linhas : '<tr><td colspan="4" style="padding:3rem; text-align:center; color: #999;">Nenhum cliente encontrado.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    addEvents() {
        const dialog = this.querySelector('#modal-novo-cliente');
        const btnNovo = this.querySelector('#btn-novo');
        const btnCancelar = this.querySelector('#btn-cancelar');
        const form = this.querySelector('#form-cliente');
        const inputTelefone = this.querySelector('#input-telefone'); // Capturamos o input

        // --- MÁSCARA DE TELEFONE (NOVO) ---
        if(inputTelefone) {
            inputTelefone.addEventListener('input', (e) => {
                let value = e.target.value;
                
                // 1. Remove tudo que não é número
                value = value.replace(/\D/g, "");
                
                // 2. Aplica a máscara (XX) XXXXX-XXXX
                value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                value = value.replace(/(\d)(\d{4})$/, "$1-$2");
                
                // 3. Devolve para o input
                e.target.value = value;
            });
        }

        // Abrir/Fechar Modal
        if(btnNovo && dialog) btnNovo.addEventListener('click', () => dialog.showModal());
        if(btnCancelar && dialog) btnCancelar.addEventListener('click', () => dialog.close());

        // Salvar Cliente
        if(form && dialog) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const novoCliente = {
                    nome: formData.get('nome'),
                    telefone: formData.get('telefone')
                };

                const btnSubmit = form.querySelector('button[type="submit"]');
                const textoOriginal = btnSubmit.innerText;
                btnSubmit.innerText = 'Salvando...';
                btnSubmit.disabled = true;

                try {
                    await ClientService.create(novoCliente);
                    dialog.close();
                    form.reset();
                    await this.loadData();
                } catch (error) {
                    alert('Erro ao salvar');
                } finally {
                    btnSubmit.innerText = textoOriginal;
                    btnSubmit.disabled = false;
                }
            });
        }

        // WhatsApp Click
        const zapButtons = this.querySelectorAll('.btn-whatsapp');
        zapButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const phone = btn.dataset.phone;
                const name = btn.dataset.name;
                const msg = `Olá ${name}, aqui é da Barbearia BarberHub! Gostaria de agendar um horário?`;
                
                WhatsAppHelper.openChat(phone, msg);
            });
        });
    }
}

customElements.define('client-list', ClientList);