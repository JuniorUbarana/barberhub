import { Component } from '../../core/component.js';
import { store } from '../../store/index.js';

/**
 * Componente de Navegação Principal do BarberHub
 * Tag de uso: <app-navbar></app-navbar>
 */
export class Navbar extends Component {
  
  constructor() {
    super();
    // Re-renderiza quando o tema mudar na store
    store.subscribe('theme', () => this.render());
  }

  template() {
    const tema = store.state.theme;
    const bg = tema === 'light' ? '#f8f9fa' : '#212529';
    const text = tema === 'light' ? '#212529' : '#f8f9fa';
    const border = tema === 'light' ? '#dee2e6' : '#495057';

    return `
      <nav style="background: ${bg}; padding: 1rem; border-bottom: 1px solid ${border}; transition: all 0.3s;">
        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
            <a href="/" data-link style="font-weight: 800; font-size: 1.4rem; color: ${text}; text-decoration: none; letter-spacing: -1px;">
                BarberHub
            </a>
            
            <div style="display: flex; gap: 20px;">
                <a href="/clientes" data-link style="color: ${text}; text-decoration: none;">Clientes</a>
                <a href="/agenda" data-link style="color: ${text}; text-decoration: none;">Agenda</a>
            </div>

            <button id="toggle-theme" style="padding: 5px 10px; cursor: pointer; border: 1px solid ${border}; background: transparent; color: ${text}; border-radius: 4px;">
                ${tema === 'light' ? '🌙' : '☀️'}
            </button>
        </div>
      </nav>
    `;
  }

  addEvents() {
    const btn = this.querySelector('#toggle-theme');
    if(btn) {
        btn.addEventListener('click', () => {
            store.state.theme = store.state.theme === 'light' ? 'dark' : 'light';
        });
    }
  }
}

// Registra o componente no navegador
customElements.define('app-navbar', Navbar);