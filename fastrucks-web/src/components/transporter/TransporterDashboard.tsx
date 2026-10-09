import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobProposal, TransitTrip } from '../../types';
import { CorridorMap } from '../map/CorridorMap';
import { VettingModal } from './VettingModal';
import { IncidentModal } from './IncidentModal';
import { PodModal } from './PodModal';
import { ChatDrawer } from '../common/ChatDrawer';
import { DisputeModal } from '../common/DisputeModal';
import {
  Truck,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Coffee,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Package,
  Fuel,
  Lock,
  Globe,
  ShieldAlert,
} from 'lucide-react';

export const TransporterDashboard: React.FC = () => {
  const {
    currentUser,
    jobs,
    proposals,
    trips,
    submitProposal,
    startTrip,
    toggleBackhaul,
  } = useApp();

  const [isVettingOpen, setIsVettingOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isPodOpen, setIsPodOpen] = useState(false);
  const [activeChatJob, setActiveChatJob] = useState<Job | null>(null);
  const [disputeJob, setDisputeJob] = useState<Job | null>(null);

  // Bid state
  const [biddingJob, setBiddingJob] = useState<Job | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidNote, setBidNote] = useState('');

  // Find job currently assigned to this driver
  const myAssignedJob = jobs.find(
    (j) =>
      j.assignedTransporterId === currentUser.id &&
      (j.status === 'in_transit' || j.status === 'assigned' || j.status === 'delivered' || j.status === 'disputed')
  );
  const myTrip = myAssignedJob ? trips.find((t) => t.jobId === myAssignedJob.id) : null;

  // Open jobs available for bidding
  const openJobs = jobs.filter((j) => j.status === 'open');

  const handleOpenBid = (job: Job) => {
    setBiddingJob(job);
    setBidPrice(job.offeredPriceKes);
    setBidNote(`I have an ${currentUser.vehicleType || 'heavy truck'} with clean inspection. Available for this corridor.`);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingJob) return;

    submitProposal({
      jobId: biddingJob.id,
      bidPriceKes: bidPrice,
      counterOfferNote: bidNote,
    });

    setBiddingJob(null);
  };

  const isAgeOk = currentUser.age >= 28;
  const isVerified = currentUser.verificationStatus === 'verified';

  return (
    <div className="space-y-6">
      {/* Driver Profile & Vetting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
            />
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow" title="Vetted Driver">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full">
                Heavy Transporter
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {currentUser.verificationStatus}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{currentUser.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {currentUser.vehicleType || 'Commercial Vehicle'} • Reg: <strong className="text-amber-300">{currentUser.vehicleRegNumber || 'KDB 492X'}</strong> • {currentUser.tonnageCapacity || 12}T Capacity
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsVettingOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-amber-400/40 hover:bg-amber-400/10 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <FileCheck className="w-4 h-4" />
            Inspection &amp; Documents Dossier
          </button>
        </div>
      </div>

      {/* Compliance Notice if not verified */}
      {!isVerified && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              Your transporter registration is in <strong>{currentUser.verificationStatus}</strong> state.
              {isAgeOk ? ' Age CAP 403 verified.' : ' Must meet age requirement (≥28 years).'} Make sure logbook &amp; license are uploaded.
            </span>
          </div>
          <button
            onClick={() => setIsVettingOpen(true)}
            className="text-amber-900 dark:text-amber-300 font-bold underline shrink-0 hover:opacity-80"
          >
            Review Documents
          </button>
        </div>
      )}

      {/* Backhaul / Return Trip Availability Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Empty-Leg / Backhaul Return Broadcaster
            </h4>
            <p className="text-xs text-slate-500">
              {currentUser.isAvailableForBackhaul
                ? `Currently broadcasting return load capacity from ${currentUser.backhaulDetails?.origin || 'Nakuru'} ➔ ${currentUser.backhaulDetails?.destination || 'Nairobi'}`
                : 'Avoid driving back empty. Broadcast return route availability to shippers for instant backhaul freight.'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            toggleBackhaul(currentUser.id, !currentUser.isAvailableForBackhaul, {
              origin: 'Nakuru Industrial Area',
              destination: 'Athi River / Nairobi',
              availableDate: '2026-10-12',
              targetPriceKes: 35000,
            })
          }
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
            currentUser.isAvailableForBackhaul
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-slate-100'
          }`}
        >
          {currentUser.isAvailableForBackhaul ? 'Backhaul Active ✓' : 'Broadcast Return Trip'}
        </button>
      </div>

      {/* Active Trip Telemetry & Operations (if assigned) */}
      {myAssignedJob && myTrip ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Active Consignment En Route: {myAssignedJob.title}
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
              {myAssignedJob.corridorType}
            </span>
          </div>

          {/* 50/50 Milestone & Security Banner */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                myAssignedJob.isFuelAdvanceReleased
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
              }`}>
                <div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-bold flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" /> 50% Fuel &amp; Mobilization Advance:
                  </span>
                  <div className="text-sm font-black text-amber-900 dark:text-amber-200">
                    KES {(myAssignedJob.fuelAdvanceKes || 27000).toLocaleString()}
                  </div>
                  <span className={`text-[10px] font-semibold ${
                    myAssignedJob.isFuelAdvanceReleased ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {myAssignedJob.isFuelAdvanceReleased
                      ? 'Disbursed to your M-Pesa ✓'
                      : 'Awaiting Warehouse Loading Verification ⏱'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> 50% Final Settlement Balance:
                  </span>
                  <div className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                    KES {(myAssignedJob.finalBalanceKes || 27000).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Held in Escrow (Paid upon e-POD PIN)</span>
                </div>
              </div>
            </div>

            {/* Insurance & Security Reference */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Goods In Transit Policy: <strong className="text-slate-700 dark:text-slate-300">{myAssignedJob.gitInsurancePolicy}</strong>
              </span>
              <span>
                Tamper Seal: <strong className="font-mono text-amber-600">{myAssignedJob.containerSealNumber}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Bar for Driver */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsIncidentOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Coffee className="w-4 h-4" />
                Report Stoppage / Rest Break
              </button>

              <button
                onClick={() => setActiveChatJob(myAssignedJob)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
              >
                <MessageSquare className="w-4 h-4 text-amber-500" />
                Message Shipper
              </button>

              <button
                onClick={() => setDisputeJob(myAssignedJob)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-rose-500 text-slate-500 text-xs font-semibold flex items-center gap-1 transition"
                title="View Insurance & Damage Docket"
              >
                <ShieldAlert className="w-4 h-4" />
                Security Docket
              </button>
            </div>

            <div className="flex items-center gap-2">
              {myAssignedJob.status === 'in_transit' && (
                <button
                  onClick={() => setIsPodOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Arrived: Submit Digital e-POD &amp; Claim Final 50%
                </button>
              )}
              {myAssignedJob.status === 'delivered' && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  e-POD Signed Off • Awaiting Shipper Final 50% Release
                </span>
              )}
              {myAssignedJob.status === 'disputed' && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Claim Under Review • Escrow Frozen
                </span>
              )}
            </div>
          </div>

          {/* Live Corridor Map */}
          <CorridorMap trip={myTrip} job={myAssignedJob} />
        </div>
      ) : null}

      {/* Available Load Board (Open jobs for bidding) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Available Load Board ({openJobs.length} Cargo Postings)
            </h2>
            <p className="text-xs text-slate-500">
              Domestic Kenyan routes &amp; cross-border freight corridors (Uganda, Tanzania, Ethiopia, South Sudan).
            </p>
          </div>
        </div>

        {openJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
            <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Open Tenders Right Now</h3>
            <p className="text-xs text-slate-500">Switch to Supplier mode to publish a new freight haulage request.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openJobs.map((job) => {
              const myProposal = proposals.find(
                (p) => p.jobId === job.id && p.transporterId === currentUser.id
              );
              const fuelAdv = job.fuelAdvanceKes || Math.round(job.offeredPriceKes * 0.5);
              const finalBal = job.finalBalanceKes || Math.round(job.offeredPriceKes * 0.5);

              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                        {job.goodsCategory}
                      </span>
                      <span className="text-sm font-black text-amber-600">
                        KES {job.offeredPriceKes.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {job.goodsDescription}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Route:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{job.origin} ➔ {job.destination}</strong>
                        <span className="text-[10px] text-amber-600 block">{job.corridorType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Milestones:</span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 block">
                          50% Fuel Advance: <strong>KES {fuelAdv.toLocaleString()}</strong>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          50% e-POD Bal: KES {finalBal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Shipper: <span className="font-semibold text-slate-700 dark:text-slate-300">{job.supplierBusiness}</span>
                    </div>

                    {myProposal ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl">
                        Bid Submitted (KES {myProposal.bidPriceKes.toLocaleString()}) ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenBid(job)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5"
                      >
                        Submit Bid / Counter-Quote
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {biddingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Submit Transporter Bid</h3>
                <p className="text-xs text-amber-100">{biddingJob.title}</p>
              </div>
              <button onClick={() => setBiddingJob(null)} className="p-1 rounded-lg hover:bg-white/20">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipper Budget:</span>
                  <span className="font-bold">KES {biddingJob.offeredPriceKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corridor:</span>
                  <span>{biddingJob.corridorType} ({biddingJob.origin} ➔ {biddingJob.destination})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Specs:</span>
                  <span>{biddingJob.tonnage}T • {biddingJob.requiredVehicleType}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Total Quote (KES)
                </label>
                <input
                  type="number"
                  step="500"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs flex justify-between">
                  <span>50% Fuel Advance on Departure: <strong>KES {Math.round(bidPrice * 0.5).toLocaleString()}</strong></span>
                  <span>50% e-POD Balance: <strong>KES {(bidPrice - Math.round(bidPrice * 0.5)).toLocaleString()}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Message / Vehicle Availability Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setBiddingJob(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow"
                >
                  Confirm &amp; Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <VettingModal user={currentUser} isOpen={isVettingOpen} onClose={() => setIsVettingOpen(false)} />
      {myAssignedJob && (
        <IncidentModal
          jobId={myAssignedJob.id}
          isOpen={isIncidentOpen}
          onClose={() => setIsIncidentOpen(false)}
        />
      )}
      {myAssignedJob && (
        <PodModal
          job={myAssignedJob}
          isOpen={isPodOpen}
          onClose={() => setIsPodOpen(false)}
        />
      )}
      {myAssignedJob && (
        <DisputeModal
          job={myAssignedJob}
          isOpen={!!disputeJob}
          onClose={() => setDisputeJob(null)}
        />
      )}
      {activeChatJob && (
        <ChatDrawer
          job={activeChatJob}
          isOpen={!!activeChatJob}
          onClose={() => setActiveChatJob(null)}
        />
      )}
    </div>
  );
};
