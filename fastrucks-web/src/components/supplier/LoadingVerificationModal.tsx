import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { CheckCircle2, Truck, Fuel, Camera, ShieldCheck, X, ArrowRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoadingVerificationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const LoadingVerificationModal: React.FC<LoadingVerificationModalProps> = ({ job, isOpen, onClose }) => {
  const { verifyLoadingAndReleaseFuelAdvance } = useApp();

  const [loadingPhoto, setLoadingPhoto] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  );
  const [sealConfirmed, setSealConfirmed] = useState(job.containerSealNumber || 'SEAL-KE-77192');
  const [checkedStraps, setCheckedStraps] = useState(true);
  const [checkedTareWeight, setCheckedTareWeight] = useState(true);
  const [checkedWeatherproof, setCheckedWeatherproof] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  const fuelAdvance = job.fuelAdvanceKes || Math.round((job.agreedPriceKes || job.offeredPriceKes) * 0.5);

  const handleVerifyAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await verifyLoadingAndReleaseFuelAdvance(job.id, {
      loadingPhotoUrl: loadingPhoto,
      sealConfirmed,
    });

    if (res.success) {
      setReceiptNumber(res.receiptNumber);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Warehouse Loading Verification</h3>
              <p className="text-xs text-amber-100">Verify cargo is loaded before releasing 50% fuel advance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Loading Verified &amp; 50% Advance Disbursed!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              M-Pesa Receipt: <strong className="font-mono text-emerald-600">{receiptNumber}</strong>
            </p>
            <p className="text-xs text-slate-500">
              KES {fuelAdvance.toLocaleString()} transferred to transporter {job.assignedTransporterName}. Truck cleared for departure!
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerifyAndPay} className="p-6 space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-amber-600" />
                Physical Loading Verification Requirement
              </span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                To protect against false starts, the 50% fuel advance is released only after you confirm the materials have been physically loaded onto the truck at <strong>{job.origin}</strong>.
              </p>
            </div>

            {/* Transporter & Consignment */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transporter:</span>
                <strong className="text-slate-800 dark:text-slate-200">{job.assignedTransporterName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cargo Payload:</span>
                <span>{job.tonnage} Tonnes • {job.goodsCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Corridor Route:</span>
                <span>{job.origin} ➔ {job.destination}</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Warehouse Dispatch Safety Checklist
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={checkedStraps}
                  onChange={(e) => setCheckedStraps(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Cargo strapped securely with heavy ratchet tie-downs &amp; corner buffers
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={checkedTareWeight}
                  onChange={(e) => setCheckedTareWeight(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Axle weight inspected within KeNHA corridor limits ({job.tonnage}T)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={checkedWeatherproof}
                  onChange={(e) => setCheckedWeatherproof(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Enclosure locked / tarpaulin sealed for weather &amp; dust protection
                </span>
              </label>
            </div>

            {/* Tamper Seal confirmation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Confirmed Serial Tamper Seal #
              </label>
              <input
                type="text"
                required
                value={sealConfirmed}
                onChange={(e) => setSealConfirmed(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Photo preview */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Loading Bay Inspection Photo</span>
                <span className="text-[10px] text-slate-400">Timestamped proof</span>
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video relative">
                <img src={loadingPhoto} alt="Loading bay" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-[11px] flex justify-between items-center">
                  <span>Strapped pallets on truck bed</span>
                  <button
                    type="button"
                    onClick={() =>
                      setLoadingPhoto(
                        loadingPhoto.includes('ad8dd3c8310d')
                          ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'
                          : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'
                      )
                    }
                    className="underline text-[10px]"
                  >
                    Swap Demo Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Fuel Advance Payout Pill */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">
                  Disbursing 1st Milestone (50% Fuel Advance):
                </span>
                <span className="text-base font-black text-emerald-600">
                  KES {fuelAdvance.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Transfers to driver M-Pesa phone
              </span>
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
                disabled={!checkedStraps || !checkedTareWeight}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Loading &amp; Release 50% Fuel Advance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
