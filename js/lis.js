(function (globalScope) {
    'use strict';

    function initializeLisState(values) {
        if (!Array.isArray(values)) {
            return { values: [], lengths: [], predecessors: [], bestIndex: -1 };
        }
        return {
            values: values.slice(),
            lengths: new Array(values.length).fill(1),
            predecessors: new Array(values.length).fill(-1),
            bestIndex: values.length > 0 ? 0 : -1
        };
    }

    function computeLis(values) {
        const normalizedValues = Array.isArray(values) ? values.slice() : [];
        const state = initializeLisState(normalizedValues);

        if (normalizedValues.length <= 1) {
            return { ...state, sequence: [] };
        }

        for (let i = 1; i < normalizedValues.length; i += 1) {
            let bestLength = 1;
            let bestPredecessor = -1;

            for (let j = 0; j < i; j += 1) {
                const currentValue = normalizedValues[i];
                const previousValue = normalizedValues[j];

                if (previousValue < currentValue && state.lengths[j] + 1 > bestLength) {
                    bestLength = state.lengths[j] + 1;
                    bestPredecessor = j;
                }
            }

            state.lengths[i] = bestLength;
            state.predecessors[i] = bestPredecessor;

            if (bestLength > state.lengths[state.bestIndex]) {
                state.bestIndex = i;
            }
        }

        return { ...state, sequence: findSubsequence(state) };
    }

    function findSubsequence(state) {
        const sequence = [];
        let currentIndex = state.bestIndex;

        while (currentIndex !== -1) {
            sequence.unshift(state.values[currentIndex]);
            currentIndex = state.predecessors[currentIndex];
        }

        return sequence;
    }

    function computeLisFromTokens(tokens, mapper) {
        if (!Array.isArray(tokens)) return computeLis([]);
        
        const mappedValues = tokens.map((token) => {
            if (typeof mapper === 'function') return mapper(token);
            return token;
        });

        return computeLis(mappedValues);
    }

    const lisApi = { initializeLisState, computeLis, computeLisFromTokens, findSubsequence };
    globalScope.LIS = lisApi;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = lisApi;
    }
})(typeof window !== 'undefined' ? window : globalThis);
