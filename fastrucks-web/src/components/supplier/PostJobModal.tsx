import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobCategory } from '../../types';
import { Package, Truck, MapPin, Calendar, DollarSign, X, Calculator, ShieldCheck, Globe } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { createJob, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [goodsCategory, setGoodsCategory] = useState<JobCategory>('Fragile Goods (Glassware, Tiles)');
  const [goodsDescription, setGoodsDescription] = useState('');
  const [tonnage, setTonnage] = useState<number>(10);
  const [requiredVehicleType, setRequiredVehicleType] = useState('Medium Sized Box Truck (F-Series)');
  const [bodyTypeRequired, setBodyTypeRequired] = useState('Closed Box');
  
  // Freight Corridors (in & out of Kenya)
  const [corridorType, setCorridorType] = useState<
    'Domestic Kenya' | 'Northern Corridor (Uganda / Rwanda)' | 'Central Corridor (Tanzania)' | 'LAPSSET / Northern (Ethiopia)' | 'South Sudan Corridor'
  >('Domestic Kenya');
  
  const [origin, setOrigin] = useState('Athi River EPZ');
  const [destination, setDestination] = useState('Nakuru Industrial Area');
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-13');
  const [offeredPriceKes, setOfferedPriceKes] = useState<number>(55000);
  const [containerSealNumber, setContainerSealNumber] = useState(`SEAL-KE-${Math.floor(100000 + Math.random() * 900000)}`);
  const [gitInsurancePolicy, setGitInsurancePolicy] = useState('GIT-BRITAM-2026-98124 (Covered up to KES 8,000,000)');
  const [consigneeName, setConsigneeName] = useState('Receiving Officer');
  const [consigneePhone, setConsigneePhone] = useState('+254 722 000111');
  const [notes, setNotes] = useState('Forklift offloading available. Drivers must possess valid NTSA and logbook docs.');

  if (!isOpen) return null;

  // Corridor metrics calculator including Cross-Border corridors
  const getCorridorMetrics = (orig: string, dest: string, cType: string) => {
    if (cType === 'Northern Corridor (Uganda / Rwanda)') {
      return { km: 1170, hrs: 24.0, baseRate: 290000 };
    }
    if (cType === 'Central Corridor (Tanzania)') {
      return { km: 275, hrs: 6.0, baseRate: 125000 };
    }
    if (cType === 'LAPSSET / Northern (Ethiopia)') {
      return { km: 790, hrs: 14.5, baseRate: 240000 };
    }
    if (cType === 'South Sudan Corridor') {
      return { km: 1680, hrs: 36.0, baseRate: 380000 };
    }
    // Domestic
    if (orig.includes('Athi River') && dest.includes('Nakuru')) return { km: 188, hrs: 4.5, baseRate: 52000 };
    if (orig.includes('Nairobi') && dest.includes('Mombasa')) return { km: 485, hrs: 9.0, baseRate: 140000 };
    if (orig.includes('Mombasa') && dest.includes('Nairobi')) return { km: 485, hrs: 9.0, baseRate: 155000 };
    if (orig.includes('Nairobi') && dest.includes('Eldoret')) return { km: 310, hrs: 6.5, baseRate: 98000 };
    if (orig.includes('Nairobi') && dest.includes('Kisumu')) return { km: 355, hrs: 7.5, baseRate: 110000 };
    return { km: 150, hrs: 3.5, baseRate: 45000 };
  };

  const metrics = getCorridorMetrics(origin, destination, corridorType);
  const estimatedRecommendedRate = Math.round(metrics.baseRate * (tonnage / 10));

  // 50/50 Payment breakdown
  const fuelAdvance = Math.round(offeredPriceKes * 0.5);
  const finalBalance = offeredPriceKes - fuelAdvance;

  const handleCorridorTypeChange = (cType: typeof corridorType) => {
    setCorridorType(cType);
    if (cType === 'Northern Corridor (Uganda / Rwanda)') {
      setOrigin('Mombasa Port Gate 18 (Kenya)');
      setDestination('Kampala / Mukono Depot (Uganda)');
      setOfferedPriceKes(290000);
      setGitInsurancePolicy('GIT-JUBILEE-INT-77402 (Cross-Border Covered KES 12,000,000)');
    } else if (cType === 'Central Corridor (Tanzania)') {
      setOrigin('Nairobi Industrial Area (Kenya)');
      setDestination('Arusha Town Industrial Hub (Tanzania)');
      setOfferedPriceKes(125000);
      setGitInsurancePolicy('GIT-APA-CROSSBORDER-55209 (Covered KES 6,500,000)');
    } else if (cType === 'LAPSSET / Northern (Ethiopia)') {
      setOrigin('Enterprise Road, Nairobi');
      setDestination('Moyale One-Stop Border Post (Ethiopia Border)');
      setOfferedPriceKes(240000);
      setGitInsurancePolicy('GIT-CIC-NORTHERN-30114 (Covered KES 10,000,000)');
    } else if (cType === 'South Sudan Corridor') {
      setOrigin('Mombasa Port (Kenya)');
      setDestination('Juba Industrial Zone (South Sudan)');
      setOfferedPriceKes(380000);
      setGitInsurancePolicy('GIT-BRITAM-REGIONAL-88190 (Covered KES 15,000,000)');
    } else {
      setOrigin('Athi River EPZ');
      setDestination('Nakuru Industrial Area');
      setOfferedPriceKes(52000);
      setGitInsurancePolicy('GIT-BRITAM-2026-98124 (Covered up to KES 8,000,000)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    createJob({
      title: title || `${goodsCategory.split(' ')[0]} (${tonnage}T) ${origin} ➔ ${destination}`,
      supplierId: currentUser.id,
      supplierName: currentUser.name,
      supplierBusiness: currentUser.businessName || 'Wholesale Supplier',
      supplierPhone: currentUser.phone,
      goodsCategory,
      goodsDescription,
      tonnage,
      requiredVehicleType,
      bodyTypeRequired,
      origin,
      destination,
      corridorType,
      distanceKm: metrics.km,
      estimatedHours: metrics.hrs,
      offeredPriceKes,
      agreedPriceKes: offeredPriceKes,
      fuelAdvanceKes: fuelAdvance,
      finalBalanceKes: finalBalance,
      isLoadingVerified: false,
      isFuelAdvanceReleased: false,
      isFinalBalanceReleased: false,
      gitInsurancePolicy,
      containerSealNumber,
      pickupDate,
      deliveryDate,
      notes,
      consigneeContact: {
        name: consigneeName,
        phone: consigneePhone,
        pin,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Post Freight Haulage Request</h3>
              <p className="text-xs text-amber-100">50/50 Milestone Escrow • Kenya &amp; Regional Cross-Border Corridors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Corridor Selection (In and Out of Kenya) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-500" />
              Select Freight Corridor Network (In &amp; Out of Kenya)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { type: 'Domestic Kenya', label: 'Domestic Kenya (Nairobi, Mombasa, Nakuru, Kisumu, Eldoret)' },
                { type: 'Northern Corridor (Uganda / Rwanda)', label: 'Northern Corridor: Mombasa ➔ Malaba ➔ Kampala / Kigali' },
                { type: 'Central Corridor (Tanzania)', label: 'Central Corridor: Nairobi ➔ Namanga ➔ Arusha / Moshi' },
                { type: 'LAPSSET / Northern (Ethiopia)', label: 'LAPSSET Corridor: Nairobi ➔ Moyale OSBP ➔ Ethiopia' },
                { type: 'South Sudan Corridor', label: 'South Sudan Corridor: Mombasa ➔ Nadapal ➔ Juba' },
              ].map((c) => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => handleCorridorTypeChange(c.type as typeof corridorType)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-medium transition ${
                    corridorType === c.type
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Consignment Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Consignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 30 Panes Architectural Glass (8 Tonnes) to Nakuru"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cargo Classification & Tonnage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Cargo Classification
              </label>
              <select
                value={goodsCategory}
                onChange={(e) => setGoodsCategory(e.target.value as JobCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Fragile Goods (Glassware, Tiles)">Fragile Goods (Glassware, Tiles)</option>
                <option value="Construction Materials (Cement, Steel)">Construction Materials (Cement, Steel)</option>
                <option value="Agricultural Produce & Perishables">Agricultural Produce &amp; Perishables</option>
                <option value="FMCG & Dry Packaged Goods">FMCG &amp; Dry Packaged Goods</option>
                <option value="Heavy Machinery & Industrial Equipment">Heavy Machinery &amp; Industrial Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Payload Tonnage</span>
                <span className="text-amber-600 font-bold">{tonnage} Tonnes</span>
              </label>
              <input
                type="number"
                min="2"
                max="40"
                value={tonnage}
                onChange={(e) => setTonnage(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Loading Origin
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Destination Site / Cross-Border Terminal
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Goods Description &amp; Handling Constraints
            </label>
            <textarea
              rows={2}
              required
              value={goodsDescription}
              onChange={(e) => setGoodsDescription(e.target.value)}
              placeholder="e.g. 30 crates of tempered sheet glass. Must use strap anchors."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* 50/50 Payment Breakdown Card */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Total Offered Freight Budget (KES)
              </span>
              <input
                type="number"
                min="10000"
                step="1000"
                value={offeredPriceKes}
                onChange={(e) => setOfferedPriceKes(Number(e.target.value))}
                className="w-36 text-right px-3 py-1.5 text-sm font-black rounded-lg border border-amber-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-amber-900/60 text-xs">
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold block">
                  1st Milestone (50% Fuel &amp; Advance):
                </span>
                <span className="text-sm font-black text-amber-600">KES {fuelAdvance.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Disbursed on loading gate exit</span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">
                  2nd Milestone (50% Final Settlement):
                </span>
                <span className="text-sm font-black text-emerald-600">KES {finalBalance.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Held in escrow until e-POD sign-off</span>
              </div>
            </div>
          </div>

          {/* Security, Seals & Insurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tamper-Evident Container / Truck Seal #
              </label>
              <input
                type="text"
                required
                value={containerSealNumber}
                onChange={(e) => setContainerSealNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Goods In Transit (GIT) Cargo Insurance
              </label>
              <input
                type="text"
                required
                value={gitInsurancePolicy}
                onChange={(e) => setGitInsurancePolicy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Consignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Destination Consignee Officer Name
              </label>
              <input
                type="text"
                required
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Consignee Phone (Receives e-POD PIN)
              </label>
              <input
                type="tel"
                required
                value={consigneePhone}
                onChange={(e) => setConsigneePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
            >
              Publish Consignment to Transporters Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
