import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartItems,
  $cartSubtotal,
  $cartTotalWeight,
  $appliedVoucher,
  $cartDiscount,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../../utils/cartStore';
import { saveNewOrder } from '../../utils/orderStore';
import { formatRupiah, formatNumber } from '../../utils/currency';
import { generateOrderWhatsAppMessage } from '../../utils/whatsapp';
import type { CourierService, PaymentMethodOption, Order, OrderCustomer } from '../../types';
import regionsData from '../../data/regions.json';
import couriersData from '../../data/couriers.json';
import storeConfig from '../../data/storeConfig.json';
import confetti from 'canvas-confetti';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  MessageCircle,
  Clock,
  Copy,
  ExternalLink,
} from 'lucide-react';

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'qris',
    category: 'qris',
    name: 'QRIS Instan (Semua E-Wallet & Bank)',
    provider: 'QRIS Nasional',
    icon: '📱',
    fee: 0,
    isPopular: true,
    instructions: [
      'Buka aplikasi e-wallet pilihan Anda (GoPay, ShopeePay, OVO, Dana) atau Mobile Banking (BCA, Livin, BRImo, dll)',
      'Pilih menu Scan / Bayar QRIS',
      'Arahkan kamera ke kode QRIS di bawah ini',
      'Pastikan nama merchant adalah KALA Studio dan konfirmasi pembayaran',
    ],
  },
  {
    id: 'bca_va',
    category: 'va',
    name: 'BCA Virtual Account',
    provider: 'Bank Central Asia',
    icon: '🏦',
    fee: 0,
    isPopular: true,
    vaNumber: '8801289348192019',
    instructions: [
      'Buka BCA Mobile > m-Transfer > BCA Virtual Account',
      'Masukkan nomor Virtual Account: 8801289348192019',
      'Pastikan nominal tagihan dan nama merchant sudah sesuai',
      'Masukkan PIN m-BCA Anda untuk menyelesaikan transaksi',
    ],
  },
  {
    id: 'mandiri_va',
    category: 'va',
    name: 'Mandiri Virtual Account',
    provider: 'Bank Mandiri',
    icon: '🏛️',
    fee: 0,
    vaNumber: '8950812984729182',
    instructions: [
      'Buka Livin by Mandiri > Bayar > Cari Penyedia Jasa: KALA Studio',
      'Masukkan nomor Virtual Account: 8950812984729182',
      'Konfirmasi pembayaran dengan PIN Livin',
    ],
  },
  {
    id: 'bri_va',
    category: 'va',
    name: 'BRI BRIVA',
    provider: 'Bank BRI',
    icon: '💳',
    fee: 0,
    vaNumber: '1289301928471923',
    instructions: [
      'Buka aplikasi BRImo > Pembayaran > BRIVA',
      'Masukkan nomor BRIVA: 1289301928471923',
      'Konfirmasi detail tagihan dan masukkan PIN BRImo',
    ],
  },
  {
    id: 'cod',
    category: 'cod',
    name: 'COD (Bayar Tunai di Tempat)',
    provider: 'Kurir SiCepat / J&T',
    icon: '💵',
    fee: 2500,
    instructions: [
      'Siapkan uang pas saat kurir tiba di alamat Anda',
      'Pastikan nomor WhatsApp Anda aktif agar kurir dapat menghubungi sebelum pengantaran',
      'Harap tidak membuka paket sebelum membayar ke kurir',
    ],
  },
];

export default function OnePageCheckout() {
  const items = useStore($cartItems);
  const subtotal = useStore($cartSubtotal);
  const totalWeight = useStore($cartTotalWeight);
  const appliedVoucher = useStore($appliedVoucher);
  const discount = useStore($cartDiscount);

  // Customer state
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(regionsData[0]?.province || '');
  const [selectedCity, setSelectedCity] = useState(regionsData[0]?.cities[0]?.cityName || '');
  const [selectedDistrict, setSelectedDistrict] = useState(
    regionsData[0]?.cities[0]?.districts[0]?.districtName || ''
  );
  const [postalCode, setPostalCode] = useState(
    regionsData[0]?.cities[0]?.districts[0]?.postalCode || ''
  );
  const [notes, setNotes] = useState('');

  // Voucher input state
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected payment and courier
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('qris');
  const [selectedCourierKey, setSelectedCourierKey] = useState<string>('jne-REG');

  // Submission & Success state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [qrisTimer, setQrisTimer] = useState<number>(900); // 15 mins

  // Filter cities by province
  const currentProvinceData = useMemo(() => {
    return regionsData.find((p) => p.province === selectedProvince) || regionsData[0];
  }, [selectedProvince]);

  const currentCityData = useMemo(() => {
    return (
      currentProvinceData.cities.find((c) => c.cityName === selectedCity) ||
      currentProvinceData.cities[0]
    );
  }, [currentProvinceData, selectedCity]);

  const currentDistrictData = useMemo(() => {
    return (
      currentCityData.districts.find((d) => d.districtName === selectedDistrict) ||
      currentCityData.districts[0]
    );
  }, [currentCityData, selectedDistrict]);

  // Update postal code and district when city changes
  useEffect(() => {
    if (currentCityData && currentCityData.districts.length > 0) {
      setSelectedDistrict(currentCityData.districts[0].districtName);
      setPostalCode(currentCityData.districts[0].postalCode);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (currentDistrictData) {
      setPostalCode(currentDistrictData.postalCode);
    }
  }, [selectedDistrict]);

  // Calculate available couriers with dynamic rates
  const calculatedCouriers: CourierService[] = useMemo(() => {
    const baseRate = currentDistrictData?.baseRate || 10000;
    const weightKg = Math.max(1, Math.ceil(totalWeight / 1000));

    return couriersData.map((c) => {
      let cost = Math.round(baseRate * c.multiplier * weightKg);
      // If free shipping min spend met
      if (subtotal >= storeConfig.freeShippingMinAmount && c.serviceCode !== 'YES' && c.serviceCode !== 'INSTANT') {
        cost = 0;
      }
      return {
        courierCode: c.courierCode as any,
        courierName: c.courierName,
        serviceCode: c.serviceCode,
        serviceName: c.serviceName,
        etd: c.etd,
        cost: cost,
        badge: c.badge,
        logo: c.logo,
      };
    });
  }, [currentDistrictData, totalWeight, subtotal]);

  // Active selected courier object
  const activeCourier: CourierService = useMemo(() => {
    const found = calculatedCouriers.find(
      (c) => `${c.courierCode}-${c.serviceCode}` === selectedCourierKey
    );
    return found || calculatedCouriers[0];
  }, [calculatedCouriers, selectedCourierKey]);

  // Active payment option object
  const activePayment: PaymentMethodOption = useMemo(() => {
    return PAYMENT_METHODS.find((p) => p.id === selectedPaymentId) || PAYMENT_METHODS[0];
  }, [selectedPaymentId]);

  // Grand Total calculation
  const shippingCost = activeCourier?.cost || 0;
  const paymentFee = activePayment.fee || 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingCost + paymentFee);

  // Timer countdown for QRIS
  useEffect(() => {
    if (!completedOrder || completedOrder.paymentMethod.id !== 'qris') return;
    const timer = setInterval(() => {
      setQrisTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [completedOrder]);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = applyCoupon(voucherInput);
    if (res.success) {
      setVoucherMsg({ type: 'success', text: res.message });
      setVoucherInput('');
    } else {
      setVoucherMsg({ type: 'error', text: res.message });
    }
  };

  const handleCreateOrder = (isWhatsAppOrder = false) => {
    if (!fullName.trim() || !whatsapp.trim() || !address.trim()) {
      alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman terlebih dahulu.');
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        province: selectedProvince,
        city: selectedCity,
        district: selectedDistrict,
        postalCode: postalCode,
        notes: notes.trim() || undefined,
      },
      items: [...items],
      subtotal,
      shippingCost,
      discountAmount: discount,
      paymentFee,
      uniqueCode: 0,
      totalAmount: grandTotal,
      courier: activeCourier,
      paymentMethod: activePayment,
      paymentStatus: activePayment.id === 'cod' ? 'UNPAID' : 'PAID',
      orderStatus: 'PROCESSING',
      voucherCode: appliedVoucher?.code,
    };

    // Save order
    saveNewOrder(newOrder);

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    setCompletedOrder(newOrder);
    setIsProcessing(false);
    clearCart();

    if (isWhatsAppOrder) {
      const waMsg = generateOrderWhatsAppMessage(newOrder);
      const waUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${waMsg}`;
      window.open(waUrl, '_blank');
    }
  };

  // If order is completed, show the Instant Invoice / QRIS Screen
  if (completedOrder) {
    const minutes = Math.floor(qrisTimer / 60);
    const seconds = qrisTimer % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6 text-center animate-fade-in">
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Pesanan Berhasil Dibuat
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Terima Kasih, Kak {completedOrder.customer.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              No. Pesanan: <strong className="text-slate-900 font-mono">{completedOrder.id}</strong>
            </p>
          </div>

          {/* Payment Card Simulator */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs text-slate-500">Metode Pembayaran</p>
                <p className="text-sm font-bold text-slate-900">{completedOrder.paymentMethod.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Tagihan</p>
                <p className="text-lg font-bold text-slate-900">{formatRupiah(completedOrder.totalAmount)}</p>
              </div>
            </div>

            {/* QRIS Display */}
            {completedOrder.paymentMethod.id === 'qris' && (
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Selesaikan dalam: {formattedTimer}</span>
                </div>

                {/* QR Code Mockup Graphic */}
                <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-sm">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226580014ID.LINKAJA.WWW0118936009110022303030208123456785204581253033605802ID5912KALA_STUDIO6007JAKARTA61051219062070703A016304E88E"
                    alt="QRIS Payment Code"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                  <div className="text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    NMID: ID1020261982739
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-900">Scan QRIS Menggunakan Aplikasi Apa Saja</p>
                  <p className="text-[11px] text-slate-500">BCA Mobile, Livin, BRImo, GoPay, ShopeePay, OVO, Dana</p>
                </div>
              </div>
            )}

            {/* Virtual Account Display */}
            {completedOrder.paymentMethod.category === 'va' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs text-slate-500">Nomor Virtual Account:</p>
                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg font-mono font-bold text-base text-slate-900">
                  <span>{completedOrder.paymentMethod.vaNumber || '8801289348192019'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        completedOrder.paymentMethod.vaNumber || '8801289348192019'
                      );
                      alert('Nomor Virtual Account disalin!');
                    }}
                    className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-sans font-semibold bg-white px-2 py-1 rounded shadow-sm"
                  >
                    <Copy className="w-3 h-3" /> Salin
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <p className="font-bold text-slate-800">Petunjuk Pembayaran:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500">
                {completedOrder.paymentMethod.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${generateOrderWhatsAppMessage(completedOrder)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Konfirmasi & Kirim Bukti via WhatsApp</span>
            </a>

            <a
              href="/"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center transition-colors"
            >
              Kembali ke Beranda
            </a>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty and no completed order
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Keranjang Belanja Kosong</h2>
        <p className="text-xs text-slate-500">
          Silakan pilih produk favorit Anda terlebih dahulu sebelum melanjutkan ke pembayaran.
        </p>
        <a
          href="/"
          className="inline-block py-2.5 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Belanja Sekarang
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            title="Kembali ke Toko"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">One-Page Checkout</h1>
            <p className="text-xs text-slate-500">
              Pengisian data cepat & pembayaran aman bebas biaya admin
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Customer Form, Shipping, Payment (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. DATA PENERIMA */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-sm font-bold text-slate-900">Informasi Pembeli & Penerima</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Penerima <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Dimas Prasetyo"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Untuk notifikasi resi otomatis via WA
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ALAMAT PENGIRIMAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-sm font-bold text-slate-900">Alamat Pengiriman (Wilayah Indonesia)</h2>
            </div>

            <div className="space-y-3">
              {/* Region selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Provinsi</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      const p = regionsData.find((r) => r.province === e.target.value);
                      if (p && p.cities.length > 0) {
                        setSelectedCity(p.cities[0].cityName);
                      }
                    }}
                    className="w-full py-2 px-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                  >
                    {regionsData.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full py-2 px-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                  >
                    {currentProvinceData.cities.map((c) => (
                      <option key={c.cityName} value={c.cityName}>
                        {c.type} {c.cityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kecamatan</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full py-2 px-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                  >
                    {currentCityData.districts.map((d) => (
                      <option key={d.districtName} value={d.districtName}>
                        Kec. {d.districtName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap & Patokan Rumah <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, blok, atau patokan (misal: samping masjid)"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="12345"
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Catatan Pengiriman <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Misal: Titip di pos satpam"
                    className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PILIHAN KURIR & ONGKIR */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-sm font-bold text-slate-900">Pilih Ekspedisi / Kurir</h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Total Berat: {Math.max(1, Math.round(totalWeight))} gram
              </span>
            </div>

            <div className="space-y-2">
              {calculatedCouriers.map((courier) => {
                const key = `${courier.courierCode}-${courier.serviceCode}`;
                const isSelected = selectedCourierKey === key;

                return (
                  <label
                    key={key}
                    onClick={() => setSelectedCourierKey(key)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courier"
                        checked={isSelected}
                        onChange={() => setSelectedCourierKey(key)}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {courier.serviceName}
                          </span>
                          {courier.badge && (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {courier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Estimasi tiba: {courier.etd}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {courier.cost === 0 ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          GRATIS ONGKIR
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-900">
                          {formatRupiah(courier.cost)}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. METODE PEMBAYARAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h2 className="text-sm font-bold text-slate-900">Metode Pembayaran (Lokal & Otomatis)</h2>
            </div>

            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPaymentId === method.id;

                return (
                  <label
                    key={method.id}
                    onClick={() => setSelectedPaymentId(method.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={isSelected}
                        onChange={() => setSelectedPaymentId(method.id)}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{method.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {method.name}
                            </span>
                            {method.isPopular && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Populer
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {method.provider}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-semibold text-slate-700">
                      {method.fee === 0 ? 'Bebas Biaya' : `+${formatRupiah(method.fee)}`}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary & Instant Checkout Button (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card space-y-5">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Ringkasan Pesanan</span>
              <span className="text-xs font-normal text-slate-500">
                {items.reduce((a, b) => a + b.quantity, 0)} Barang
              </span>
            </h3>

            {/* Item List Preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.color} • Size {item.size} • {item.quantity}x
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher Coupon Section */}
            <div className="pt-2 border-t border-slate-100">
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-lg text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kupon <strong>{appliedVoucher.code}</strong> (-{formatRupiah(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold underline ml-2"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                        placeholder="Voucher: FASHIONHEMAT"
                        className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Pakai
                    </button>
                  </div>
                  {voucherMsg && (
                    <p
                      className={`text-[11px] ${
                        voucherMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {voucherMsg.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Detailed Calculations */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-slate-900">{formatRupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon Kupon</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim ({activeCourier.serviceName})</span>
                <span className="font-semibold text-slate-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">Rp 0 (Gratis)</span>
                  ) : (
                    formatRupiah(shippingCost)
                  )}
                </span>
              </div>
              {paymentFee > 0 && (
                <div className="flex justify-between">
                  <span>Biaya Penanganan COD</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(paymentFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Pembayaran</span>
                <span className="text-slate-900">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Dual CTA: Pay Online / Pay via WhatsApp */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCreateOrder(false)}
                className="w-full py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Memproses Pesanan...' : 'Bayar Sekarang & Konfirmasi'}</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCreateOrder(true)}
                className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order Langsung via Chat WhatsApp</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 leading-tight">
              Dengan mengklik tombol di atas, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi KALA Studio.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
