import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobProposal, TransitTrip } from '../../types';
import { CorridorMap } from '../map/CorridorMap';
import { PostJobModal } from './PostJobModal';
import { ChatDrawer } from '../common/ChatDrawer';
import { MpesaModal } from '../common/MpesaModal';
import { DisputeModal } from '../common/DisputeModal';
import { LoadingVerificationModal } from './LoadingVerificationModal';
import {
  Package,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  MapPin,
  ChevronRight,
  UserCheck,
  ExternalLink,
  ShieldAlert,
  Fuel,
  Lock,
  Globe,
} from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const {
    currentUser,
    jobs,
    proposals,
    trips,
    acceptProposal,
    rejectProposal,
    releaseFinalBalanceMpesa,
    users,
  } = useApp();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activeChatJob, setActiveChatJob] = useState<Job | null>(null);
  const [mpesaReleaseJob, setMpesaReleaseJob] = useState<Job | null>(null);
  const [disputeJob, setDisputeJob] = useState<Job | null>(null);
  const [loadingVerificationJob, setLoadingVerificationJob] = useState<Job | null>(null);

  // Filter jobs by current supplier (or show all if demo admin switch)
  const myJobs = jobs.filter((j) => j.supplierId === currentUser.id);
  const awaitingLoadingJobs = myJobs.filter((j) => j.status === 'assigned' && !j.isLoadingVerified);
  const activeShipment =
    myJobs.find((j) => j.status === 'in_transit' || j.status === 'delivered' || j.status === 'disputed') ||
    jobs.find((j) => j.status === 'in_transit');
  const activeTrip = activeShipment ? trips.find((t) => t.jobId === activeShipment.id) : null;

  // Pending proposals on supplier's open jobs
  const myOpenJobIds = myJobs.filter((j) => j.status === 'open').map((j) => j.id);
  const pendingProposals = proposals.filter((p) => myOpenJobIds.includes(p.jobId) && p.status === 'pending');

  const totalDisbursedKes = myJobs.reduce((acc, curr) => {
    let sum = 0;
    if (curr.isFuelAdvanceReleased) sum += curr.fuelAdvanceKes || 0;
    if (curr.isFinalBalanceReleased) sum += curr.finalBalanceKes || 0;
    return acc + sum;
  }, 0);

  const escrowHeldKes = myJobs
    .filter((j) => !j.isFinalBalanceReleased && (j.status === 'in_transit' || j.status === 'delivered' || j.status === 'assigned' || j.status === 'disputed'))
    .reduce((acc, curr) => acc + (curr.finalBalanceKes || Math.round((curr.agreedPriceKes || curr.offeredPriceKes) * 0.5)), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full">
              Cargo Shipper Portal
            </span>
            <span className="text-xs text-slate-400">
              {currentUser.businessName || 'Wholesale Supplier'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {currentUser.businessDescription || 'Direct cargo consignment and vetted large vehicle haulage across Kenya & East Africa.'}
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Post Freight Job (Domestic &amp; Regional)
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Shipments</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {myJobs.filter((j) => j.status === 'in_transit' || j.status === 'assigned' || j.status === 'disputed').length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Live telemetric tracking</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Bids / Proposals</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingProposals.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting your approval</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">50% Escrow Held (Final Bal)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            KES {escrowHeldKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Locked until e-POD sign-off</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Disbursed</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            KES {totalDisbursedKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Advances + Final settlements</div>
        </div>
      </div>

      {/* Awaiting Warehouse Loading Verification Action Banner */}
      {awaitingLoadingJobs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cargo Loading Verification Required ({awaitingLoadingJobs.length})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Transporters assigned &amp; at warehouse. Inspect loading before releasing 50% fuel mobilization advance.
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
              Escrow Holdback Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {awaitingLoadingJobs.map((j) => {
              const fuelAdv = j.fuelAdvanceKes || Math.round((j.agreedPriceKes || j.offeredPriceKes) * 0.5);
              return (
                <div
                  key={j.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{j.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Driver: <strong className="text-slate-800 dark:text-slate-200">{j.assignedTransporterName}</strong> • {j.origin} • Seal: <span className="font-mono text-amber-600">{j.containerSealNumber}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatJob(j)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-amber-500 text-slate-500 transition"
                      title="Chat with Driver"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLoadingVerificationJob(j)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify Loading &amp; Release 50% (KES {fuelAdv.toLocaleString()})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Active Transit Tracker on Left/Top, Pending Bids on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active In-Transit Consignment (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Live In-Transit Consignment Monitoring
            </h2>
            {activeShipment && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                activeShipment.status === 'disputed'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                  : activeShipment.status === 'delivered'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
              }`}>
                {activeShipment.status === 'disputed'
                  ? '⚠️ Under Investigation (Disputed)'
                  : activeShipment.status === 'delivered'
                  ? 'Delivered - Awaiting Final 50% Settlement'
                  : 'Vehicle En Route'}
              </span>
            )}
          </div>

          {activeShipment && activeTrip ? (
            <div className="space-y-4">
              {/* Trip summary badge & 50/50 Payment Status */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {activeShipment.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                        {activeShipment.corridorType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transporter: <strong className="text-slate-800 dark:text-slate-200">{activeShipment.assignedTransporterName}</strong> • {activeShipment.tonnage}T • Seal: <span className="font-mono text-amber-600">{activeShipment.containerSealNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatJob(activeShipment)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      Chat with Driver
                    </button>

                    <button
                      onClick={() => setDisputeJob(activeShipment)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      {activeShipment.cargoClaim ? 'View Claim Docket' : 'Report Theft / Damage'}
                    </button>
                  </div>
                </div>

                {/* 50/50 Milestone Status Bar */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-amber-500" /> 1st 50% Fuel Advance:
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100">
                        KES {(activeShipment.fuelAdvanceKes || 27000).toLocaleString()}
                      </strong>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                      Disbursed ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-l pl-3 border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-500" /> 2nd 50% Final Settlement:
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100">
                        KES {(activeShipment.finalBalanceKes || 27000).toLocaleString()}
                      </strong>
                    </div>
                    {activeShipment.status === 'delivered' ? (
                      <button
                        onClick={() => setMpesaReleaseJob(activeShipment)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] shadow transition"
                      >
                        Release via M-Pesa
                      </button>
                    ) : (
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                        Escrow Locked 🔒
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Corridor Map */}
              <CorridorMap trip={activeTrip} job={activeShipment} />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <Truck className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No Vehicle Currently In Transit
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post a freight job or accept an incoming bid below to deploy an independent heavy commercial vehicle.
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Freight Request
              </button>
            </div>
          )}
        </div>

        {/* Pending Transporter Proposals & Bids (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              Incoming Driver Bids ({pendingProposals.length})
            </h2>
          </div>

          {pendingProposals.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-500">No pending bids on your open jobs right now.</p>
              <p className="text-[11px] text-slate-400">
                Transporters review open board requests and submit competitive offers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProposals.map((prop) => {
                const job = jobs.find((j) => j.id === prop.jobId);
                const fuelAdvance = Math.round(prop.bidPriceKes * 0.5);
                const finalBal = prop.bidPriceKes - fuelAdvance;

                return (
                  <div
                    key={prop.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {prop.transporterName}
                          </h4>
                          {prop.isVerified && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Vetted
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{prop.transporterVehicle}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-amber-600">
                          KES {prop.bidPriceKes.toLocaleString()}
                        </div>
                        {job && (
                          <div className="text-[10px] text-slate-400">
                            Offered: KES {job.offeredPriceKes.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="italic">"{prop.counterOfferNote}"</p>
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>50% Fuel Advance: <strong>KES {fuelAdvance.toLocaleString()}</strong></span>
                        <span>50% Final: <strong>KES {finalBal.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => rejectProposal(prop.id)}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition font-medium"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptProposal(prop.id)}
                        className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow transition"
                      >
                        Accept Bid &amp; Disburse 50% Fuel Advance
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All Posted Cargo Consignments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            Consignment History &amp; Open Board Postings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-3 pl-2">Job Title / Cargo</th>
                <th className="pb-3">Route Corridor</th>
                <th className="pb-3">Weight</th>
                <th className="pb-3">50% Advance</th>
                <th className="pb-3">50% Final Bal</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Transporter</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {myJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 pl-2 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{job.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{job.goodsCategory}</div>
                  </td>
                  <td className="py-3.5 text-slate-700 dark:text-slate-300">
                    {job.origin} ➔ {job.destination}
                    <div className="text-[10px] text-amber-600 font-semibold">{job.corridorType}</div>
                  </td>
                  <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{job.tonnage}T</td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    KES {(job.fuelAdvanceKes || Math.round(job.offeredPriceKes * 0.5)).toLocaleString()}
                    {job.isFuelAdvanceReleased && <span className="text-emerald-500 ml-1">✓</span>}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    KES {(job.finalBalanceKes || Math.round(job.offeredPriceKes * 0.5)).toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        job.status === 'disputed'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : job.status === 'in_transit'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : job.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : job.status === 'delivered'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {job.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-400">
                    {job.assignedTransporterName || 'Awaiting selection'}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {job.assignedTransporterId && (
                        <button
                          onClick={() => setActiveChatJob(job)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:text-amber-500 text-slate-500 transition"
                          title="Open In-App Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDisputeJob(job)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:text-rose-500 text-slate-500 transition"
                        title="Insurance & Cargo Protection Docket"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      {job.status === 'delivered' && (
                        <button
                          onClick={() => setMpesaReleaseJob(job)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition"
                        >
                          Release Final 50%
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PostJobModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />

      {activeChatJob && (
        <ChatDrawer
          job={activeChatJob}
          isOpen={!!activeChatJob}
          onClose={() => setActiveChatJob(null)}
        />
      )}

      {loadingVerificationJob && (
        <LoadingVerificationModal
          job={loadingVerificationJob}
          isOpen={!!loadingVerificationJob}
          onClose={() => setLoadingVerificationJob(null)}
        />
      )}

      {disputeJob && (
        <DisputeModal
          job={disputeJob}
          isOpen={!!disputeJob}
          onClose={() => setDisputeJob(null)}
        />
      )}

      {mpesaReleaseJob && (
        <MpesaModal
          isOpen={!!mpesaReleaseJob}
          onClose={() => setMpesaReleaseJob(null)}
          title={`Confirm e-POD & Release Final 50% Settlement`}
          amountKes={mpesaReleaseJob.finalBalanceKes || Math.round((mpesaReleaseJob.agreedPriceKes || mpesaReleaseJob.offeredPriceKes) * 0.5)}
          initialPhone={currentUser.phone}
          accountReference={`FINAL-JOB-${mpesaReleaseJob.id.substring(4)}`}
          onSuccess={() => releaseFinalBalanceMpesa(mpesaReleaseJob.id)}
        />
      )}
    </div>
  );
};
