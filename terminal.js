// terminal.js
// Módulo responsável pela interface de entrada e tokenização

document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('command-input');
    
    if (commandInput) {
        commandInput.addEventListener('input', handleInput);
    }
});

/**
 * Função acionada a cada caractere digitado no terminal.
 * Futuramente enviará os dados para o Dictionary e LIS.
 */
function handleInput(event) {
    const rawText = event.target.value;
    const tokens = tokenize(rawText);
    
    // Log para depuração (pode ser visto no console do navegador)
    console.log("Tokens atuais:", tokens);
}

/**
 * Limpa o texto e o transforma em um array de tokens (palavras).
 * @param {string} text - O texto bruto digitado pelo usuário.
 * @returns {Array<string>} Array de palavras.
 */
function tokenize(text) {
    if (!text || text.trim() === '') {
        return [];
    }
    
    // Remove espaços vazios no início/fim e divide usando expressão regular para múltiplos espaços
    return text.trim().split(/\s+/);
}
