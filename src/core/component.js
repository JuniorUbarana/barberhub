/**
 * Classe Base para Web Components.
 * Simplifica a criação de elementos customizados nativos.
 * @extends HTMLElement
 */
export class Component extends HTMLElement {
  
  constructor() {
    super();
    this.state = {}; 
  }

  connectedCallback() {
    this.render();
    // Nota: removemos o addEvents daqui pois ele agora é chamado dentro do render()
  }

  disconnectedCallback() {
    // Limpeza opcional
  }

  template() {
    return ''; 
  }

  /**
   * Renderiza o template e reconecta os eventos.
   */
  render() {
    this.innerHTML = this.template();
    this.addEvents(); // <--- O SEGREDO: Reconecta os clicks após desenhar o HTML
  }

  addEvents() {
    // Sobrescrito pelos filhos
  }
}