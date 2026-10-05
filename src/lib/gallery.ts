export const galleryCategories = ["Semua", "Outbound", "Adventure", "Konservasi", "Edukasi", "Komunitas"] as const;

export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  caption: string;
};

export const galleryItems: GalleryItem[] = [
  { id: "outbound-01", title: "Tantangan kelompok", category: "Outbound", image: "/images/program-outbound.svg", alt: "Ilustrasi demo kelompok dalam kegiatan outbound", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "team-01", title: "Belajar berkolaborasi", category: "Outbound", image: "/images/program-team.svg", alt: "Ilustrasi demo kerja sama kelompok", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "adventure-01", title: "Menyusuri jalur alam", category: "Adventure", image: "/images/program-adventure.svg", alt: "Ilustrasi demo jalur di perbukitan", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "camp-01", title: "Ruang untuk berkemah", category: "Adventure", image: "/images/activity-camp.svg", alt: "Ilustrasi demo tenda di ruang terbuka", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "river-01", title: "Mengenal aliran sungai", category: "Konservasi", image: "/images/activity-river.svg", alt: "Ilustrasi demo sungai di lembah", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "tree-01", title: "Merawat tunas", category: "Konservasi", image: "/images/program-conservation.svg", alt: "Ilustrasi demo tunas tanaman yang dirawat", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "learning-01", title: "Mengamati lingkungan", category: "Edukasi", image: "/images/program-learning.svg", alt: "Ilustrasi demo pengamatan lingkungan", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "learning-02", title: "Belajar dari sekitar", category: "Edukasi", image: "/images/story-learning.svg", alt: "Ilustrasi demo belajar dari alam", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
  { id: "community-01", title: "Beraktivitas bersama", category: "Komunitas", image: "/images/activity-forest.svg", alt: "Ilustrasi demo kegiatan bersama di hutan", caption: "Ilustrasi demo, bukan dokumentasi kegiatan." },
];
