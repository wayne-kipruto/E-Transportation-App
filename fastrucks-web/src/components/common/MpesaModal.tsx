import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Lock, ArrowRight, Loader2, X, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amountKes: number;
  initialPhone?: string;
  accountReference: string;
  onSuccess: (receipt: string) => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  isOpen,
  onClose,
  title,
  amountKes,
  initialPhone = '+254 780 058000',
  accountReference,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [step, setStep] = useState<'prompt' | 'simulating_push' | 'pin_screen' | 'confirmed'>('prompt');
  const [pin, setPin] = useState('');
  const [receiptCode, setReceiptCode] = useState('');

  if (!isOpen) return null;

  const handleSendStk = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('simulating_push');
    setTimeout(() => {
      setStep('pin_screen');
    }, 1400);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('simulating_push');
    const generatedReceipt = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
    setReceiptCode(generatedReceipt);

    setTimeout(() => {
      setStep('confirmed');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onSuccess(generatedReceipt);
        onClose();
        setStep('prompt');
        setPin('');
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden">
        {/* Top M-Pesa branding banner */}
        <div className="bg-[#00A859] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-xl tracking-tight">M-PESA</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              Daraja STK Push
            </span>
          </div>
          <p className="text-xs text-white/90">{title}</p>
          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between">
            <span className="text-xs text-white/80">Payable Amount:</span>
            <span className="text-lg font-black tracking-tight">KES {amountKes.toLocaleString()}</span>
          </div>
        </div>

        {/* Content based on STK state */}
        <div className="p-5">
          {step === 'prompt' && (
            <form onSubmit={handleSendStk} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  M-Pesa Registered Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full pl-9 pr-3 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  An instant payment push prompt will appear on this handset.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Fastrucks Escrow Hub</span>
                </div>
                <div className="flex justify-between">
                  <span>Paybill / Shortcode:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">400200</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Ref:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{accountReference}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#00A859] hover:bg-[#008f4c] text-white font-bold text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Trigger STK Push Notification
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'simulating_push' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#00A859] animate-spin mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Contacting Safaricom Gateway...</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sending prompt to <strong>{phoneNumber}</strong> via Daraja API. Please check mobile screen.
              </p>
            </div>
          )}

          {step === 'pin_screen' && (
            <form onSubmit={handleConfirmPin} className="space-y-4 animate-fade-in">
              <div className="border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl text-center">
                <div className="text-[11px] font-bold text-[#00A859] uppercase tracking-wider mb-1">
                  Simulated Phone Screen Prompt
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Do you want to pay KES {amountKes.toLocaleString()} to FASTRUCKS ESCROW?
                </p>

                <div className="mt-3">
                  <label className="block text-[11px] text-slate-500 mb-1">Enter 4-Digit M-Pesa PIN:</label>
                  <div className="flex justify-center">
                    <input
                      type="password"
                      maxLength={4}
                      autoFocus
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-32 text-center text-2xl font-mono tracking-widest py-1.5 rounded-lg border border-emerald-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Enter any 4 numbers (e.g. 1234)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={pin.length < 4}
                className="w-full py-3 rounded-xl bg-[#00A859] disabled:opacity-50 hover:bg-[#008f4c] text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Authorize Payment
              </button>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="py-6 text-center space-y-2 animate-scale-up">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-[#00A859] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Payment Confirmed!</h4>
              <p className="text-xs text-slate-500">
                Receipt Number: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{receiptCode}</span>
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                Funds successfully held in Fastrucks Escrow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
