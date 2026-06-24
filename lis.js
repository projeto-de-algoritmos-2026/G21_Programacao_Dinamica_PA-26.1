(function (globalScope) {
    'use strict';

    function initializeLisState(values) {
        if (!Array.isArray(values)) {
            return {
                values: [],
                lengths: [],
                predecessors: [],
                bestIndex: -1
            };
        }

        const lengths = new Array(values.length).fill(1);
        const predecessors = new Array(values.length).fill(-1);
        const bestIndex = values.length > 0 ? 0 : -1;

        return {
            values: values.slice(),
            lengths,
            predecessors,
            bestIndex
        };
    }

    function computeLis(values) {
        const normalizedValues = Array.isArray(values) ? values.slice() : [];
        const state = initializeLisState(normalizedValues);

        return {
            ...state,
            sequence: []
        };
    }

    function computeLisFromTokens(tokens, mapper) {
        if (!Array.isArray(tokens)) {
            return computeLis([]);
        }

        const mappedValues = tokens.map((token) => {
            if (typeof mapper === 'function') {
                return mapper(token);
            }

            return token;
        });

        return computeLis(mappedValues);
    }

    const lisApi = {
        initializeLisState,
        computeLis,
        computeLisFromTokens
    };

    globalScope.LIS = lisApi;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = lisApi;
    }
})(typeof window !== 'undefined' ? window : globalThis);
