/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface ApiKeyValidationResult {
    isValid: boolean;
    message: string;
    hasEnvKey: boolean;
    hasStoredKey: boolean;
}

export const validateGeminiApiKey = (): ApiKeyValidationResult => {
    // Check environment variable
    let envKey = '';
    try {
        // @ts-ignore
        envKey = process.env.GEMINI_API_KEY || '';
    } catch {
        envKey = '';
    }

    // Check localStorage
    let storedKey = '';
    try {
        storedKey = localStorage.getItem('flashui_gemini_key') || '';
    } catch {
        storedKey = '';
    }

    const hasEnvKey = !!envKey;
    const hasStoredKey = !!storedKey;
    const apiKey = envKey || storedKey;

    if (!apiKey || apiKey.trim().length === 0) {
        return {
            isValid: false,
            message: 'No Gemini API Key found. Please add your API key in Settings to use Flash UI.',
            hasEnvKey: false,
            hasStoredKey: false
        };
    }

    // Validate API key format (should start with 'AIza' for Gemini)
    if (!apiKey.startsWith('AIza')) {
        return {
            isValid: false,
            message: 'Invalid Gemini API Key format. It should start with "AIza". Please check your API key.',
            hasEnvKey,
            hasStoredKey
        };
    }

    return {
        isValid: true,
        message: 'API Key is valid',
        hasEnvKey,
        hasStoredKey
    };
};

export const getGeminiApiKey = (): string => {
    try {
        // @ts-ignore
        return process.env.GEMINI_API_KEY || localStorage.getItem('flashui_gemini_key') || '';
    } catch {
        return '';
    }
};
