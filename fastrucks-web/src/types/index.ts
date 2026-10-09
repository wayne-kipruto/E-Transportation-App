export type UserRole = 'supplier' | 'transporter' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unsubmitted';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  age: number; // Must be >= 28 for heavy commercial drivers as per Kenya Traffic Act CAP 403
  avatar?: string;
  rating: number;
  reviewCount: number;
  completedTrips: number;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  // Supplier specific
  businessName?: string;
  businessAddress?: string;
  businessDescription?: string;
  kraPin?: string;
  // Transporter specific
  vehicleType?: string; // e.g. "Isuzu FSH 12-Ton Box Truck", "Mercedes Actros 28-Ton Flatbed"
  vehicleRegNumber?: string; // e.g. "KDB 492X"
  tonnageCapacity?: number; // In metric tonnes
  bodyType?: 'Closed Box' | 'Open Flatbed' | 'Curtain Side' | 'Refrigerated' | 'Tipper' | 'Tanker';
  vehicleDimensions?: string;
  isAvailableForBackhaul?: boolean;
  backhaulDetails?: {
    origin: string;
    destination: string;
    availableDate: string;
    targetPriceKes?: number;
  };
  documents?: {
    logbookUrl?: string;
    licenseUrl?: string;
    vehiclePhotoFront?: string;
    vehiclePhotoSide?: string;
    inspectionCertUrl?: string;
  };
}

export type JobCategory =
  | 'Fragile Goods (Glassware, Tiles)'
  | 'Construction Materials (Cement, Steel)'
  | 'Agricultural Produce & Perishables'
  | 'Household & Commercial Relocation'
  | 'FMCG & Dry Packaged Goods'
  | 'Heavy Machinery & Industrial Equipment';

export type JobStatus = 'open' | 'assigned' | 'in_transit' | 'delivered' | 'completed' | 'disputed' | 'cancelled';

export interface CargoClaim {
  id: string;
  jobId: string;
  raisedByUserId: string;
  raisedByRole: 'supplier' | 'transporter';
  claimType: 'goods_damage' | 'theft_pilferage' | 'shortage_missing_units' | 'seal_tampered' | 'route_deviation';
  description: string;
  estimatedLossKes: number;
  evidencePhotoUrls: string[];
  policeAbstractNumber?: string; // Kenya Police OB Number for theft
  gitInsurancePolicyNo: string;
  status: 'under_investigation' | 'settled_adjusted' | 'insurance_claim_filed' | 'rejected_dismissed';
  resolutionDeductionKes?: number;
  resolutionNotes?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  supplierId: string;
  supplierName: string;
  supplierBusiness: string;
  supplierPhone: string;
  goodsCategory: JobCategory;
  goodsDescription: string;
  tonnage: number;
  requiredVehicleType: string;
  bodyTypeRequired: string;
  origin: string; // Domestic or Cross-Border OSBP
  destination: string;
  corridorType: 'Domestic Kenya' | 'Northern Corridor (Uganda / Rwanda)' | 'Central Corridor (Tanzania)' | 'LAPSSET / Northern (Ethiopia)' | 'South Sudan Corridor';
  distanceKm: number;
  estimatedHours: number;
  offeredPriceKes: number;
  agreedPriceKes?: number;
  // 50/50 Milestone Payment Structure
  fuelAdvanceKes?: number; // 50% to cater for diesel, weighbridges & tolls (released AFTER loading verification)
  finalBalanceKes?: number; // 50% released upon verified e-POD sign-off
  isLoadingVerified: boolean;
  loadingVerifiedAt?: string;
  isFuelAdvanceReleased: boolean;
  isFinalBalanceReleased: boolean;
  // Security & Insurance
  gitInsurancePolicy: string; // Goods in Transit insurance
  containerSealNumber?: string; // Tamper-evident seal
  escrowStatus: 'unfunded' | 'held_in_escrow' | 'advance_50_released' | 'fully_released' | 'in_dispute' | 'refunded';
  pickupDate: string;
  deliveryDate: string;
  status: JobStatus;
  assignedTransporterId?: string;
  assignedTransporterName?: string;
  createdAt: string;
  notes?: string;
  consigneeContact?: {
    name: string;
    phone: string;
    pin: string; // Secret one-time pin for proof of delivery release
  };
  cargoClaim?: CargoClaim;
}

export interface JobProposal {
  id: string;
  jobId: string;
  transporterId: string;
  transporterName: string;
  transporterPhone: string;
  transporterAge: number;
  transporterVehicle: string;
  transporterRating: number;
  transporterCompletedTrips: number;
  isVerified: boolean;
  bidPriceKes: number;
  counterOfferNote: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

export type IncidentType =
  | 'rest_meal_stop'
  | 'weighbridge_queue'
  | 'mechanical_breakdown'
  | 'flat_tire'
  | 'police_clearance'
  | 'traffic_congestion'
  | 'weather_hazard'
  | 'other';

export interface TripIncident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  locationName: string;
  timestamp: string;
  durationEstimateMins?: number;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface Checkpoint {
  name: string;
  lat: number;
  lng: number;
  kmFromStart: number;
  passed: boolean;
  passedAt?: string;
  isWeighbridge?: boolean;
}

export interface TransitTrip {
  id: string;
  jobId: string;
  transporterId: string;
  supplierId: string;
  status: 'loading' | 'departed' | 'in_transit' | 'stoppage_reported' | 'at_destination' | 'delivered';
  currentProgressPercent: number;
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
  lastUpdated: string;
  estimatedArrival: string;
  checkpoints: Checkpoint[];
  incidents: TripIncident[];
  proofOfDelivery?: {
    photoUrl: string;
    consigneeSignatureName: string;
    deliveredAt: string;
    notes: string;
    verifiedWithPin: boolean;
  };
}

export interface MpesaTransaction {
  id: string;
  jobId: string;
  supplierId: string;
  transporterId: string;
  amountKes: number;
  phoneNumber: string;
  mpesaReceiptNumber: string;
  checkoutRequestId: string;
  type: 'escrow_deposit' | 'payout_release' | 'fuel_advance';
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}
