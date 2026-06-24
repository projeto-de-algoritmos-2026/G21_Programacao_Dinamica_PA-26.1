(function (globalScope) {
    'use strict';

    /**
     * Módulo Corrector
     * Analisa o resultado do LIS em conjunto com a entrada original para identificar
     * quais tokens mantiveram a estrutura correta e quais ficaram de fora (descartados).
     */

    function analyzeInput(originalTokens, lisResult) {
        if (!originalTokens || originalTokens.length === 0) {
            return {
                correctTokens: [],
                incorrectTokens: [],
                suggestion: ""
            };
        }

        // Se a sequência do LIS não existir, todos os tokens estão fora de ordem/inválidos
        if (!lisResult || !lisResult.sequence || lisResult.sequence.length === 0) {
            return {
                correctTokens: [],
                incorrectTokens: originalTokens.map((token, index) => ({ token, index, action: 'remover' })),
                suggestion: "Nenhuma estrutura válida reconhecida."
            };
        }

        // Como precisamos saber a posição exata de cada token do LIS na entrada do usuário,
        // rastreamos os índices originais usando o vetor de predecessores que o Miguel implementou.
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
                // Tokens ignorados pela LIS quebraram o gabarito
                incorrectTokens.push({ token, index, action: 'remover/reposicionar' });
            }
        });

        // Gera uma sugestão baseada nos tokens que foram aceitos
        const validCommandStr = correctTokens.map(item => item.token).join(" ");
        const suggestion = validCommandStr.length > 0 
            ? `Você quis dizer: "${validCommandStr}"?`
            : "Nenhuma estrutura válida reconhecida.";

        return {
            correctTokens,
            incorrectTokens,
            lisOriginalIndices,
            suggestion
        };
    }

    const correctorApi = {
        analyzeInput
    };

    globalScope.Corrector = correctorApi;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = correctorApi;
    }
})(typeof window !== 'undefined' ? window : globalThis);
