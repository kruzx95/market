import React from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import { CheckCircle2, Star, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface StoryData {
  badge: string;
  title: string;
  description: string;
  image1: string;
  image2: string;
  pillars: { title: string; desc: string }[];
  reviews: { name: string; city: string; text: string; rating: number }[];
}

const STORY_PRESETS: Record<string, StoryData> = {
  fashion: {
    badge: 'Kualitas & Keaslian Material',
    title: 'Mengapa Memilih Material Alami KALA Studio?',
    description: 'Pernahkah Anda membeli pakaian online yang terasa panas dan mudah melar? Kami menggunakan serat alami French Linen dan katun combed 24s pre-washed yang sangat adem.',
    image1: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    pillars: [
      {
        title: 'Pre-washed 100% Natural Linen',
        desc: 'Serat kain lembut sejak pemakaian pertama dan tidak menyusut saat dicuci di rumah.',
      },
      {
        title: 'Kerah Rib Heavyweight Anti-Melar',
        desc: 'Rajutan ganda 2.5cm dengan jahitan rantai rapi pada pundak dan leher.',
      },
      {
        title: 'Jahitan Standar Ekspor Garmen',
        desc: 'Kerapatan jahitan 12 jarum per inci untuk ketahanan hingga bertahun-tahun.',
      },
    ],
    reviews: [
      {
        name: 'Aditya Nugroho',
        city: 'Jakarta Selatan',
        text: 'Kemeja linennya juara banget! Beneran adem dipakai siang hari di Jakarta. Alur checkout pakai QRIS langsung verifikasi tanpa ribet.',
        rating: 5,
      },
      {
        name: 'Bagus Wicaksono',
        city: 'Bandung, Jawa Barat',
        text: 'Jaket Harrington-nya tebal tapi furing tartannya halus. Sempat tukar size prosesnya gampang banget lewat CS WhatsApp.',
        rating: 5,
      },
      {
        name: 'Clara Amanda',
        city: 'Surabaya, Jawa Timur',
        text: 'Blouse rayonnya flowy dan kelihatan mewah pas dipakai kerja. Pengiriman SiCepat sehari sampai.',
        rating: 5,
      },
    ],
  },

  skincare: {
    badge: 'Formulasi Bersertifikat BPOM & Halal',
    title: 'Kandungan Aktif Teruji Klinis untuk Kulit Sehat',
    description: 'Bebas dari alkohol berbahaya, paraben, dan pewangi buatan. Diformulasikan bersama dermatologis untuk merawat skin barrier dan mencerahkan secara bertahap.',
    image1: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    pillars: [
      {
        title: '10% Niacinamide + 3X Hyaluronic Acid',
        desc: 'Menyamarkan noda hitam bekas jerawat sekaligus mengunci hidrasi hingga 48 jam.',
      },
      {
        title: '5X Ceramide Barrier Repair',
        desc: 'Memperkuat lapisan pelindung kulit dan meredakan kemerahan akibat iritasi.',
      },
      {
        title: 'Dermatologically Tested for Sensitive Skin',
        desc: 'Telah melalui uji klinis aman untuk kulit sensitif dan ibu hamil/menyusui.',
      },
    ],
    reviews: [
      {
        name: 'Nadia Safira',
        city: 'Jakarta Barat',
        text: 'Baru 2 minggu pakai Triple Hyaluronic Serum, tekstur kulit jadi kenyal dan bekas jerawat pudar! Packaging-nya juga estetik banget.',
        rating: 5,
      },
      {
        name: 'drg. Riana Putri',
        city: 'Semarang, Jawa Tengah',
        text: 'Moisturizer ceramide-nya ringan banget di kulit berminyak, langsung meresap dan nggak bikin kilap seharian. Rekomen banget!',
        rating: 5,
      },
      {
        name: 'Siska Febriana',
        city: 'Yogyakarta',
        text: 'Sunscreen-nya beneran no white cast dan nggak pedih di mata pas keringetan. Seneng bisa beli langsung di website resminya.',
        rating: 5,
      },
    ],
  },

  streetwear: {
    badge: 'Heavyweight & Exclusive Drops',
    title: 'Material Premium Standar Streetwear Global',
    description: 'Setiap artikel diproduksi dalam kuantitas terbatas (limited drops) menggunakan material katun fleece 330 GSM yang tebal dan jatuh sempurna di badan.',
    image1: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
    pillars: [
      {
        title: 'Heavyweight Fleece 330 GSM (Pre-Shrunk)',
        desc: 'Tudung kepala ganda (double hood) tegak kokoh dan tidak lepek saat dipakai.',
      },
      {
        title: 'High-Density Plastisol Screen Print',
        desc: 'Grafis sablon bertekstur tajam, anti-retak, dan tahan cuci mesin berulang kali.',
      },
      {
        title: 'Ergonomic Boxy Cut Fit',
        desc: 'Potongan siluet modern yang pas di bahu dan memberikan kesan streetwear yang tegas.',
      },
    ],
    reviews: [
      {
        name: 'Reza Fahlevi',
        city: 'Bandung, Jawa Barat',
        text: 'Hoodie Cyber Division-nya gokil berat bahannya! Hood-nya tegak nggak letoy. Worth every penny dibanding brand luar.',
        rating: 5,
      },
      {
        name: 'Dimas Anggara',
        city: 'Tangerang Selatan',
        text: 'Cargo pants-nya banyak saku modular dan bahannya ripstop tebal. Pengiriman express cepat banget.',
        rating: 5,
      },
      {
        name: 'Kevin Pratama',
        city: 'Surabaya, Jawa Timur',
        text: 'Suka sama sistem website-nya yang bersih dan cepat, checkout gampang via HP langsung scan QRIS.',
        rating: 5,
      },
    ],
  },

  coffee: {
    badge: 'Single Origin Grade 1 Specialty',
    title: 'Dari Petani Lereng Nusantara ke Cangkir Anda',
    description: 'Kami bekerja sama langsung dengan kelompok tani di Gayo, Toraja, dan Ijen. Biji kopi dipetik merah sempurna (red cherry) dan di-roasting fresh tiap minggu.',
    image1: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    pillars: [
      {
        title: 'Roast Date Terbuka & Fresh Weekly',
        desc: 'Selalu dikirim dalam kondisi resting ideal (7-14 hari pasca sangrai) untuk rasa maksimal.',
      },
      {
        title: 'Profil Sangrai Medium Khusus Filter & Espresso',
        desc: 'Menonjolkan keasaman buah alami yang manis tanpa rasa gosong/pahit berlebih.',
      },
      {
        title: 'Kemasan Zipper Valve Kedap Udara',
        desc: 'Mengunci aroma aromatik kopi agar tetap segar hingga cangkir terakhir.',
      },
    ],
    reviews: [
      {
        name: 'Rian Hidayat',
        city: 'Yogyakarta',
        text: 'Beans Gayo Natural-nya wangi banget! Notes peach dan melatinya keluar jelas pas diseduh V60. Tiap bulan pasti repeat order.',
        rating: 5,
      },
      {
        name: 'Dewi Lestari',
        city: 'Jakarta Pusat',
        text: 'Drip bag coffee-nya penyelamat banget di kantor pas lembur. Nggak perlu repot giling biji kopi, rasanya tetap fresh.',
        rating: 5,
      },
      {
        name: 'Fauzan Akbar',
        city: 'Malang, Jawa Timur',
        text: 'Packaging rapi banget, dapet kartu notes seduh dan stiker juga. Seneng belanja di website official NUSA Roastery.',
        rating: 5,
      },
    ],
  },
};

export default function DynamicStoryAndTestimonials() {
  const activeThemeId = useStore($activeThemeId);
  const current = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;
  const story = STORY_PRESETS[activeThemeId] || STORY_PRESETS.fashion;

  return (
    <>
      {/* 4. STORY & CRAFTSMANSHIP SECTION (CLEAN BRIGHT WHITE) */}
      <section
        id="keunggulan"
        className="py-16 md:py-20 bg-white border-y border-slate-200/80 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Images Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card border border-slate-100 bg-slate-50">
                <img
                  src={story.image1}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card border border-slate-100 bg-slate-50 mt-8">
                <img
                  src={story.image2}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Story Content */}
            <div className="lg:col-span-6 space-y-6">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-xs inline-block"
                style={{
                  backgroundColor: current.styles.badgeBg,
                  color: current.styles.badgeText,
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              >
                {story.badge}
              </span>

              <h2
                className="font-serif text-2xl sm:text-4xl font-bold leading-tight"
                style={{ color: current.styles.textPrimary }}
              >
                {story.title}
              </h2>

              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: current.styles.textSecondary }}
              >
                {story.description}
              </p>

              {/* Pillars */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                {story.pillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className="p-1.5 rounded-lg shrink-0 mt-0.5 shadow-xs"
                      style={{
                        backgroundColor: current.styles.accentLight,
                        color: current.styles.primaryColor,
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold">{p.title}</strong>
                      <span className="text-slate-500 text-xs">{p.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION (BRIGHT LIGHT SOFT BG) */}
      <section
        className="py-16 sm:py-20 transition-colors duration-300"
        style={{ backgroundColor: current.styles.bgColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Ulasan Pelanggan Nyata
            </span>
            <h2
              className="font-serif text-2xl sm:text-3xl font-bold"
              style={{ color: current.styles.textPrimary }}
            >
              Apa Kata Pembeli Tentang {current.storeConfig.storeName}?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {story.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card transition-shadow space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{rev.name}</p>
                    <p className="text-[11px] text-slate-400">{rev.city}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded shadow-xs"
                    style={{
                      backgroundColor: current.styles.accentLight,
                      color: current.styles.primaryColor,
                    }}
                  >
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
