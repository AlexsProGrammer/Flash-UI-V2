/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface ModelValidationResult {
    isValid: boolean;
    errors: string[];
    models?: Record<string, string>;
}

/**
 * Validates models JSON format
 * Expected format: { "model-id": "Model Display Name", ... }
 */
export const validateModelsJson = (jsonString: string): ModelValidationResult => {
    const errors: string[] = [];

    if (!jsonString || jsonString.trim().length === 0) {
        return {
            isValid: false,
            errors: ['Models JSON cannot be empty']
        };
    }

    // Try to parse JSON
    let parsed: any;
    try {
        parsed = JSON.parse(jsonString);
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        return {
            isValid: false,
            errors: [`Invalid JSON format: ${errorMsg}`]
        };
    }

    // Check if it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        errors.push('Models must be a JSON object (not an array)');
        return { isValid: false, errors };
    }

    // Validate each key-value pair
    const models: Record<string, string> = {};
    const keys = Object.keys(parsed);

    if (keys.length === 0) {
        errors.push('At least one model must be defined');
        return { isValid: false, errors };
    }

    for (const key of keys) {
        const value = parsed[key];

        // Validate key (model ID)
        if (typeof key !== 'string' || key.trim().length === 0) {
            errors.push(`Invalid model ID: "${key}" - must be a non-empty string`);
            continue;
        }

        // Keys should follow pattern like "gemini-2.5-pro"
        if (!/^[a-z0-9\-_.]+$/.test(key)) {
            errors.push(`Invalid model ID: "${key}" - use lowercase letters, numbers, hyphens, underscores, and dots`);
            continue;
        }

        // Validate value (display name)
        if (typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`Invalid display name for model "${key}" - must be a non-empty string`);
            continue;
        }

        if (value.length > 100) {
            errors.push(`Display name for model "${key}" is too long (max 100 characters)`);
            continue;
        }

        models[key] = value.trim();
    }

    if (errors.length > 0) {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        models
    };
};

/**
 * Convert models object to pretty JSON string
 */
export const modelsToJson = (models: Record<string, string>): string => {
    return JSON.stringify(models, null, 2);
};

/**
 * Convert array of model objects to models object format
 */
export const convertModelsArrayToObject = (
    models: Array<{ id: string; name: string }>
): Record<string, string> => {
    const result: Record<string, string> = {};
    models.forEach(model => {
        result[model.id] = model.name;
    });
    return result;
};

/**
 * Convert models object to array format (for compatibility)
 */
export const convertModelsObjectToArray = (
    models: Record<string, string>
): Array<{ id: string; name: string }> => {
    return Object.entries(models).map(([id, name]) => ({
        id,
        name
    }));
};
