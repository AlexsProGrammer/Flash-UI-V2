/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useProjectStore } from '../store';
import { X, Key, Check } from 'lucide-react';
import { toast } from 'sonner';

export const GlobalSettingsModal = () => {
    const { settings, setApiKey, toggleSettingsModal, isSettingsOpen } = useProjectStore();
    const [geminiKey, setGeminiKey] = useState(settings.apiKeys.gemini || '');
    const [keyValidation, setKeyValidation] = useState<string | null>(null);
    
    if (!isSettingsOpen) return null;

    const validateKey = (key: string) => {
        if (!key || key.trim().length === 0) {
            setKeyValidation('API Key is required');
            return false;
        }
        if (!key.startsWith('AIza')) {
            setKeyValidation('Invalid format. API Key should start with "AIza"');
            return false;
        }
        setKeyValidation(null);
        return true;
    };

    const handleInputChange = (value: string) => {
        setGeminiKey(value);
        if (value.length > 0) {
            validateKey(value);
        }
    };

    const handleSave = () => {
        if (!validateKey(geminiKey)) {
            return;
        }
        setApiKey('gemini', geminiKey);
        toast.success("API Key saved successfully!");
        toggleSettingsModal(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key size={18} /> Global Settings
                    </h3>
                    <button onClick={() => toggleSettingsModal(false)} className="text-white/40 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider mb-2 block">Google Gemini API Key</label>
                        <input 
                            type="password" 
                            value={geminiKey}
                            onChange={(e) => handleInputChange(e.target.value)}
                            className={`w-full bg-black/20 border rounded px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors ${
                                keyValidation 
                                    ? 'border-red-500/50 focus:border-red-500/50' 
                                    : 'border-white/10'
                            }`}
                            placeholder="AIza..."
                        />
                        {keyValidation ? (
                            <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                                <span>⚠️</span> {keyValidation}
                            </p>
                        ) : geminiKey ? (
                            <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
                                <span>✓</span> API Key format looks valid
                            </p>
                        ) : (
                            <p className="text-[10px] text-white/30 mt-2">Required for Gemini models. Stored locally in your browser.</p>
                        )}
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 space-y-3">
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Get Your API Key:</p>
                        <ol className="text-xs text-indigo-200/80 space-y-2 list-decimal list-inside">
                            <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-100 underline">Google AI Studio</a></li>
                            <li>Click "Create API Key" and select "Gemini API"</li>
                            <li>Copy the generated key (starts with "AIza")</li>
                            <li>Paste it above and save</li>
                        </ol>
                    </div>

                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <p className="text-xs text-green-200/80">
                            💡 <strong>Note:</strong> Your API key is stored <strong>only in your browser's local storage</strong> — never sent to our servers.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        onClick={() => toggleSettingsModal(false)}
                        className="text-white/60 hover:text-white px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2"
                    >
                        <Check size={14} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
