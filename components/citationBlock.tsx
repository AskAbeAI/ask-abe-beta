class CitationBlock extends HTMLElement {
    constructor() {
        super();
  
        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            .my-textarea-class {
                min-height: 500px;
                width: 100%;
                background-color: #1A1B26;
                padding: 4px;
                font-size: 15px;
                color: #CCCCCC; /* Adjust the color as necessary */
            }
        `;
        shadow.appendChild(style);
  
        // Create the textarea
        const textarea = document.createElement('textarea');
        textarea.classList.add('my-textarea-class'); // Add any classes you need
        textarea.style.resize = 'none'; // Add any styles you need
  
        // Append the textarea to the shadow root
        shadow.appendChild(textarea);
    }
    set content(value: string) {
        const contentElement = this.shadowRoot?.querySelector('.content');
        if (contentElement) {
            contentElement.textContent = value;
        }
    }
  }
  
  // Define the custom element
  customElements.define('citation-block', CitationBlock);
  
  