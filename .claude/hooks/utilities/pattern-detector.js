/**
 * Pattern Detector for Natural Language Memory Triggers
 * Detects when user messages suggest memory context would be helpful
 */

class PatternDetector {
    constructor(config = {}) {
        this.config = config;
        this.sensitivity = config.sensitivity || 0.7;
        this.patterns = config.patterns || {};

        // Compile regex patterns for performance
        this.compiledPatterns = this.compilePatterns();

        // Statistics
        this.stats = {
            totalMatches: 0,
            patternHits: new Map()
        };
    }

    /**
     * Compile string patterns to RegExp objects
     */
    compilePatterns() {
        const compiled = {};

        for (const [tier, categories] of Object.entries(this.patterns)) {
            compiled[tier] = {};
            for (const [category, patterns] of Object.entries(categories)) {
                compiled[tier][category] = patterns.map(p => ({
                    regex: new RegExp(p.pattern, 'i'),
                    confidence: p.confidence,
                    description: p.description
                }));
            }
        }

        return compiled;
    }

    /**
     * Detect patterns in a message
     */
    detectPatterns(message, enabledTiers = ['instant', 'fast']) {
        const results = {
            matches: [],
            confidence: 0,
            shouldTrigger: false,
            processingTier: 'none'
        };

        if (!message || typeof message !== 'string') {
            return results;
        }

        // Process instant tier patterns
        if (enabledTiers.includes('instant') && this.compiledPatterns.instant) {
            const instantMatches = this.detectTierPatterns(message, 'instant');
            results.matches.push(...instantMatches);
            results.processingTier = 'instant';

            // Early return for high confidence instant matches
            const maxConfidence = Math.max(...instantMatches.map(m => m.confidence), 0);
            if (maxConfidence > 0.8) {
                results.confidence = maxConfidence;
                results.shouldTrigger = true;
                return results;
            }
        }

        // Process fast tier patterns
        if (enabledTiers.includes('fast') && this.compiledPatterns.fast) {
            const fastMatches = this.detectTierPatterns(message, 'fast');
            results.matches.push(...fastMatches);
            if (results.processingTier === 'none') {
                results.processingTier = 'fast';
            }
        }

        // Calculate overall confidence
        if (results.matches.length > 0) {
            // Use weighted average, giving more weight to higher confidence matches
            const totalWeight = results.matches.reduce((sum, m) => sum + m.confidence, 0);
            const weightedSum = results.matches.reduce((sum, m) => sum + (m.confidence * m.confidence), 0);
            results.confidence = weightedSum / totalWeight;

            // Apply sensitivity adjustment
            results.confidence *= this.sensitivity;

            // Determine if should trigger
            const threshold = this.config.triggerThreshold || 0.6;
            results.shouldTrigger = results.confidence >= threshold;
        }

        // Update statistics
        this.stats.totalMatches += results.matches.length;
        for (const match of results.matches) {
            const count = this.stats.patternHits.get(match.category) || 0;
            this.stats.patternHits.set(match.category, count + 1);
        }

        return results;
    }

    /**
     * Detect patterns for a specific tier
     */
    detectTierPatterns(message, tier) {
        const matches = [];
        const tierPatterns = this.compiledPatterns[tier];

        if (!tierPatterns) return matches;

        for (const [category, patterns] of Object.entries(tierPatterns)) {
            for (const pattern of patterns) {
                if (pattern.regex.test(message)) {
                    matches.push({
                        category,
                        confidence: pattern.confidence,
                        description: pattern.description,
                        tier,
                        matched: message.match(pattern.regex)?.[0] || ''
                    });
                }
            }
        }

        return matches;
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.stats,
            patternHits: Object.fromEntries(this.stats.patternHits)
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalMatches: 0,
            patternHits: new Map()
        };
    }
}

module.exports = { PatternDetector };
