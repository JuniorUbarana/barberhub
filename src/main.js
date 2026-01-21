import { Router } from './core/router.js';
import './modules/ui/navbar.js';
import './modules/clients/client-list.js';
import './modules/agenda/agenda-view.js'; // <--- IMPORTANTE: Importamos o arquivo da agenda

// Rotas da Aplicação
const routes = {
    '/': () => `
        <app-navbar></app-navbar>
        <div style="max-width: 1200px; margin: 20px auto; padding: 0 15px; font-family: sans-serif;">
            <h1>Dashboard BarberHub</h1>
            <p>Bem-vindo ao seu painel de gerenciamento.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #007bff;">
                    <h3 style="margin-top:0;">Agendamentos Hoje</h3>
                    <p style="font-size: 2rem; margin: 10px 0; font-weight: bold; color: #333;">3</p>
                    <a href="/agenda" data-link style="color: #007bff; text-decoration: none; font-size: 0.9rem;">Ver agenda &rarr;</a>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #28a745;">
                    <h3 style="margin-top:0;">Faturamento Mês</h3>
                    <p style="font-size: 2rem; margin: 10px 0; font-weight: bold; color: #333;">R$ 4.250</p>
                </div>
            </div>
        </div>
    `,
    '/clientes': () => `
        <app-navbar></app-navbar>
        <div style="max-width: 1200px; margin: 20px auto; padding: 0 15px; font-family: sans-serif;">
            <client-list></client-list>
        </div>
    `,
    // AQUI ESTAVA O PROBLEMA. Agora estamos chamando o componente correto:
    '/agenda': () => `
        <app-navbar></app-navbar>
        <div style="max-width: 800px; margin: 20px auto; padding: 0 15px; font-family: sans-serif;">
            <agenda-view></agenda-view> </div>
    `
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const router = new Router(routes);
    router.loadRoute();
    console.log('BarberHub carregado com Módulo de Agenda! ✂️');
});