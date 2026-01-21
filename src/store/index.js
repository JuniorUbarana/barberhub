import { Store } from '../core/store.js';

// Estado Inicial da Aplicação
const initialState = {
    user: null,          
    barbers: [],         
    theme: 'light',      
    isLoading: false     
};

// Exportamos a instância única para ser usada em todo o app
export const store = new Store({ state: initialState });