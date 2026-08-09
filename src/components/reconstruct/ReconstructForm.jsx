import React, { useState } from 'react';
import { Key, Upload, FileImage, Unlock, Trash2, Plus, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import ReconstructResult from './ReconstructResult';
import ErrorBanner from '../common/ErrorBanner';
import { reconstructSecret } from '../../api/secrets';

export default function ReconstructForm({ backendOnline }) {
  const [secretId, setSecretId] = useState('');
  const [stegoFiles, setStegoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Store full response object to handle BOTH text and binary file outputs
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Append new files without overwriting existing selections
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setStegoFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setStegoFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!secretId.trim()) {
      const errMsg = 'Please provide the Secret ID.';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    if (stegoFiles.length < 2) {
      const errMsg = 'Please select at least 2 stego PNG image files to attempt reconstruction.';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('secret_id', secretId.trim());

      for (let i = 0; i < stegoFiles.length; i++) {
        formData.append('stego_images', stegoFiles[i]);
      }

      const response = await reconstructSecret(formData);

      // Save complete backend response object
      setResult(response);
      toast.success('Secret reconstructed successfully!');
    } catch (err) {
      const errMsg =
        err.response?.data?.detail ||
        'Failed to reconstruct secret. Ensure the Secret ID matches and at least threshold (k) valid stego images are provided.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors"
      >
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Reconstruct Secret from Stego Images
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Enter your <strong className="text-slate-800 dark:text-slate-200">Secret ID</strong> and upload at least <strong className="text-slate-800 dark:text-slate-200">threshold (k) stego PNG images</strong> to recover the original payload.
        </p>

        {/* Secret ID Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-blue-500" /> Secret ID
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 031dba3c-b22b-4d77-8f52-f13135249a4c"
            value={secretId}
            onChange={(e) => setSecretId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono"
          />
        </div>

        {/* Upload Dropzone */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-900/30 transition-all">
          <input
            type="file"
            multiple
            accept="image/png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Plus className="w-4 h-4 text-blue-500" /> Click or drag stego PNG files here
            </span>
            <span className="text-[10px] text-slate-400">
              Hold Ctrl/Cmd or add files one by one
            </span>
          </div>
        </div>

        {/* Selected File Chips List */}
        {stegoFiles.length > 0 && (
          <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Selected Stego Files ({stegoFiles.length}):
              </span>
              <button
                type="button"
                onClick={() => setStegoFiles([])}
                className="text-red-500 hover:underline text-[11px]"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {stegoFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
                >
                  <FileImage className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate max-w-[160px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !secretId.trim() || stegoFiles.length < 2 || !backendOnline}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Unlock className="w-4 h-4" />
          {loading ? 'Extracting Shares & Reconstructing...' : `Reconstruct Secret (${stegoFiles.length} shares selected)`}
        </button>
      </form>

      {/* Error Banner */}
      <ErrorBanner message={error} />

      {/* Result Output (Renders text OR downloadable file) */}
      <ReconstructResult result={result} />
    </div>
  );
}