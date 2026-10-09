import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Job,
  JobProposal,
  TransitTrip,
  TripIncident,
  MpesaTransaction,
  ChatMessage,
  VerificationStatus,
  CargoClaim,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_PROPOSALS,
  INITIAL_TRANSIT_TRIPS,
  INITIAL_MPESA_TRANSACTIONS,
  INITIAL_CHAT_MESSAGES,
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  users: User[];
  jobs: Job[];
  proposals: JobProposal[];
  trips: TransitTrip[];
  transactions: MpesaTransaction[];
  chatMessages: ChatMessage[];
  activeJobChatId: string | null;
  selectedTripForMap: TransitTrip | null;
  // Actions
  setCurrentUserById: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  addUser: (userData: Partial<User> & { name: string; email: string; phone: string; role: UserRole }) => User;
  removeUser: (userId: string) => void;
  updateUserVerification: (userId: string, status: VerificationStatus, reason?: string) => void;
  updateUserDocuments: (userId: string, documents: User['documents']) => void;
  toggleBackhaul: (userId: string, isAvailable: boolean, details?: User['backhaulDetails']) => void;
  // Job actions
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'status' | 'escrowStatus'>) => Job;
  submitProposal: (proposalData: { jobId: string; bidPriceKes: number; counterOfferNote: string }) => void;
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
  cancelJob: (jobId: string) => void;
  // Trip & transit actions
  startTrip: (jobId: string) => void;
  updateTripProgress: (jobId: string, progressDelta: number, locationName?: string) => void;
  advanceTripCheckpoint: (jobId: string, checkpointIndex: number) => void;
  reportIncident: (
    jobId: string,
    incident: Omit<TripIncident, 'id' | 'timestamp' | 'isResolved'>
  ) => void;
  resolveIncident: (jobId: string, incidentId: string) => void;
  submitProofOfDelivery: (
    jobId: string,
    pod: { photoUrl: string; consigneeSignatureName: string; notes: string; enteredPin: string }
  ) => { success: boolean; error?: string };
  // Payment actions
  depositEscrowMpesa: (
    jobId: string,
    amountKes: number,
    phone: string
  ) => Promise<{ success: boolean; receiptNumber: string }>;
  releaseFuelAdvanceMpesa: (jobId: string) => Promise<{ success: boolean; receiptNumber: string }>;
  verifyLoadingAndReleaseFuelAdvance: (
    jobId: string,
    details?: { loadingPhotoUrl?: string; sealConfirmed?: string }
  ) => Promise<{ success: boolean; receiptNumber: string }>;
  releaseFinalBalanceMpesa: (jobId: string) => Promise<{ success: boolean; receiptNumber: string }>;
  releaseEscrowMpesa: (jobId: string) => Promise<{ success: boolean; receiptNumber: string }>;
  // Safety, Theft & Damage Claims
  fileCargoClaim: (
    jobId: string,
    claim: Omit<CargoClaim, 'id' | 'jobId' | 'status' | 'createdAt'>
  ) => void;
  resolveCargoClaim: (
    jobId: string,
    deductionKes: number,
    resolutionNotes: string,
    escalateToInsurance?: boolean
  ) => void;
  // Chat actions
  sendChatMessage: (jobId: string, text: string) => void;
  setActiveJobChatId: (jobId: string | null) => void;
  setSelectedTripForMap: (trip: TransitTrip | null) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'fastrucks_users_v2',
  CURRENT_USER_ID: 'fastrucks_current_user_id_v2',
  JOBS: 'fastrucks_jobs_v2',
  PROPOSALS: 'fastrucks_proposals_v2',
  TRIPS: 'fastrucks_trips_v2',
  TRANSACTIONS: 'fastrucks_transactions_v2',
  CHATS: 'fastrucks_chats_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user_s2'; // Default to Caleb Kimani (Supplier with active haul)
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [proposals, setProposals] = useState<JobProposal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [trips, setTrips] = useState<TransitTrip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSIT_TRIPS;
  });

  const [transactions, setTransactions] = useState<MpesaTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_MPESA_TRANSACTIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [activeJobChatId, setActiveJobChatId] = useState<string | null>(null);
  const [selectedTripForMap, setSelectedTripForMap] = useState<TransitTrip | null>(() => {
    return trips.length > 0 ? trips[0] : null;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const setCurrentUserById = (id: string) => {
    setCurrentUserId(id);
  };

  const setCurrentRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUserId(matched.id);
    }
  };

  const addUser = (userData: Partial<User> & { name: string; email: string; phone: string; role: UserRole }): User => {
    const newId = `user_${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      age: userData.age || (userData.role === 'transporter' ? 29 : 32),
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      rating: 5.0,
      reviewCount: 0,
      completedTrips: 0,
      verificationStatus: userData.role === 'admin' ? 'verified' : 'pending',
      businessName: userData.businessName,
      businessAddress: userData.businessAddress,
      businessDescription: userData.businessDescription,
      vehicleType: userData.vehicleType,
      vehicleRegNumber: userData.vehicleRegNumber,
      tonnageCapacity: userData.tonnageCapacity,
      bodyType: userData.bodyType,
      vehicleDimensions: userData.vehicleDimensions,
      documents: userData.documents || {},
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) {
      const remaining = users.filter((u) => u.id !== userId);
      if (remaining.length > 0) setCurrentUserId(remaining[0].id);
    }
  };

  const updateUserVerification = (userId: string, status: VerificationStatus, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: status, rejectionReason: reason } : u))
    );
  };

  const updateUserDocuments = (userId: string, documents: User['documents']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, documents: { ...u.documents, ...documents }, verificationStatus: 'pending' } : u))
    );
  };

  const toggleBackhaul = (userId: string, isAvailable: boolean, details?: User['backhaulDetails']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isAvailableForBackhaul: isAvailable, backhaulDetails: details } : u))
    );
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'status' | 'escrowStatus'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'open',
      escrowStatus: 'unfunded',
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const submitProposal = ({
    jobId,
    bidPriceKes,
    counterOfferNote,
  }: {
    jobId: string;
    bidPriceKes: number;
    counterOfferNote: string;
  }) => {
    const newProposal: JobProposal = {
      id: `prop_${Date.now()}`,
      jobId,
      transporterId: currentUser.id,
      transporterName: currentUser.name,
      transporterPhone: currentUser.phone,
      transporterAge: currentUser.age,
      transporterVehicle: `${currentUser.vehicleType || 'Truck'} (${currentUser.vehicleRegNumber || 'Reg Pending'})`,
      transporterRating: currentUser.rating,
      transporterCompletedTrips: currentUser.completedTrips,
      isVerified: currentUser.verificationStatus === 'verified',
      bidPriceKes,
      counterOfferNote,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setProposals((prev) => [newProposal, ...prev]);
  };

  const acceptProposal = (proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId);
    if (!prop) return;

    const job = jobs.find((j) => j.id === prop.jobId);
    if (!job) return;

    // Update proposals
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) return { ...p, status: 'accepted' };
        if (p.jobId === prop.jobId) return { ...p, status: 'rejected' };
        return p;
      })
    );

    const fuelAdvance = Math.round(prop.bidPriceKes * 0.5);
    const finalBalance = prop.bidPriceKes - fuelAdvance;

    // Update job: Assigned, awaiting warehouse loading verification
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === prop.jobId) {
          return {
            ...j,
            status: 'assigned',
            assignedTransporterId: prop.transporterId,
            assignedTransporterName: prop.transporterName,
            agreedPriceKes: prop.bidPriceKes,
            fuelAdvanceKes: fuelAdvance,
            finalBalanceKes: finalBalance,
            isLoadingVerified: false, // Must be verified by supplier after physical loading!
            isFuelAdvanceReleased: false, // Held in escrow until loading verification
            isFinalBalanceReleased: false,
            escrowStatus: 'held_in_escrow',
          };
        }
        return j;
      })
    );

    // Record Escrow deposit transaction for Supplier (100% held securely)
    const depositTx: MpesaTransaction = {
      id: `tx_${Date.now()}_dep`,
      jobId: prop.jobId,
      supplierId: job.supplierId,
      transporterId: prop.transporterId,
      amountKes: prop.bidPriceKes,
      phoneNumber: job.supplierPhone,
      mpesaReceiptNumber: `QHK${Math.floor(1000000 + Math.random() * 9000000)}`,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      type: 'escrow_deposit',
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `Escrow secured 100% (KES ${prop.bidPriceKes.toLocaleString()}). Awaiting loading verification at warehouse to release 50% fuel advance.`,
    };

    setTransactions((prev) => [depositTx, ...prev]);

    // Send coordination chat message
    const coordMsg: ChatMessage = {
      id: `chat_${Date.now()}_coord`,
      jobId: prop.jobId,
      senderId: job.supplierId,
      senderName: job.supplierName,
      senderRole: 'supplier',
      text: `Hello ${prop.transporterName}, your bid of KES ${prop.bidPriceKes.toLocaleString()} is accepted! Please report to ${job.origin} for cargo loading. Your 50% Fuel Advance (KES ${fuelAdvance.toLocaleString()}) will be released to your M-Pesa immediately once we verify the cargo is strapped and loaded.`,
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, coordMsg]);

    // Initialize transit trip
    const newTrip: TransitTrip = {
      id: `trip_${Date.now()}`,
      jobId: prop.jobId,
      transporterId: prop.transporterId,
      supplierId: job.supplierId,
      status: 'loading',
      currentProgressPercent: 5,
      currentLocationName: `${job.origin} (Loading Bay)`,
      currentLat: -1.35,
      currentLng: 36.88,
      lastUpdated: 'Just now',
      estimatedArrival: `Estimated ${job.estimatedHours} hrs from departure`,
      checkpoints: [
        { name: `${job.origin} (Origin)`, lat: -1.35, lng: 36.88, kmFromStart: 0, passed: true, passedAt: 'Just now' },
        { name: 'Nairobi Southern Corridor', lat: -1.28, lng: 36.82, kmFromStart: Math.floor(job.distanceKm * 0.25), passed: false },
        { name: 'Rift Valley / Escarpment', lat: -0.95, lng: 36.55, kmFromStart: Math.floor(job.distanceKm * 0.5), passed: false },
        { name: 'KeNHA Weighbridge Checkpoint', lat: -0.55, lng: 36.32, kmFromStart: Math.floor(job.distanceKm * 0.75), passed: false, isWeighbridge: true },
        { name: `${job.destination} (Destination)`, lat: -0.30, lng: 36.08, kmFromStart: job.distanceKm, passed: false },
      ],
      incidents: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripForMap(newTrip);
  };

  const rejectProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
  };

  const cancelJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j))
    );
  };

  const startTrip = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'in_transit' } : j))
    );
    setTrips((prev) =>
      prev.map((t) =>
        t.jobId === jobId
          ? {
              ...t,
              status: 'in_transit',
              currentProgressPercent: 15,
              currentLocationName: 'En route - Departed warehouse',
              lastUpdated: 'Just now',
            }
          : t
      )
    );
  };

  const updateTripProgress = (jobId: string, progressDelta: number, locationName?: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.jobId === jobId) {
          const newPct = Math.min(95, Math.max(5, t.currentProgressPercent + progressDelta));
          return {
            ...t,
            currentProgressPercent: newPct,
            currentLocationName: locationName || t.currentLocationName,
            lastUpdated: 'Just now',
          };
        }
        return t;
      })
    );
  };

  const advanceTripCheckpoint = (jobId: string, checkpointIndex: number) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.jobId === jobId) {
          const updatedCheckpoints = t.checkpoints.map((cp, idx) => {
            if (idx === checkpointIndex) {
              return { ...cp, passed: true, passedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) };
            }
            return cp;
          });
          const passedCount = updatedCheckpoints.filter((cp) => cp.passed).length;
          const pct = Math.round((passedCount / updatedCheckpoints.length) * 100);
          return {
            ...t,
            checkpoints: updatedCheckpoints,
            currentProgressPercent: pct,
            currentLocationName: updatedCheckpoints[checkpointIndex].name,
            lastUpdated: 'Just now',
          };
        }
        return t;
      })
    );
  };

  const reportIncident = (
    jobId: string,
    incident: Omit<TripIncident, 'id' | 'timestamp' | 'isResolved'>
  ) => {
    const newInc: TripIncident = {
      ...incident,
      id: `inc_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
      isResolved: false,
    };
    setTrips((prev) =>
      prev.map((t) => {
        if (t.jobId === jobId) {
          return {
            ...t,
            status: 'stoppage_reported',
            incidents: [newInc, ...t.incidents],
            lastUpdated: 'Just now - Stoppage logged',
          };
        }
        return t;
      })
    );
  };

  const resolveIncident = (jobId: string, incidentId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.jobId === jobId) {
          const updatedIncidents = t.incidents.map((inc) =>
            inc.id === incidentId
              ? {
                  ...inc,
                  isResolved: true,
                  resolvedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
                }
              : inc
          );
          return {
            ...t,
            status: 'in_transit',
            incidents: updatedIncidents,
            lastUpdated: 'Trip resumed',
          };
        }
        return t;
      })
    );
  };

  const submitProofOfDelivery = (
    jobId: string,
    pod: { photoUrl: string; consigneeSignatureName: string; notes: string; enteredPin: string }
  ) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Validate consignee PIN if configured
    if (job.consigneeContact?.pin && pod.enteredPin.trim() !== job.consigneeContact.pin) {
      return {
        success: false,
        error: `Invalid Consignee Release PIN! Recipient gave '${pod.enteredPin}'. Expected 4-digit security PIN provided to consignee.`,
      };
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (t.jobId === jobId) {
          return {
            ...t,
            status: 'delivered',
            currentProgressPercent: 100,
            currentLocationName: `${job.destination} (Delivered & Verified)`,
            proofOfDelivery: {
              photoUrl: pod.photoUrl,
              consigneeSignatureName: pod.consigneeSignatureName,
              deliveredAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
              notes: pod.notes,
              verifiedWithPin: true,
            },
          };
        }
        return t;
      })
    );

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'delivered' } : j))
    );

    return { success: true };
  };

  const depositEscrowMpesa = async (
    jobId: string,
    amountKes: number,
    phone: string
  ): Promise<{ success: boolean; receiptNumber: string }> => {
    const job = jobs.find((j) => j.id === jobId);
    const receipt = `QHK${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newTx: MpesaTransaction = {
      id: `tx_${Date.now()}`,
      jobId,
      supplierId: job ? job.supplierId : currentUser.id,
      transporterId: job?.assignedTransporterId || '',
      amountKes,
      phoneNumber: phone,
      mpesaReceiptNumber: receipt,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      type: 'escrow_deposit',
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `M-Pesa STK Push Deposit for job ${jobId}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, escrowStatus: 'held_in_escrow' } : j))
    );
    return { success: true, receiptNumber: receipt };
  };

  const releaseFuelAdvanceMpesa = async (
    jobId: string
  ): Promise<{ success: boolean; receiptNumber: string }> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, receiptNumber: '' };

    const fuelAdvance = job.fuelAdvanceKes || Math.round((job.agreedPriceKes || job.offeredPriceKes) * 0.5);
    const transporter = users.find((u) => u.id === job.assignedTransporterId);
    const receipt = `QHJ${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTx: MpesaTransaction = {
      id: `tx_${Date.now()}_fuel`,
      jobId,
      supplierId: job.supplierId,
      transporterId: job.assignedTransporterId || '',
      amountKes: fuelAdvance,
      phoneNumber: transporter?.phone || '+254700000000',
      mpesaReceiptNumber: receipt,
      checkoutRequestId: `ws_B2C_FUEL_${Date.now()}`,
      type: 'fuel_advance',
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `50% Fuel & Mobilization Advance disbursed to driver ${transporter?.name || 'Driver'}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              isLoadingVerified: true,
              loadingVerifiedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
              isFuelAdvanceReleased: true,
              status: 'in_transit',
              escrowStatus: 'advance_50_released',
            }
          : j
      )
    );

    return { success: true, receiptNumber: receipt };
  };

  const verifyLoadingAndReleaseFuelAdvance = async (
    jobId: string,
    details?: { loadingPhotoUrl?: string; sealConfirmed?: string }
  ): Promise<{ success: boolean; receiptNumber: string }> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, receiptNumber: '' };

    const fuelAdvance = job.fuelAdvanceKes || Math.round((job.agreedPriceKes || job.offeredPriceKes) * 0.5);
    const transporter = users.find((u) => u.id === job.assignedTransporterId);
    const receipt = `QHJ${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTx: MpesaTransaction = {
      id: `tx_${Date.now()}_fuel_adv`,
      jobId,
      supplierId: job.supplierId,
      transporterId: job.assignedTransporterId || '',
      amountKes: fuelAdvance,
      phoneNumber: transporter?.phone || '+254700000000',
      mpesaReceiptNumber: receipt,
      checkoutRequestId: `ws_B2C_FUEL_VERIF_${Date.now()}`,
      type: 'fuel_advance',
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `Loading verified at warehouse. 50% Fuel & Mobilization Advance disbursed to driver ${transporter?.name || 'Driver'}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              isLoadingVerified: true,
              loadingVerifiedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
              isFuelAdvanceReleased: true,
              status: 'in_transit',
              escrowStatus: 'advance_50_released',
            }
          : j
      )
    );

    setTrips((prev) =>
      prev.map((t) =>
        t.jobId === jobId
          ? {
              ...t,
              status: 'in_transit',
              currentProgressPercent: 10,
              currentLocationName: `${job.origin} (Loading Verified & Departed)`,
              lastUpdated: 'Just now - 50% Fuel advance disbursed',
            }
          : t
      )
    );

    sendChatMessage(
      jobId,
      `✅ [LOADING VERIFIED]: Warehouse supervisor inspected cargo, tied ratchets and verified tamper seal ${job.containerSealNumber}. 50% Fuel Advance (KES ${fuelAdvance.toLocaleString()}) disbursed to driver M-Pesa. Truck cleared for departure!`
    );

    return { success: true, receiptNumber: receipt };
  };

  const releaseFinalBalanceMpesa = async (
    jobId: string
  ): Promise<{ success: boolean; receiptNumber: string }> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, receiptNumber: '' };

    const finalBalance = job.finalBalanceKes || Math.round((job.agreedPriceKes || job.offeredPriceKes) * 0.5);
    const transporter = users.find((u) => u.id === job.assignedTransporterId);
    const receipt = `QHJ${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTx: MpesaTransaction = {
      id: `tx_${Date.now()}_final`,
      jobId,
      supplierId: job.supplierId,
      transporterId: job.assignedTransporterId || '',
      amountKes: finalBalance,
      phoneNumber: transporter?.phone || '+254700000000',
      mpesaReceiptNumber: receipt,
      checkoutRequestId: `ws_B2C_FINAL_${Date.now()}`,
      type: 'payout_release',
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `50% Final Settlement Release to driver ${transporter?.name || 'Driver'} upon verified e-POD sign-off`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'completed',
              isFinalBalanceReleased: true,
              escrowStatus: 'fully_released',
            }
          : j
      )
    );

    // Increment completed trips for transporter
    if (job.assignedTransporterId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === job.assignedTransporterId ? { ...u, completedTrips: u.completedTrips + 1 } : u
        )
      );
    }

    return { success: true, receiptNumber: receipt };
  };

  const releaseEscrowMpesa = async (
    jobId: string
  ): Promise<{ success: boolean; receiptNumber: string }> => {
    return releaseFinalBalanceMpesa(jobId);
  };

  const fileCargoClaim = (
    jobId: string,
    claimData: Omit<CargoClaim, 'id' | 'jobId' | 'status' | 'createdAt'>
  ) => {
    const newClaim: CargoClaim = {
      ...claimData,
      id: `claim_${Date.now()}`,
      jobId,
      status: 'under_investigation',
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'disputed',
              escrowStatus: 'in_dispute',
              cargoClaim: newClaim,
            }
          : j
      )
    );

    sendChatMessage(
      jobId,
      `🚨 [SAFETY & CARGO CLAIM FILED]: Discrepancy logged for ${claimData.claimType.replace('_', ' ')}. Estimated impact: KES ${claimData.estimatedLossKes.toLocaleString()}. Remaining 50% escrow is held under investigation. GIT Policy: ${claimData.gitInsurancePolicyNo}`
    );
  };

  const resolveCargoClaim = (
    jobId: string,
    deductionKes: number,
    resolutionNotes: string,
    escalateToInsurance = false
  ) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || !job.cargoClaim) return;

    const finalBalance = job.finalBalanceKes || 0;
    const adjustedPayout = Math.max(0, finalBalance - deductionKes);

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const updatedClaim: CargoClaim = {
            ...j.cargoClaim!,
            status: escalateToInsurance ? 'insurance_claim_filed' : 'settled_adjusted',
            resolutionDeductionKes: deductionKes,
            resolutionNotes,
          };
          return {
            ...j,
            status: 'completed',
            escrowStatus: 'fully_released',
            cargoClaim: updatedClaim,
          };
        }
        return j;
      })
    );

    // If adjusted payout > 0, disburse remaining balance to transporter
    if (adjustedPayout > 0 && job.assignedTransporterId) {
      const receipt = `QHJ${Math.floor(1000000 + Math.random() * 9000000)}`;
      const transporter = users.find((u) => u.id === job.assignedTransporterId);
      const newTx: MpesaTransaction = {
        id: `tx_${Date.now()}_adj`,
        jobId,
        supplierId: job.supplierId,
        transporterId: job.assignedTransporterId,
        amountKes: adjustedPayout,
        phoneNumber: transporter?.phone || '+254700000000',
        mpesaReceiptNumber: receipt,
        checkoutRequestId: `ws_B2C_ADJ_${Date.now()}`,
        type: 'payout_release',
        status: 'success',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        notes: `Adjusted final settlement after dispute (KES ${deductionKes.toLocaleString()} deduction): KES ${adjustedPayout.toLocaleString()}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    sendChatMessage(
      jobId,
      `⚖️ [CLAIM RESOLVED]: Claim concluded. ${resolutionNotes}. Deduction: KES ${deductionKes.toLocaleString()}. ${
        escalateToInsurance ? 'Escalated to Goods In Transit (GIT) Underwriter.' : 'Settled.'
      }`
    );
  };

  const sendChatMessage = (jobId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      jobId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('user_s2');
    setJobs(INITIAL_JOBS);
    setProposals(INITIAL_PROPOSALS);
    setTrips(INITIAL_TRANSIT_TRIPS);
    setTransactions(INITIAL_MPESA_TRANSACTIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSelectedTripForMap(INITIAL_TRANSIT_TRIPS[0]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        jobs,
        proposals,
        trips,
        transactions,
        chatMessages,
        activeJobChatId,
        selectedTripForMap,
        setCurrentUserById,
        setCurrentRole,
        addUser,
        removeUser,
        updateUserVerification,
        updateUserDocuments,
        toggleBackhaul,
        createJob,
        submitProposal,
        acceptProposal,
        rejectProposal,
        cancelJob,
        startTrip,
        updateTripProgress,
        advanceTripCheckpoint,
        reportIncident,
        resolveIncident,
        submitProofOfDelivery,
        depositEscrowMpesa,
        releaseFuelAdvanceMpesa,
        verifyLoadingAndReleaseFuelAdvance,
        releaseFinalBalanceMpesa,
        releaseEscrowMpesa,
        fileCargoClaim,
        resolveCargoClaim,
        sendChatMessage,
        setActiveJobChatId,
        setSelectedTripForMap,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
