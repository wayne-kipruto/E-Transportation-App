import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, CargoClaim } from '../../types';
import { ShieldAlert, AlertTriangle, FileText, Camera, CheckCircle2, X, Lock, Gavel } from 'lucide-react';

interface DisputeModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ job, isOpen, onClose }) => {
  const { fileCargoClaim, resolveCargoClaim, currentUser } = useApp();

  const [claimType, setClaimType] = useState<CargoClaim['claimType']>('goods_damage');
  const [estimatedLossKes, setEstimatedLossKes] = useState<number>(15000);
  const [description, setDescription] = useState(
    '2 crates of laminated glass sustained structural cracking due to vibration on the escarpment sector.'
  );
  const [policeAbstractNumber, setPoliceAbstractNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  );

  // Resolution state if already disputed
  const [deductionKes, setDeductionKes] = useState(job.cargoClaim?.estimatedLossKes || 15000);
  const [resolutionNotes, setResolutionNotes] = useState('Mutual settlement: damaged crates deducted from final 50% payout.');

  if (!isOpen) return null;

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    fileCargoClaim(job.id, {
      raisedByUserId: currentUser.id,
      raisedByRole: currentUser.role === 'admin' ? 'supplier' : currentUser.role,
      claimType,
      description,
      estimatedLossKes,
      evidencePhotoUrls: [photoUrl],
      policeAbstractNumber: policeAbstractNumber.trim() || undefined,
      gitInsurancePolicyNo: job.gitInsurancePolicy,
    });
    onClose();
  };

  const handleSettle = (escalate = false) => {
    resolveCargoClaim(job.id, deductionKes, resolutionNotes, escalate);
    onClose();
  };

  const isAlreadyDisputed = !!job.cargoClaim;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Cargo Security, Theft &amp; Damage Protection</h3>
              <p className="text-xs text-rose-100">Goods In Transit (GIT) &amp; Escrow Holdback</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Claim Review or New Claim Form */}
        {isAlreadyDisputed ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Active Dispute Docket #{job.cargoClaim?.id.substring(6)}
                </span>
                <span className="text-[10px] font-mono bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded font-bold uppercase">
                  {job.cargoClaim?.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
                {job.cargoClaim?.claimType.replace('_', ' ')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">{job.cargoClaim?.description}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-rose-200 dark:border-rose-800/60">
                <span className="text-slate-500">Claimed Loss:</span>
                <strong className="text-rose-600 font-bold font-mono">
                  KES {job.cargoClaim?.estimatedLossKes.toLocaleString()}
                </strong>
              </div>
              {job.cargoClaim?.policeAbstractNumber && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Kenya Police Abstract: <strong className="font-mono">{job.cargoClaim.policeAbstractNumber}</strong>
                </div>
              )}
            </div>

            {/* Evidence Image */}
            {job.cargoClaim?.evidencePhotoUrls[0] && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Photographic Evidence Submitted:
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video">
                  <img
                    src={job.cargoClaim.evidencePhotoUrls[0]}
                    alt="Claim evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Settlement Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-amber-500" />
                Dispute Settlement &amp; Escrow Reconciliation
              </h4>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Agreed Deduction from Final 50% Balance (KES):
                </label>
                <input
                  type="number"
                  value={deductionKes}
                  onChange={(e) => setDeductionKes(Number(e.target.value))}
                  max={job.finalBalanceKes || 50000}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Settlement Summary Note:</label>
                <input
                  type="text"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSettle(false)}
                  className="flex-1 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow"
                >
                  Settle &amp; Release Adjusted Balance
                </button>
                <button
                  type="button"
                  onClick={() => handleSettle(true)}
                  className="px-3 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition"
                >
                  Escalate to Insurance
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFileClaim} className="p-6 space-y-4">
            {/* Security Explanation */}
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Escrow Protection Freeze Activated
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Filing a claim immediately locks the remaining 50% delivery settlement. Fastrucks verifies pre-trip loading inspection photos vs offload photos under the Goods In Transit policy.
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Discrepancy Category
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value as CargoClaim['claimType'])}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="goods_damage">Physical Cargo Damage (Crushed, broken, spoiled)</option>
                <option value="theft_pilferage">Theft / Cargo Pilferage in Transit</option>
                <option value="shortage_missing_units">Shortage / Missing Packages on Offload</option>
                <option value="seal_tampered">Container Seal Broken / Tampered</option>
                <option value="route_deviation">Unauthorized Route Deviation / Stop</option>
              </select>
            </div>

            {/* Estimated Loss in KES */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Estimated Financial Damage / Value (KES)
              </label>
              <input
                type="number"
                required
                min="1000"
                step="500"
                value={estimatedLossKes}
                onChange={(e) => setEstimatedLossKes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description of Damage or Circumstances
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Police OB (Optional / Mandatory for theft) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Kenya Police OB Number (Required for Theft)
              </label>
              <input
                type="text"
                value={policeAbstractNumber}
                onChange={(e) => setPoliceAbstractNumber(e.target.value)}
                placeholder="e.g. OB/42/10/10/2026 Nakuru Police Station"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>

            {/* Insurance Info Card */}
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Policy on Record:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{job.gitInsurancePolicy}</span>
              <span className="text-slate-500 block text-[10px] uppercase font-bold mt-1">Tamper Seal:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{job.containerSealNumber || 'SEAL-KE-884920'}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition"
              >
                File Claim &amp; Freeze Final Escrow
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
