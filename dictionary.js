(function (globalScope) {
    'use strict';

    const referenceSequence = [
        'npm',
        'install',
        'build',
        'test',
        'deploy'
    ];

    function normalizeToken(token) {
        if (typeof token !== 'string') {
            return '';
        }

        return token.trim().toLowerCase().replace(/[^\w-]/g, '');
    }

    function buildTokenIndexMap(sequence) {
        const indexMap = {};

        sequence.forEach((token, index) => {
            const normalizedToken = normalizeToken(token);
            if (normalizedToken) {
                indexMap[normalizedToken] = index;
            }
        });

        return indexMap;
    }

    const tokenIndexMap = buildTokenIndexMap(referenceSequence);

    function getReferenceSequence() {
        return referenceSequence.slice();
    }

    function mapTokenToIndex(token) {
        const normalizedToken = normalizeToken(token);

        if (!normalizedToken) {
            return -1;
        }

        return Object.prototype.hasOwnProperty.call(tokenIndexMap, normalizedToken)
            ? tokenIndexMap[normalizedToken]
            : -1;
    }

    function mapTokensToIndices(tokens) {
        if (!Array.isArray(tokens)) {
            return [];
        }

        return tokens.map(mapTokenToIndex);
    }

    const dictionaryApi = {
        referenceSequence: getReferenceSequence(),
        getReferenceSequence,
        mapTokenToIndex,
        mapTokensToIndices
    };

    globalScope.Dictionary = dictionaryApi;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = dictionaryApi;
    }
})(typeof window !== 'undefined' ? window : globalThis);
