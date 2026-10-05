import Image from "next/image";
import Link from "next/link";

type StoryCardProps = { category: string; title: string; image: string; alt: string; href?: string };

export function StoryCard({ category, title, image, alt, href = "/artikel" }: StoryCardProps) {
  return (
    <article className="story-card">
      <div className="story-card__image"><Image src={image} alt={alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1050px) 42vw, 30vw" /></div>
      <div className="story-card__body"><p className="story-card__category">{category}</p><h3>{title}</h3><Link href={href} className="text-link">Baca cerita <span aria-hidden="true">↗</span></Link></div>
    </article>
  );
}
