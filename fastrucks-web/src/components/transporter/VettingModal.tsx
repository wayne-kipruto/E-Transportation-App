import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { ShieldCheck, FileText, Camera, CheckCircle2, Clock, AlertTriangle, X, UploadCloud, AlertCircle } from 'lucide-react';

interface VettingModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const VettingModal: React.FC<VettingModalProps> = ({ user, isOpen, onClose }) => {
  const { updateUserDocuments, updateUserVerification } = useApp();

  const [logbook, setLogbook] = useState(
    user.documents?.logbookUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
  );
  const [license, setLicense] = useState(
    user.documents?.licenseUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [frontPhoto, setFrontPhoto] = useState(
    user.documents?.vehiclePhotoFront || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
  );
  const [sidePhoto, setSidePhoto] = useState(
    user.documents?.vehiclePhotoSide || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80'
  );

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isAgeCompliant = user.age >= 28;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDocuments(user.id, {
      logbookUrl: logbook,
      licenseUrl: license,
      vehiclePhotoFront: frontPhoto,
      vehiclePhotoSide: sidePhoto,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  const handleInstantVerifyForDemo = () => {
    updateUserDocuments(user.id, {
      logbookUrl: logbook,
      licenseUrl: license,
      vehiclePhotoFront: frontPhoto,
      vehiclePhotoSide: sidePhoto,
    });
    updateUserVerification(user.id, 'verified');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl my-8 overflow-hidden">
        {/* Header - Styled like Figure 5.5 Transporter Verification Header */}
        <div className="bg-amber-100 dark:bg-amber-950/60 p-5 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Transporter Verification ({user.email})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Kenya Traffic Act CAP 403 &amp; Safety Compliance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Description from Thesis Figure 5.5 */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome Transporter and thank you for choosing <strong>Fastrucks</strong>. Before you can start accepting jobs, we have to verify a few things to assure our suppliers that our their goods are safe and that our transporters are <strong>TRUSTWORTHY</strong>.
          </p>

          {/* CAP 403 Age Check Banner */}
          <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            isAgeCompliant
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}>
            {isAgeCompliant ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            )}
            <div>
              <span className="font-bold">Statutory Age Check: </span>
              {isAgeCompliant
                ? `Driver is ${user.age} years old (Complies with Traffic Act CAP 403 requirement of ≥28 years).`
                : `Driver is ${user.age} years old. Law requires minimum 28 years for heavy commercial haulage.`}
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Documents Submitted for Review</h4>
            <p className="text-xs text-slate-500">The System Administrator will inspect the certificates in the Admin Portal.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 space-y-4">
            <div className="space-y-3">
              {/* 1. Vehicle Logbook */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      1. Vehicle Logbook ({user.vehicleRegNumber || 'Reg Document'})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Proof of vehicle ownership &amp; tare weight
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  Attached ✓
                </span>
              </div>

              {/* 2. Driver Commercial License */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      2. Valid Class BCE Driving License
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      National Transport and Safety Authority (NTSA) endorsed
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  Attached ✓
                </span>
              </div>

              {/* 3. Vehicle Photographs */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      3. Vehicle Pictures (Front, Side &amp; Body)
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {user.vehicleType || 'Commercial Truck'} ({user.bodyType || 'Enclosed'})
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  2 Photos Attached ✓
                </span>
              </div>
            </div>

            {/* Document Thumbnail Previews */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Attached Verification Dossier Preview
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video relative group">
                  <img src={license} alt="License" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    License
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video relative group">
                  <img src={frontPhoto} alt="Front truck" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Truck Front
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video relative group">
                  <img src={sidePhoto} alt="Side truck" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Truck Side
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleInstantVerifyForDemo}
                className="text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline"
              >
                Instant Verify (Demo Mode)
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-lg shadow-amber-500/20"
                >
                  Save &amp; Submit to Admin
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
