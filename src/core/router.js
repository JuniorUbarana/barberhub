/**
 * Roteador minimalista para SPA Vanilla.
 * Gerencia a troca de conteúdo baseada na URL sem refresh.
 */
export class Router {
    
    /**
     * @param {Object} routes - Mapa de rotas (caminho -> função que retorna HTML)
     */
    constructor(routes) {
        this.routes = routes;
        
        // Ouve a navegação pelos botões do browser (voltar/avançar)
        window.addEventListener('popstate', () => this.loadRoute());
        
        // Intercepta cliques em links com o atributo 'data-link'
        document.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
    }

    /**
     * Atualiza a URL e carrega o conteúdo.
     * @param {string} url - URL completa para navegação
     */
    navigateTo(url) {
        window.history.pushState(null, null, url);
        this.loadRoute();
    }

    /**
     * Identifica a rota atual e renderiza o conteúdo no DOM.
     */
    async loadRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/'];
        
        const app = document.getElementById('app');
        app.innerHTML = await route(); 
    }
}