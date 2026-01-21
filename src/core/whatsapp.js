/**
 * Utilitário para manipulação de links do WhatsApp.
 * Centraliza a lógica de formatação de números e geração de links.
 */
export class WhatsAppHelper {
    
    /**
     * Remove caracteres não numéricos do telefone e garante o código do país.
     * @param {string} phone - Ex: (11) 99999-0000 ou 11999990000
     * @returns {string} - Ex: 5511999990000
     */
    static sanitize(phone) {
        if (!phone) return '';
        
        // Remove tudo que não é número
        let numbers = phone.replace(/\D/g, '');
        
        // Se o número tiver 10 ou 11 dígitos (sem DDI), adicionamos o 55 (Brasil)
        if (numbers.length >= 10 && numbers.length <= 11) {
            numbers = '55' + numbers;
        }
        
        return numbers;
    }

    /**
     * Gera o link universal da API do WhatsApp.
     * @param {string} phone - Telefone de destino
     * @param {string} message - Mensagem a ser enviada
     * @returns {string} URL completa
     */
    static getLink(phone, message = '') {
        const number = this.sanitize(phone);
        const text = encodeURIComponent(message);
        return `https://wa.me/${number}?text=${text}`;
    }

    /**
     * Abre a conversa em uma nova aba do navegador.
     * @param {string} phone - Telefone
     * @param {string} message - Mensagem opcional
     */
    static openChat(phone, message) {
        const link = this.getLink(phone, message);
        window.open(link, '_blank');
    }
}