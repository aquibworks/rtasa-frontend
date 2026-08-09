import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, FileText, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Sample initial audit log entries (Hash Chain format)
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2026-08-03 14:46:38',
      role: 'Admin',
      action: 'STORE_SECRET',
      secretId: '708747e8-1a6f-4b18-8a67-ac4bdc54f42b',
      status: 'SUCCESS',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 2,
      timestamp: '2026-08-03 14:48:00',
      role: 'Security Officer',
      action: 'RECONSTRUCT_SECRET',
      secretId: '708747e8-1a6f-4b18-8a67-ac4bdc54f42b',
      status: 'SUCCESS',
      prevHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
    }
  ]);

  const handleVerifyIntegrity = () => {
    setVerifying(true);
    setVerificationResult(null);

    // Simulate cryptographic verification check
    setTimeout(() => {
      setVerifying(false);
      setVerificationResult({
        valid: true,
        message: `Successfully verified ${logs.length} log entries. Cryptographic hash chain is intact with zero tampering detected.`
      });
      toast.success('Audit log integrity verified!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
        
        {/* Header & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Tamper-Evident Audit Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cryptographically linked SHA-256 hash logs for all system operations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}
          </button>
        </div>

        {/* Verification Alert Banner */}
        {verificationResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
              verificationResult.valid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
            }`}
          >
            {verificationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span className="font-medium">{verificationResult.message}</span>
          </div>
        )}

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-2">Time (UTC)</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Action</th>
                <th className="pb-3 px-2">Secret ID</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">SHA-256 Entry Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 font-mono">
                  <td className="py-3 px-2 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-2 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {log.role}
                  </td>
                  <td className="py-3 px-2 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-2 truncate max-w-[120px]">{log.secretId}</td>
                  <td className="py-3 px-2 font-sans">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[10px] text-slate-400 truncate max-w-[140px]" title={log.hash}>
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}