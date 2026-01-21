/**
 * Gerenciador de Estado Centralizado (Store).
 * Utiliza o padrão Observer com Proxy para reatividade automática.
 */
export class Store {
    
    constructor(params) {
        this.events = {}; 
        
        this.state = new Proxy(params.state || {}, {
            set: (target, key, value) => {
                target[key] = value;
                this.notify(key, value);
                return true;
            }
        });
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    notify(key, value) {
        if (this.events[key]) {
            this.events[key].forEach(callback => callback(value));
        }
        // Notifica assinantes genéricos
        if (this.events['stateChange']) {
            this.events['stateChange'].forEach(callback => callback(this.state));
        }
    }
}