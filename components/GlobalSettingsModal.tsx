/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { useProjectStore } from '../store';
import { X, Key, Check, AlertCircle, Zap } from 'lucide-react';
import { showSuccess } from '../utils/toastNotifications';
import { validateModelsJson, modelsToJson } from '../utils/validateModels';

export const GlobalSettingsModal = () => {
    const { settings, setApiKey, updateModels, toggleSettingsModal, isSettingsOpen } = useProjectStore();
    const [geminiKey, setGeminiKey] = useState(settings.apiKeys.gemini || '');
    const [keyValidation, setKeyValidation] = useState<string | null>(null);
    const [modelsJson, setModelsJson] = useState(modelsToJson(settings.models));
    const [modelsValidation, setModelsValidation] = useState<string[] | null>(null);
    const [activeTab, setActiveTab] = useState<'api' | 'models'>('api');
    const modelsTextAreaRef = useRef<HTMLTextAreaElement>(null);
    
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

    const validateModelsInput = (json: string) => {
        const result = validateModelsJson(json);
        if (!result.isValid) {
            setModelsValidation(result.errors);
            return false;
        }
        setModelsValidation(null);
        return true;
    };

    const handleModelsChange = (value: string) => {
        setModelsJson(value);
        if (value.trim().length > 0) {
            validateModelsInput(value);
        }
    };

    const testModels = () => {
        if (validateModelsInput(modelsJson)) {
            showSuccess("Models JSON is valid and ready to use!");
        }
    };

    const handleSave = () => {
        // Validate API key
        if (!validateKey(geminiKey)) {
            setActiveTab('api');
            return;
        }

        // Validate models JSON
        if (!validateModelsInput(modelsJson)) {
            setActiveTab('models');
            return;
        }

        // Save API key
        setApiKey('gemini', geminiKey);

        // Save models
        const result = validateModelsJson(modelsJson);
        if (result.models) {
            updateModels(result.models);
        }

        showSuccess("Settings saved successfully!");
        toggleSettingsModal(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[85vh] overflow-auto">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 sticky top-0 bg-[#18181b]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key size={18} /> Global Settings
                    </h3>
                    <button onClick={() => toggleSettingsModal(false)} className="text-white/40 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('api')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'api'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-white/60 hover:text-white'
                        }`}
                    >
                        API Configuration
                    </button>
                    <button
                        onClick={() => setActiveTab('models')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'models'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-white/60 hover:text-white'
                        }`}
                    >
                        <Zap size={14} />
                        AI Models
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'api' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'models' && (
                        <>
                            <div>
                                <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider mb-2 flex items-center justify-between">
                                    <span>AI Models Configuration (JSON)</span>
                                    <button
                                        type="button"
                                        onClick={testModels}
                                        className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Test Configuration
                                    </button>
                                </label>
                                <textarea
                                    ref={modelsTextAreaRef}
                                    value={modelsJson}
                                    onChange={(e) => handleModelsChange(e.target.value)}
                                    className={`w-full bg-black/20 border rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500/50 transition-colors resize-none ${
                                        modelsValidation 
                                            ? 'border-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/10'
                                    }`}
                                    rows={12}
                                    placeholder={'{\n  "model-id": "Display Name",\n  "gemini-2.5-pro": "Gemini 2.5 Pro"\n}'}
                                />
                                {modelsValidation ? (
                                    <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-[10px] text-red-300 font-semibold flex items-center gap-2 mb-2">
                                            <AlertCircle size={14} /> Validation Errors:
                                        </p>
                                        <ul className="text-[10px] text-red-200 space-y-1 list-disc list-inside">
                                            {modelsValidation.map((error, i) => (
                                                <li key={i}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : modelsJson ? (
                                    <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
                                        <span>✓</span> Models JSON is valid
                                    </p>
                                ) : null}
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-3">
                                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Format Instructions:</p>
                                <div className="text-xs text-blue-200/80 space-y-2">
                                    <p>• Use <code className="bg-black/30 px-2 py-1 rounded">model-id</code> as the key (e.g., <code className="bg-black/30 px-2 py-1 rounded">gemini-2.5-pro</code>)</p>
                                    <p>• Use display name as the value (e.g., <code className="bg-black/30 px-2 py-1 rounded">Gemini 2.5 Pro</code>)</p>
                                    <p>• Each model ID must be lowercase with hyphens or underscores</p>
                                    <p>• Display names can be any text up to 100 characters</p>
                                    <p>• All values must be valid JSON format</p>
                                </div>
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                                <p className="text-xs text-amber-200/80">
                                    ⚠️ <strong>Note:</strong> Changes to models will be available when you generate new designs. Test your configuration before saving to ensure all models are valid.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-[#18181b] pt-4 border-t border-white/5">
                    <button 
                        onClick={() => toggleSettingsModal(false)}
                        className="text-white/60 hover:text-white px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={keyValidation !== null || modelsValidation !== null}
                    >
                        <Check size={14} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
