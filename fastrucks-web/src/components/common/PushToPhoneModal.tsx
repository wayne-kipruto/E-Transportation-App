import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PushToPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushToPhoneModal: React.FC<PushToPhoneModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'flutter'>('pwa');
  const [copied, setCopied] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  if (!isOpen) return null;

  // The actual live public shared URL of this application
  const liveUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.href.split('?')[0]
      : 'https://ais-pre-7jpzl7z34gecsfuheftqo4-485144911051.europe-west2.run.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Push Fastrucks to Your Phone</h2>
              <p className="text-emerald-200 text-sm">
                Run Fastrucks as a native mobile app on your Android or iPhone device
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-emerald-600/60">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'pwa'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-600/40'
              }`}
            >
              <QrCode className="w-4 h-4" />
              1. Instant PWA App (Scan &amp; Install)
            </button>
            <button
              onClick={() => setActiveTab('flutter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'flutter'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-600/40'
              }`}
            >
              <Terminal className="w-4 h-4" />
              2. Flutter APK (Direct USB Push)
            </button>
          </div>
        </div>

        {/* Tab 1: Instant PWA Install via QR Code */}
        {activeTab === 'pwa' && (
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-900">
                <span className="font-semibold">Zero-Setup Instant Mobile Install: </span>
                Scan the QR code below using your phone camera. It will open this exact live app, which
                will prompt you to <strong>&ldquo;Add to Home Screen&rdquo;</strong> as an offline-ready
                native app with the Fastrucks icon!
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* QR Code Card */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-inner">
                <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 mb-3">
                  <QRCodeSVG
                    value={liveUrl}
                    size={170}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: '/favicon-32x32.png',
                      x: undefined,
                      y: undefined,
                      height: 32,
                      width: 32,
                      excavate: true,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Scan With Phone Camera
                </span>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    readOnly
                    value={liveUrl}
                    className="text-xs bg-white border border-gray-300 rounded px-2 py-1.5 w-full text-gray-600 truncate font-mono select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded shrink-0 transition"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    For Android (Chrome / Samsung Internet):
                  </h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1 pl-1 text-xs leading-relaxed">
                    <li>Scan QR code and open URL in Google Chrome.</li>
                    <li>
                      Tap the banner <strong>&ldquo;Add Fastrucks to Home Screen&rdquo;</strong> (or tap Chrome&apos;s
                      three dots &gt; &ldquo;Install App&rdquo;).
                    </li>
                    <li>Fastrucks will install to your app drawer like any Play Store app!</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      B
                    </span>
                    For iPhone (Apple Safari):
                  </h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1 pl-1 text-xs leading-relaxed">
                    <li>Scan QR code and open link in <strong>Safari</strong>.</li>
                    <li>
                      Tap the <strong>Share button</strong> (square with an up-arrow at the bottom).
                    </li>
                    <li>
                      Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                    </li>
                    <li>Tap &ldquo;Add&rdquo; &mdash; Fastrucks will appear on your iOS home screen!</li>
                  </ol>
                </div>

                {isInstallable && (
                  <div className="pt-2">
                    <button
                      onClick={install}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition"
                    >
                      <Download className="w-4 h-4" />
                      Trigger In-Browser Install Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Configured with PWA Service Worker &amp; Offline Cache
              </span>
              <span className="text-emerald-700 font-medium">Fastrucks v1.2 Mobile Ready</span>
            </div>
          </div>
        )}

        {/* Tab 2: Flutter Android APK Instructions */}
        {activeTab === 'flutter' && (
          <div className="p-6 space-y-5 text-sm">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Push Flutter App to Connected Android Phone
                </span>
                <span className="text-xs text-slate-400">wayne-kipruto/E-Transportation-App</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Since we pushed all updates to your GitHub master branch, you can compile and push
                the native Android app directly to your phone via USB debugging:
              </p>

              <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-emerald-300 space-y-2 border border-slate-800">
                <div className="text-slate-400"># 1. Pull latest commits on your machine:</div>
                <div>git pull origin master</div>

                <div className="text-slate-400 pt-1"># 2. Connect phone via USB &amp; verify ADB device:</div>
                <div>flutter devices</div>

                <div className="text-slate-400 pt-1"># 3. Direct push &amp; live run on your phone:</div>
                <div className="text-amber-300 font-bold">flutter run</div>

                <div className="text-slate-400 pt-1"># 4. Or build standalone Release APK file:</div>
                <div className="text-emerald-400">flutter build apk --release</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Where to find the APK after build:</h4>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs text-gray-700">
                build/app/outputs/flutter-apk/app-release.apk
              </div>
              <p className="text-xs text-gray-600">
                You can copy that <code className="bg-gray-100 px-1 py-0.5 rounded">.apk</code> file
                directly to your phone via WhatsApp, Google Drive, or USB and tap to install it!
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
              <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Recommendation:</strong> Use <strong>Tab 1 (Instant PWA)</strong> for testing
                the newly completed 50/50 escrow, NTSA verification queue, and corridors right now
                without waiting for an Android build!
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Open on your mobile device anytime via shared URL
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
