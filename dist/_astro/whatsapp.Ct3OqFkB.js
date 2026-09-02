import{n as e}from"./currency.MLlRtgwp.js";import{t}from"./storeConfig.C-W9M-Kb.js";function n(n){let r=n.items.map((t,n)=>`${n+1}. *${t.name}*\n   Varian: ${t.color} - ${t.size} (${t.quantity}x)\n   Harga: ${e(t.price*t.quantity)}`).join(`

`),i=`Halo *${t.storeName}*, saya ingin konfirmasi pesanan saya:

*No. Pesanan:* ${n.id}
*Tanggal:* ${new Date(n.createdAt).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})} WIB

*Data Penerima:*
Nama: *${n.customer.fullName}*
No. WA: ${n.customer.whatsapp}
Alamat: ${n.customer.address}, Kec. ${n.customer.district}, ${n.customer.city}, ${n.customer.province} (${n.customer.postalCode})
${n.customer.notes?`Catatan: _${n.customer.notes}_\n`:``}
*Rincian Produk:*
${r}

*Rincian Pembayaran:*
Subtotal: ${e(n.subtotal)}
Diskon: -${e(n.discountAmount)}
Ongkir (${n.courier.serviceName}): ${e(n.shippingCost)}
*Total Tagihan: ${e(n.totalAmount)}*

Metode Bayar: *${n.paymentMethod.name}*
Status Pembayaran: *${n.paymentStatus===`PAID`?`✅ SUDAH DIBAYAR`:`⏳ MENUNGGU PEMBAYARAN`}*

Mohon segera diproses ya kak. Terima kasih! 🙏`;return encodeURIComponent(i)}function r(e,n,r){let i=`Halo Admin *${t.storeName}*, saya tertarik dengan produk *${e}*${n?` (Varian: ${n})`:``}.\n\nApakah stoknya masih tersedia kak? ${r?`\nLink: ${r}`:``}`;return`https://wa.me/${t.whatsappNumber}?text=${encodeURIComponent(i)}`}function i(e){let n=e.customer.whatsapp.replace(/\D/g,``).replace(/^0/,`62`),r=`Halo Kak *${e.customer.fullName}*! 👋

Kabar gembira! Pesanan Kakak dengan No. Order *${e.id}* dari *${t.storeName}* saat ini sudah *DIKIRIM* 🚚✨

*Ekspedisi:* ${e.courier.courierName} (${e.courier.serviceName})
*No. Resi Pengiriman:* *${e.trackingNumber||`-`}*

Paket sedang dalam perjalanan ke alamat:
_${e.customer.address}, Kec. ${e.customer.district}, ${e.customer.city}_

Terima kasih banyak sudah berbelanja di *${t.storeName}*! Semoga produknya cocok dan ditunggu pesanan berikutnya ya kak! ❤️`;return`https://wa.me/${n}?text=${encodeURIComponent(r)}`}export{r as n,i as r,n as t};