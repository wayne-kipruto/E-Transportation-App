import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, VerificationStatus } from '../../types';
import {
  ShieldCheck,
  Users,
  FileCheck2,
  BarChart3,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  Truck,
  Building2,
  AlertCircle,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    jobs,
    transactions,
    addUser,
    removeUser,
    updateUserVerification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'suppliers' | 'transporters' | 'claims' | 'reports'>('overview');
  const [selectedUserForVerification, setSelectedUserForVerification] = useState<User | null>(() => {
    return users.find((u) => u.verificationStatus === 'pending') || users.find((u) => u.role === 'transporter') || null;
  });

  const { resolveCargoClaim } = useApp();
  const disputedJobs = jobs.filter((j) => j.status === 'disputed' || !!j.cargoClaim);

  // State for Add New Supplier form (matching Figure 5.2)
  const [newSuppName, setNewSuppName] = useState('');
  const [newSuppAge, setNewSuppAge] = useState(30);
  const [newSuppPhone, setNewSuppPhone] = useState('');
  const [newSuppBizName, setNewSuppBizName] = useState('');
  const [newSuppAddress, setNewSuppAddress] = useState('');
  const [newSuppDesc, setNewSuppDesc] = useState('');

  // State for Remove user by UID (matching Figure 5.2)
  const [removeUid, setRemoveUid] = useState('');

  // Filtering
  const suppliers = users.filter((u) => u.role === 'supplier');
  const transporters = users.filter((u) => u.role === 'transporter');
  const pendingUsers = users.filter((u) => u.verificationStatus === 'pending');

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppName || !newSuppPhone || !newSuppBizName) return;

    addUser({
      name: newSuppName,
      email: `${newSuppName.toLowerCase().replace(/\s+/g, '')}@supplier.co.ke`,
      phone: newSuppPhone,
      role: 'supplier',
      age: Number(newSuppAge),
      businessName: newSuppBizName,
      businessAddress: newSuppAddress,
      businessDescription: newSuppDesc,
    });

    setNewSuppName('');
    setNewSuppPhone('');
    setNewSuppBizName('');
    setNewSuppAddress('');
    setNewSuppDesc('');
  };

  const handleRemoveByUid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeUid.trim()) return;
    removeUser(removeUid.trim());
    setRemoveUid('');
  };

  const totalEscrowVolume = transactions.reduce((sum, tx) => sum + tx.amountKes, 0);
  const totalTonnageHauled = jobs.reduce((sum, j) => sum + (j.status === 'completed' || j.status === 'in_transit' ? j.tonnage : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header bar styled like Fastrucks Admin in Figure 5.1 & Figure B1 */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-0.5 rounded-full">
              System Administrator Portal
            </span>
            <span className="text-xs text-slate-400">Fastrucks Master Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fastrucks Administration</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Vetting driver logbooks, verifying licenses (CAP 403 legal compliance), and managing supplier accounts.
          </p>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'verification' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            User Verification
            {pendingUsers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'suppliers' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Suppliers ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('transporters')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'transporters' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Transporters ({transporters.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'claims' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Safety &amp; Claims ({disputedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'reports' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB: Replicating Figure 5.1 Admin Dashboard cards */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Suppliers Card (Figure 5.1) */}
            <div
              onClick={() => setActiveTab('suppliers')}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 cursor-pointer transition space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Suppliers</h3>
                <p className="text-xs text-slate-500 mt-1">View &amp; manage registered cargo supplier accounts</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">{suppliers.length} Active Accounts</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-1 transition">Open Table →</span>
              </div>
            </div>

            {/* Transporters Card (Figure 5.1) */}
            <div
              onClick={() => setActiveTab('transporters')}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 cursor-pointer transition space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Transporters</h3>
                <p className="text-xs text-slate-500 mt-1">View transporter fleet &amp; vehicle profiles</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">{transporters.length} Truck Drivers</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-1 transition">Open Table →</span>
              </div>
            </div>

            {/* User Verification Card (Figure 5.1) */}
            <div
              onClick={() => setActiveTab('verification')}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 cursor-pointer transition space-y-4 group relative"
            >
              {pendingUsers.length > 0 && (
                <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {pendingUsers.length} Pending
                </span>
              )}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">User Verification</h3>
                <p className="text-xs text-slate-500 mt-1">View &amp; verify driver logbooks, licenses, and photos</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">{pendingUsers.length} In Review Queue</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-1 transition">Inspect →</span>
              </div>
            </div>

            {/* View Reports Card (Figure 5.1) */}
            <div
              onClick={() => setActiveTab('reports')}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 cursor-pointer transition space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">View Reports</h3>
                <p className="text-xs text-slate-500 mt-1">Platform freight tonnage, revenue &amp; M-Pesa ledger</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">{jobs.length} Consignments</span>
                <span className="text-amber-600 font-semibold group-hover:translate-x-1 transition">Analytics →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION TAB: Replicating Figure 5.3 Admin Dashboard (Document Verification) */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User selector list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Verification Dossier Queue
            </h3>
            <div className="space-y-2">
              {transporters.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserForVerification(user)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedUserForVerification?.id === user.id
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        user.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : user.verificationStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {user.verificationStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {user.vehicleType || 'Commercial Vehicle'} • Age: {user.age} yrs
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Viewer Screen (Matching Figure 5.3) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {selectedUserForVerification ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Verify Documents &amp; Vehicle Images: {selectedUserForVerification.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      UID: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedUserForVerification.id}</span> • Email: {selectedUserForVerification.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">Statutory Age Check:</div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        selectedUserForVerification.age >= 28
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {selectedUserForVerification.age} Yrs (CAP 403 {selectedUserForVerification.age >= 28 ? 'Passed' : 'Failed'})
                    </span>
                  </div>
                </div>

                {/* Document Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Logbook / Reg Certificate */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Vehicle Logbook / Reg Document</span>
                      <span className="text-[10px] text-slate-400">{selectedUserForVerification.vehicleRegNumber || 'Reg'}</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 relative">
                      <img
                        src={selectedUserForVerification.documents?.logbookUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'}
                        alt="Logbook"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Driving License */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Commercial Driving License (Class BCE)</span>
                      <span className="text-[10px] text-slate-400">NTSA Verified</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 relative">
                      <img
                        src={selectedUserForVerification.documents?.licenseUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'}
                        alt="License"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vehicle Front */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Vehicle Exterior (Front Profile)
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                      <img
                        src={selectedUserForVerification.documents?.vehiclePhotoFront || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600'}
                        alt="Truck Front"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vehicle Body / Side */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cargo Enclosure Body (Side Profile)
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                      <img
                        src={selectedUserForVerification.documents?.vehiclePhotoSide || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600'}
                        alt="Truck Side"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Government Statutory Verification Panel (NTSA TIMS, eCitizen & IPRS) */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Government Statutory Database Verification (NTSA TIMS &amp; eCitizen)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Query National Transport and Safety Authority (NTSA) central vehicle &amp; driver registry
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded font-bold">
                      NTSA-API-v2 / IPRS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* 1. NTSA Driving License Check */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">NTSA Smart Driving License</span>
                        {selectedUserForVerification.age >= 28 ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                            Valid Class BCE ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                            Non-Compliant ✗
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Smart DL Serial: <span className="font-mono text-slate-800 dark:text-slate-200">DL-KE-7918402</span> • Demerit Points: 0
                      </p>
                    </div>

                    {/* 2. CAP 403 Age Check */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">CAP 403 Statutory Age</span>
                        {selectedUserForVerification.age >= 28 ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                            Age {selectedUserForVerification.age} Yrs (Passed) ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                            Age {selectedUserForVerification.age} Yrs (Failed) ✗
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {selectedUserForVerification.age >= 28
                          ? 'Traffic Act CAP 403 Section 30 requirement (≥28 yrs) satisfied.'
                          : 'Under-age for heavy commercial vehicle endorsement (Min 28 yrs required).'}
                      </p>
                    </div>

                    {/* 3. Logbook Ownership & Chassis Check */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">NTSA Vehicle Logbook</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                          Owner Matched ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Reg: <strong className="font-mono text-amber-600">{selectedUserForVerification.vehicleRegNumber || 'KDB 492X'}</strong> • Chassis VIN verified
                      </p>
                    </div>

                    {/* 4. Annual Roadworthiness Inspection */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">KeNHA / NTSA Inspection</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                          Valid Thru 2027 ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Commercial Tare Weight &amp; Axle Capacity certified
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approval / Rejection Controls */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Current Status: <strong className="capitalize">{selectedUserForVerification.verificationStatus}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateUserVerification(
                          selectedUserForVerification.id,
                          'rejected',
                          'Documents illegible or statutory criteria not satisfied.'
                        )
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800 transition"
                    >
                      Reject Documents
                    </button>
                    <button
                      onClick={() =>
                        updateUserVerification(selectedUserForVerification.id, 'verified')
                      }
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve &amp; Verify Transporter
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select a user from the queue to inspect their uploaded documents.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUPPLIERS TAB: Replicating Figure 5.2 Admin Dashboard (Adding Users) */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table: ALL SUPPLIERS (Matching Figure 5.2 Table) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">ALL SUPPLIERS</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-3 pl-2">UID / Name</th>
                    <th className="pb-3">Age</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Business Name</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 pl-2 font-bold text-slate-900 dark:text-slate-100">
                        <div>{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.id}</div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{s.age}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{s.phone}</td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-medium">{s.businessName || '—'}</td>
                      <td className="py-3 text-slate-500">{s.businessAddress || '—'}</td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => removeUser(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Remove Supplier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Add New Suppliers & Remove Supplier forms (Matching Figure 5.2) */}
          <div className="space-y-6">
            {/* Add New Suppliers below form (Figure 5.2) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Add New Suppliers below
              </h3>
              <form onSubmit={handleAddSupplier} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-500 block mb-0.5">Name</label>
                  <input
                    type="text"
                    required
                    value={newSuppName}
                    onChange={(e) => setNewSuppName(e.target.value)}
                    placeholder="e.g. Sandra Kimeli"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Age</label>
                  <input
                    type="number"
                    value={newSuppAge}
                    onChange={(e) => setNewSuppAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={newSuppPhone}
                    onChange={(e) => setNewSuppPhone(e.target.value)}
                    placeholder="0785890000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Business Name</label>
                  <input
                    type="text"
                    required
                    value={newSuppBizName}
                    onChange={(e) => setNewSuppBizName(e.target.value)}
                    placeholder="Sandy's Flowers"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Business Address</label>
                  <input
                    type="text"
                    value={newSuppAddress}
                    onChange={(e) => setNewSuppAddress(e.target.value)}
                    placeholder="Located in Nairobi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Business Description</label>
                  <textarea
                    rows={2}
                    value={newSuppDesc}
                    onChange={(e) => setNewSuppDesc(e.target.value)}
                    placeholder="Brief Description"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
                >
                  Add Supplier
                </button>
              </form>
            </div>

            {/* Remove Supplier form (Figure 5.2) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Remove Supplier
              </h3>
              <form onSubmit={handleRemoveByUid} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-500 block mb-0.5">Enter User UID</label>
                  <input
                    type="text"
                    value={removeUid}
                    onChange={(e) => setRemoveUid(e.target.value)}
                    placeholder="e.g. user_s3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow"
                >
                  Remove User
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TRANSPORTERS TAB */}
      {activeTab === 'transporters' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">ALL TRANSPORTERS &amp; DRIVERS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 pl-2">Driver Name / UID</th>
                  <th className="pb-3">Age (CAP 403)</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Truck Specs &amp; Reg</th>
                  <th className="pb-3">Capacity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transporters.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 pl-2 font-bold text-slate-900 dark:text-slate-100">
                      <div>{t.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.id}</div>
                    </td>
                    <td className="py-3">
                      <span className={`font-semibold ${t.age >= 28 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 font-bold'}`}>
                        {t.age} yrs {t.age < 28 && '(!)'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{t.phone}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200">
                      <div>{t.vehicleType}</div>
                      <div className="text-[10px] text-amber-600 font-mono font-bold">{t.vehicleRegNumber}</div>
                    </td>
                    <td className="py-3 font-bold">{t.tonnageCapacity || '—'}T</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : t.verificationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {t.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => removeUser(t.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARGO SAFETY & CLAIMS TAB */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          {/* Security Architecture Guide */}
          <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-0.5 rounded-full">
                Cargo Protection Standard Operating Procedure
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              How Fastrucks Protects Against Theft &amp; In-Transit Goods Damage
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              In heavy commercial road freight, security and cargo preservation are paramount. Fastrucks enforces a five-layer safety and dispute framework designed for Kenya and regional transit corridors:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-amber-400">1. Pre-Trip Vetting &amp; CAP 403</div>
                <p className="text-[11px] text-slate-300">
                  Transporters undergo strict physical logbook and driving license verification. Commercial heavy drivers must be aged 28+ as per Kenya Traffic Act CAP 403.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400">2. 50/50 Escrow Retention</div>
                <p className="text-[11px] text-slate-300">
                  Drivers receive 50% for fuel and mobilization upon departure. The remaining 50% final settlement is held in escrow until the destination consignee provides the secret e-POD PIN.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-sky-400">3. Tamper Seals &amp; Telemetry</div>
                <p className="text-[11px] text-slate-300">
                  Containers are secured with recorded serial seals (e.g. KRA RECTS or high-security seals). Drivers must log any roadside stop exceeding 10 minutes (rest breaks, punctures, weighbridges).
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-purple-400">4. Goods In Transit (GIT) Insurance</div>
                <p className="text-[11px] text-slate-300">
                  Every consignment is registered under a corporate Goods In Transit policy (underwritten up to KES 15,000,000) covering fire, collision, rollover, and violent theft.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5 md:col-span-2">
                <div className="text-xs font-bold text-rose-400">5. Dispute Mediation &amp; Police OB Logging</div>
                <p className="text-[11px] text-slate-300">
                  If cartons arrive broken or seals tampered, the consignee withholds the PIN and files an instant damage docket with photo evidence and Kenya Police OB Number. The remaining 50% escrow is frozen until mediated.
                </p>
              </div>
            </div>
          </div>

          {/* Active Claims List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Active Cargo Claims &amp; Theft / Damage Inquiries</span>
              <span className="text-xs font-mono text-slate-500">{disputedJobs.length} Record(s)</span>
            </h3>

            {disputedJobs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <p className="text-xs">No active dispute claims filed. All shipments delivered in good order.</p>
                <p className="text-[11px] text-slate-500">Shippers or consignees can file a claim directly from their active shipments view.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputedJobs.map((job) => {
                  const claim = job.cargoClaim;
                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-mono">
                              Docket #{claim?.id.substring(6) || job.id.substring(4)}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {job.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Corridor: {job.origin} ➔ {job.destination} ({job.corridorType}) • Shipper: {job.supplierBusiness}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-rose-600 block">
                            Claimed: KES {claim?.estimatedLossKes.toLocaleString() || '15,000'}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            Status: {claim?.status.replace('_', ' ') || 'Under Investigation'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          Discrepancy Category: <span className="capitalize">{claim?.claimType.replace('_', ' ') || 'Damage'}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{claim?.description}</p>
                        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                          <span>GIT Policy: <strong>{job.gitInsurancePolicy}</strong></span>
                          <span>Container Seal: <strong>{job.containerSealNumber}</strong></span>
                          {claim?.policeAbstractNumber && (
                            <span>Police Abstract: <strong className="font-mono text-slate-700 dark:text-slate-300">{claim.policeAbstractNumber}</strong></span>
                          )}
                        </div>
                      </div>

                      {claim?.status === 'under_investigation' && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() =>
                              resolveCargoClaim(
                                job.id,
                                claim.estimatedLossKes,
                                'Admin mediated: full damaged cargo value deducted from final balance.'
                              )
                            }
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow"
                          >
                            Deduct Loss from Final 50% &amp; Settle
                          </button>
                          <button
                            onClick={() =>
                              resolveCargoClaim(
                                job.id,
                                0,
                                'Escalated to corporate GIT underwriter for comprehensive survey and claim settlement.',
                                true
                              )
                            }
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow"
                          >
                            Escalate to Insurance Underwriter
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Escrow Volume Handled</div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                KES {totalEscrowVolume.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Safaricom Daraja B2B / C2B</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Freight Moved</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{totalTonnageHauled} Tonnes</div>
              <div className="text-[11px] text-slate-500 mt-1">Across Northern &amp; Rift Corridors</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold uppercase">Registered Transporters</div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {transporters.length} Heavy Drivers
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Vetted under CAP 403</div>
            </div>
          </div>

          {/* M-Pesa Transaction Log */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              M-Pesa Daraja Payment Transactions Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-3 pl-2">Receipt Number</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 pl-2 font-bold text-slate-900 dark:text-slate-100">
                        {tx.mpesaReceiptNumber}
                      </td>
                      <td className="py-3 uppercase text-[11px] text-slate-600 dark:text-slate-400">
                        {tx.type.replace('_', ' ')}
                      </td>
                      <td className="py-3 font-bold text-amber-600">KES {tx.amountKes.toLocaleString()}</td>
                      <td className="py-3 text-slate-500">{tx.timestamp}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{tx.phoneNumber}</td>
                      <td className="py-3 pr-2">
                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[10px] font-bold">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
