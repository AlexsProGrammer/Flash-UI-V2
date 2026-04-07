/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Toast notification utilities with consistent styling
 */

import { toast } from 'sonner';

/**
 * Show success notification with green styling
 */
export const showSuccess = (message: string, description?: string) => {
    return toast.success(message, {
        description,
        style: {
            background: '#10b981',
            borderColor: '#059669',
            color: '#ffffff',
        },
        icon: '✓',
    });
};

/**
 * Show error notification with red styling
 */
export const showError = (message: string, description?: string) => {
    return toast.error(message, {
        description,
        style: {
            background: '#ef4444',
            borderColor: '#dc2626',
            color: '#ffffff',
        },
        icon: '✕',
    });
};

/**
 * Show info notification with blue styling
 */
export const showInfo = (message: string, description?: string) => {
    return toast.info(message, {
        description,
        style: {
            background: '#3b82f6',
            borderColor: '#2563eb',
            color: '#ffffff',
        },
        icon: 'ℹ',
    });
};

/**
 * Show warning notification with amber styling
 */
export const showWarning = (message: string, description?: string) => {
    return toast.warning(message, {
        description,
        style: {
            background: '#f59e0b',
            borderColor: '#d97706',
            color: '#ffffff',
        },
        icon: '⚠',
    });
};

/**
 * Show loading notification (no auto-dismiss)
 */
export const showLoading = (message: string) => {
    return toast.loading(message, {
        style: {
            background: '#6366f1',
            borderColor: '#4f46e5',
            color: '#ffffff',
        },
    });
};
