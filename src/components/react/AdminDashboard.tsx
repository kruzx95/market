import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $orders, updateOrderStatus, updateOrderPaymentStatus } from '../../utils/orderStore';
import { formatRupiah, formatNumber } from '../../utils/currency';
import { generateResiWhatsAppUrl } from '../../utils/whatsapp';
import type { Order, Product } from '../../types';
import productsData from '../../data/products.json';
import storeConfig from '../../data/storeConfig.json';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  Settings,
  Search,
  CheckCircle,
  Clock,
  Send,
  Plus,
  Edit,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  MessageCircle,
  Copy,
  LayoutDashboard,
} from 'lucide-react';

export default function AdminDashboard() {
  const orders = useStore($orders);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [resiInput, setResiInput] = useState<string>('');
  const [localProducts, setLocalProducts] = useState<Product[]>(productsData as any);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.whatsapp.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, searchQuery]);

  // Key metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const pendingShipmentCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'PROCESSING').length;
  }, [orders]);

  // Saved admin fees vs 8.5% marketplace commission
  const savedAdminFee = useMemo(() => {
    return Math.round(totalRevenue * 0.085);
  }, [totalRevenue]);

  const handleUpdateResi = (orderId: string) => {
    if (!resiInput.trim()) return;
    updateOrderStatus(orderId, 'SHIPPED', resiInput.trim());
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: 'SHIPPED',
        trackingNumber: resiInput.trim(),
      });
    }
    setResiInput('');
    alert('Nomor Resi berhasil disimpan & status pesanan diubah menjadi DIKIRIM.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                K
              </div>
              <div>
                <h1 className="font-bold text-sm text-white">{storeConfig.storeName}</h1>
                <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Admin Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Pesanan Masuk</span>
              </div>
              {pendingShipmentCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingShipmentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Katalog & Stok</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Toko</span>
            </button>
          </nav>
        </div>

        {/* Back to store link */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <a
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 p-2.5 rounded-xl"
          >
            <span>Lihat Toko Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        
        {/* Top Highlight Banner: Marketplace Fee Savings */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                0% Potongan Komisi Admin
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Anda Telah Berhemat <span className="text-emerald-400">{formatRupiah(savedAdminFee)}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Dibandingkan jika bertransaksi di marketplace konvensional dengan potongan rata-rata 8.5%.
              </p>
            </div>
          </div>
          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
            Status Sistem: <strong className="text-emerald-400">100% Aktif & Mandiri</strong>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Total Omset Sukses</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-1">
              {formatRupiah(totalRevenue)}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>↑ Semua transaksi QRIS & VA</span>
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Pesanan Perlu Dikirim</p>
            <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1">
              {pendingShipmentCount} Pesanan
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Siap dipacking & input resi</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Total Produk Aktif</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-1">
              {localProducts.length} Produk
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Koleksi Pria & Wanita</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Kecepatan Page Speed</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">
              99 / 100
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Astro Islands Engine</p>
          </div>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {[
                  { label: 'Semua', value: 'ALL' },
                  { label: 'Diproses (Perlu Kirim)', value: 'PROCESSING' },
                  { label: 'Dikirim', value: 'SHIPPED' },
                  { label: 'Menunggu Bayar', value: 'PENDING' },
                ].map((st) => (
                  <button
                    key={st.value}
                    onClick={() => setOrderStatusFilter(st.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      orderStatusFilter === st.value
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID order / nama / WhatsApp..."
                  className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">No. Order & Waktu</th>
                      <th className="px-4 py-3">Pembeli</th>
                      <th className="px-4 py-3">Barang & Kurir</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Pembayaran</th>
                      <th className="px-4 py-3">Status Pesanan</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          Tidak ada data pesanan yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                          
                          {/* Order ID & Date */}
                          <td className="px-4 py-3">
                            <p className="font-mono font-bold text-white">{order.id}</p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-3">
                            <p className="font-bold text-white">{order.customer.fullName}</p>
                            <p className="text-[11px] text-slate-400">{order.customer.whatsapp}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              {order.customer.district}, {order.customer.city}
                            </p>
                          </td>

                          {/* Items & Courier */}
                          <td className="px-4 py-3">
                            <p className="text-slate-300 font-medium">
                              {order.items.length} jenis ({order.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {order.courier.courierName} ({order.courier.serviceCode})
                            </p>
                          </td>

                          {/* Total */}
                          <td className="px-4 py-3 font-bold text-white">
                            {formatRupiah(order.totalAmount)}
                          </td>

                          {/* Payment status */}
                          <td className="px-4 py-3">
                            {order.paymentStatus === 'PAID' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Lunas
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" /> Belum Lunas
                              </span>
                            )}
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {order.paymentMethod.provider}
                            </p>
                          </td>

                          {/* Order status */}
                          <td className="px-4 py-3">
                            {order.orderStatus === 'PROCESSING' && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                📦 Diproses
                              </span>
                            )}
                            {order.orderStatus === 'SHIPPED' && (
                              <div>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                  🚚 Dikirim
                                </span>
                                {order.trackingNumber && (
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    Resi: {order.trackingNumber}
                                  </p>
                                )}
                              </div>
                            )}
                            {order.orderStatus === 'PENDING' && (
                              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                                Menunggu
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setResiInput(order.trackingNumber || '');
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Kelola
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT & STOCK INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="font-bold text-sm text-white">Inventori Stok Produk</h2>
                <p className="text-xs text-slate-400">
                  Pantau stok per varian ukuran & warna toko Anda
                </p>
              </div>
              <button
                onClick={() => alert('Fitur tambah produk siap dikoneksikan ke CMS/Database!')}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localProducts.map((product) => {
                const totalStock = product.variants.reduce((a, b) => a + b.stock, 0);

                return (
                  <div
                    key={product.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex gap-4"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-300 mt-1">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Total Stok:{' '}
                          <strong
                            className={totalStock <= 10 ? 'text-amber-400' : 'text-emerald-400'}
                          >
                            {totalStock} pcs
                          </strong>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {product.variants.length} Varian
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="font-bold text-base text-white">Pengaturan Identitas Toko</h2>
              <p className="text-xs text-slate-400">
                Ubah informasi kontak, nomor WhatsApp CS, dan voucher promo
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Nama Toko / Brand</label>
                <input
                  type="text"
                  defaultValue={storeConfig.storeName}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Nomor WhatsApp CS</label>
                  <input
                    type="text"
                    defaultValue={storeConfig.whatsappNumber}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Minimal Gratis Ongkir (Rp)</label>
                  <input
                    type="number"
                    defaultValue={storeConfig.freeShippingMinAmount}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Alamat Asal Pengiriman</label>
                <textarea
                  rows={2}
                  defaultValue={storeConfig.address}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert('Pengaturan toko berhasil diperbarui!')}
                  className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER DETAILS & RESI INPUT MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in text-xs">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-white">Kelola Pesanan {selectedOrder.id}</h3>
                  <p className="text-[11px] text-slate-400">
                    {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* Customer info */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-sm">{selectedOrder.customer.fullName}</p>
                    <p className="text-slate-400 font-mono">{selectedOrder.customer.whatsapp}</p>
                  </div>
                  <a
                    href={`https://wa.me/${selectedOrder.customer.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat WA
                  </a>
                </div>
                <p className="text-slate-300 text-[11px]">
                  {selectedOrder.customer.address}, Kec. {selectedOrder.customer.district},{' '}
                  {selectedOrder.customer.city}, {selectedOrder.customer.province} (
                  {selectedOrder.customer.postalCode})
                </p>
                {selectedOrder.customer.notes && (
                  <p className="text-amber-300 text-[11px] italic">
                    Catatan: {selectedOrder.customer.notes}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="font-bold text-slate-300">Rincian Barang:</p>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.color} - Size {item.size} ({item.quantity}x)
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Input Nomor Resi & Send WA */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block font-bold text-white">
                  Nomor Resi Pengiriman ({selectedOrder.courier.courierName})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resiInput}
                    onChange={(e) => setResiInput(e.target.value)}
                    placeholder="Contoh: JNEREG8912384918"
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono uppercase focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdateResi(selectedOrder.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                  >
                    Simpan Resi
                  </button>
                </div>

                {/* 1-Click WhatsApp Resi Update to Customer */}
                <a
                  href={generateResiWhatsAppUrl({
                    ...selectedOrder,
                    trackingNumber: resiInput || selectedOrder.trackingNumber || 'PROSES-PACKING',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Notifikasi Resi ke WhatsApp Pembeli (1-Klik)</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
