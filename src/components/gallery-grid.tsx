"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { galleryCategories, type GalleryCategory, type GalleryItem } from "@/lib/gallery";

export function GalleryGrid({ items, isDemo = true }: { items: GalleryItem[]; isDemo?: boolean }) {
  const [category, setCategory] = useState<GalleryCategory | string>("Semua");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleItems = category === "Semua" ? items : items.filter((item) => item.category === category);
  const categories = [...new Set([...galleryCategories, ...items.map((item) => item.category)])];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  return (
    <>
      <div className="gallery-filters" aria-label="Filter kategori galeri">
        {categories.map((item) => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      {isDemo && <p className="demo-note">Seluruh gambar di galeri ini adalah ilustrasi demo, bukan dokumentasi kegiatan nyata.</p>}
      <div className="gallery-grid" aria-live="polite">
        {visibleItems.map((item) => (
          <button className="gallery-item" type="button" key={item.id} onClick={() => setSelected(item)} aria-label={`Lihat gambar: ${item.title}`}>
            <span className="gallery-item__image"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 650px) 90vw, (max-width: 1000px) 44vw, 31vw" /></span>
            <span className="gallery-item__meta"><span>{item.category}</span><strong>{item.title}</strong></span>
          </button>
        ))}
        {!visibleItems.length ? <p className="empty-state">Belum ada gambar untuk kategori ini.</p> : null}
      </div>
      <dialog
        className="gallery-dialog"
        ref={dialogRef}
        aria-label={selected?.title ?? "Pratinjau gambar"}
        onCancel={(event) => { event.preventDefault(); setSelected(null); }}
        onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}
      >
        {selected ? (
          <div className="gallery-dialog__content">
            <button className="gallery-dialog__close" type="button" onClick={() => setSelected(null)} aria-label="Tutup pratinjau">Tutup <span aria-hidden="true">×</span></button>
            <div className="gallery-dialog__image"><Image src={selected.image} alt={selected.alt} fill sizes="90vw" priority /></div>
            <div className="gallery-dialog__caption"><span>{selected.category}</span><h2>{selected.title}</h2><p>{selected.caption}</p></div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
