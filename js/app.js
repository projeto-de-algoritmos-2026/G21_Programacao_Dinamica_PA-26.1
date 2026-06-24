(function (globalScope) {
    'use strict';

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function tokenize(text) {
        if (!text || text.trim() === '') {
            return [];
        }

        return text.trim().split(/\s+/);
    }

    function buildSuggestionMarkup(tokens) {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            return '<span class="placeholder">Aguardando entrada de dados...</span>';
        }

        const mappedValues = globalScope.Dictionary.mapTokensToIndices(tokens);
        const lisResult = globalScope.LIS.computeLis(mappedValues);
        const lisSequence = Array.isArray(lisResult.sequence) ? lisResult.sequence : [];
        const referenceSequence = globalScope.Dictionary.getReferenceSequence();
        const suggestionTokens = lisSequence
            .map((value) => referenceSequence[value])
            .filter(Boolean);

        if (!suggestionTokens.length) {
            return '<span class="placeholder">Nenhuma sequência válida foi identificada.</span>';
        }

        return [
            '<div class="suggestion-label">Sugestão correta:</div>',
            '<div class="suggestion-text">' + escapeHtml(suggestionTokens.join(' ')) + '</div>'
        ].join('');
    }

    function renderInput(tokens) {
        const outputArea = document.getElementById('output-area');
        const correctionOutput = document.getElementById('correction-output');

        if (!outputArea || !correctionOutput) {
            return;
        }

        if (!Array.isArray(tokens) || tokens.length === 0) {
            outputArea.innerHTML = [
                '<p>Bem-vindo ao Motor LIS (Longest Increasing Subsequence).</p>',
                '<p>Digite sua sequência abaixo. Analisaremos em tempo real.</p>',
                '<div class="input-preview"><span class="placeholder">Aguardando entrada...</span></div>'
            ].join('');
            correctionOutput.innerHTML = '<span class="placeholder">Aguardando entrada de dados...</span>';
            return;
        }

        const mappedValues = globalScope.Dictionary.mapTokensToIndices(tokens);
        const lisResult = globalScope.LIS.computeLis(mappedValues);
        const lisSequence = Array.isArray(lisResult.sequence) ? lisResult.sequence : [];
        const lisValueSet = new Set(lisSequence);
        let matchIndex = 0;

        const previewMarkup = tokens
            .map((token, index) => {
                const mappedValue = mappedValues[index];
                const isInLis = mappedValue === lisSequence[matchIndex];

                if (isInLis) {
                    matchIndex += 1;
                    return '<span class="token token-correct">' + escapeHtml(token) + '</span>';
                }

                return '<span class="token token-incorrect">' + escapeHtml(token) + '</span>';
            })
            .join(' ');

        outputArea.innerHTML = [
            '<p>Entrada atual:</p>',
            '<div class="input-preview">' + previewMarkup + '</div>'
        ].join('');

        correctionOutput.innerHTML = buildSuggestionMarkup(tokens);
    }

    function handleInput(event) {
        const text = event.target.value;
        const tokens = tokenize(text);
        renderInput(tokens);
    }

    function initializeApp() {
        const commandInput = document.getElementById('command-input');

        if (!commandInput) {
            return;
        }

        commandInput.addEventListener('input', handleInput);
        renderInput(tokenize(commandInput.value));
    }

    document.addEventListener('DOMContentLoaded', initializeApp);

    globalScope.App = {
        renderInput,
        tokenize
    };
})(typeof window !== 'undefined' ? window : globalThis);
