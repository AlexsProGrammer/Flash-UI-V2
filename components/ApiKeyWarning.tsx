/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { AlertCircle, Settings, Key } from 'lucide-react';
import { validateGeminiApiKey } from '../utils/validateApiKey';
import { useProjectStore } from '../store';

export const ApiKeyWarning = () => {
    const [showWarning, setShowWarning] = useState(false);
    const { toggleSettingsModal } = useProjectStore();

    useEffect(() => {
        const validation = validateGeminiApiKey();
        if (!validation.isValid) {
            setShowWarning(true);
        }
    }, []);

    if (!showWarning) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-red-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Gemini API Key Required</h3>
                </div>

                <div className="space-y-4 mb-6">
                    <p className="text-sm text-white/80 leading-relaxed">
                        Flash UI requires a Google Gemini API key to generate UI designs. Without it, the generation features won't work.
                    </p>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold text-red-300 uppercase tracking-wider flex items-center gap-2">
                            <Key size={14} />
                            How to set up your API key:
                        </p>
                        <ol className="text-xs text-white/70 space-y-1 ml-6 list-decimal">
                            <li>Get your free Gemini API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Google AI Studio</a></li>
                            <li>Copy your API key (starts with "AIza")</li>
                            <li>Go to Settings and paste it in the Gemini API Key field</li>
                            <li>Your key is stored locally in your browser only</li>
                        </ol>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-xs text-blue-200">
                            💡 <strong>Tip:</strong> You can also set the <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">GEMINI_API_KEY</code> environment variable for development.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowWarning(false)}
                        className="text-white/60 hover:text-white px-4 py-2 text-sm"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => {
                            toggleSettingsModal(true);
                            setShowWarning(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Settings size={14} />
                        Open Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
