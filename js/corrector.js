(function (globalScope) {
    'use strict';

    function analyzeInput(originalTokens, lisResult) {
        if (!originalTokens || originalTokens.length === 0) {
            return { correctTokens: [], incorrectTokens: [], suggestion: "" };
        }

        if (!lisResult || !lisResult.sequence || lisResult.sequence.length === 0) {
            return {
                correctTokens: [],
                incorrectTokens: originalTokens.map((token, index) => ({ token, index, action: 'remover' })),
                suggestion: "Nenhuma estrutura válida reconhecida."
            };
        }

        const lisOriginalIndices = [];
        let currentIndex = lisResult.bestIndex;

        while (currentIndex !== -1) {
            lisOriginalIndices.unshift(currentIndex);
            currentIndex = lisResult.predecessors[currentIndex];
        }

        const lisIndicesSet = new Set(lisOriginalIndices);
        const correctTokens = [];
        const incorrectTokens = [];

        originalTokens.forEach((token, index) => {
            if (lisIndicesSet.has(index)) {
                correctTokens.push({ token, index });
            } else {
                incorrectTokens.push({ token, index, action: 'remover/reposicionar' });
            }
        });

        const validCommandStr = correctTokens.map(item => item.token).join(" ");
        const suggestion = validCommandStr.length > 0 
            ? `Você quis dizer: "${validCommandStr}"?`
            : "Nenhuma estrutura válida reconhecida.";

        return { correctTokens, incorrectTokens, lisOriginalIndices, suggestion };
    }

    globalScope.Corrector = { analyzeInput };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = globalScope.Corrector;
    }
})(typeof window !== 'undefined' ? window : globalThis);
