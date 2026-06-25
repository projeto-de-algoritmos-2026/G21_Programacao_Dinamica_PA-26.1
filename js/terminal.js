document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
        commandInput.addEventListener('input', handleInput);
    }
});

function handleInput(event) {
    const rawText = event.target.value;
    const tokens = tokenize(rawText);
    console.log("Tokens atuais:", tokens);
}

function tokenize(text) {
    if (!text || text.trim() === '') {
        return [];
    }
    return text.trim().split(/\s+/);
}
