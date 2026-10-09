import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { CheckCircle2, Camera, ShieldCheck, KeyRound, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PodModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const PodModal: React.FC<PodModalProps> = ({ job, isOpen, onClose }) => {
  const { submitProofOfDelivery, sendChatMessage } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [consigneeName, setConsigneeName] = useState(job.consigneeContact?.name || '');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  );
  const [notes, setNotes] = useState('Offloaded at warehouse bay 2. Consignee verified goods complete with no breakage.');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = submitProofOfDelivery(job.id, {
      photoUrl,
      consigneeSignatureName: consigneeName,
      notes,
      enteredPin,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to submit proof of delivery');
      return;
    }

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    sendChatMessage(
      job.id,
      `✅ [DELIVERY COMPLETED]: Driver submitted digital e-POD verified by recipient ${consigneeName}. M-Pesa escrow is ready for release!`
    );

    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Digital Proof of Delivery (e-POD)</h3>
              <p className="text-xs text-emerald-100">Consignee sign-off &amp; PIN verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delivery Verified &amp; Signed Off!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The e-POD has been recorded on the ledger. The supplier will now release the M-Pesa escrow payment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Consignee PIN Check */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  Consignee 4-Digit Security PIN
                </label>
                {job.consigneeContact?.pin && (
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    Demo PIN: {job.consigneeContact.pin}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Ask the receiving party at {job.destination} for their delivery confirmation PIN:
              </p>
              <input
                type="text"
                required
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter 4-digit PIN (e.g. 8492)"
                className="w-full text-center text-lg font-mono font-bold tracking-widest px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Consignee / Receiver Name
              </label>
              <input
                type="text"
                required
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
                placeholder="Full name of person who received the goods"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Offloading Photo Evidence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Offloaded Cargo Photographic Proof</span>
                <span className="text-[11px] text-slate-400">Timestamped</span>
              </label>
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                <img
                  src={photoUrl}
                  alt="Offloaded Cargo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    <Camera className="w-3.5 h-3.5" /> High-Resolution Inspection Shot
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        photoUrl.includes('ad8dd3c8310d')
                          ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
                      )
                    }
                    className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition"
                  >
                    Swap Demo Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Inspection &amp; Condition Remarks
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit e-POD &amp; Claim Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
