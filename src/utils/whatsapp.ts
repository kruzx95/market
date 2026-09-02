import type { Order, CartItem } from '../types';
import { formatRupiah } from './currency';
import storeConfig from '../data/storeConfig.json';

/**
 * Generate formatted WhatsApp message for order confirmation/invoice
 */
export function generateOrderWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   Varian: ${item.color} - ${item.size} (${item.quantity}x)\n   Harga: ${formatRupiah(item.price * item.quantity)}`
    )
    .join('\n\n');

  const message = `Halo *${storeConfig.storeName}*, saya ingin konfirmasi pesanan saya:

*No. Pesanan:* ${order.id}
*Tanggal:* ${new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB

*Data Penerima:*
Nama: *${order.customer.fullName}*
No. WA: ${order.customer.whatsapp}
Alamat: ${order.customer.address}, Kec. ${order.customer.district}, ${order.customer.city}, ${order.customer.province} (${order.customer.postalCode})
${order.customer.notes ? `Catatan: _${order.customer.notes}_\n` : ''}
*Rincian Produk:*
${itemsText}

*Rincian Pembayaran:*
Subtotal: ${formatRupiah(order.subtotal)}
Diskon: -${formatRupiah(order.discountAmount)}
Ongkir (${order.courier.serviceName}): ${formatRupiah(order.shippingCost)}
*Total Tagihan: ${formatRupiah(order.totalAmount)}*

Metode Bayar: *${order.paymentMethod.name}*
Status Pembayaran: *${order.paymentStatus === 'PAID' ? '✅ SUDAH DIBAYAR' : '⏳ MENUNGGU PEMBAYARAN'}*

Mohon segera diproses ya kak. Terima kasih! 🙏`;

  return encodeURIComponent(message);
}

/**
 * Generate WhatsApp URL for direct product inquiry or custom order
 */
export function generateProductInquiryWhatsAppUrl(productName: string, selectedVariant?: string, currentUrl?: string): string {
  const message = `Halo Admin *${storeConfig.storeName}*, saya tertarik dengan produk *${productName}*${selectedVariant ? ` (Varian: ${selectedVariant})` : ''}.\n\nApakah stoknya masih tersedia kak? ${currentUrl ? `\nLink: ${currentUrl}` : ''}`;
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL for seller sending shipping tracking/resi to customer
 */
export function generateResiWhatsAppUrl(order: Order): string {
  const cleanPhone = order.customer.whatsapp.replace(/\D/g, '').replace(/^0/, '62');
  const message = `Halo Kak *${order.customer.fullName}*! 👋

Kabar gembira! Pesanan Kakak dengan No. Order *${order.id}* dari *${storeConfig.storeName}* saat ini sudah *DIKIRIM* 🚚✨

*Ekspedisi:* ${order.courier.courierName} (${order.courier.serviceName})
*No. Resi Pengiriman:* *${order.trackingNumber || '-'}*

Paket sedang dalam perjalanan ke alamat:
_${order.customer.address}, Kec. ${order.customer.district}, ${order.customer.city}_

Terima kasih banyak sudah berbelanja di *${storeConfig.storeName}*! Semoga produknya cocok dan ditunggu pesanan berikutnya ya kak! ❤️`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
