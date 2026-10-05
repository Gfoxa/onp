import Image from "next/image";
import { ActivityCard } from "@/components/activity-card";
import { ProgramCard } from "@/components/program-card";
import { StoryCard } from "@/components/story-card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { activities, organization, principles } from "@/lib/content";
import { getPublicArticles, getPublicPrograms, getPublicSettings } from "@/server/cms/public-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const [{ items: featuredPrograms, isDemo: programsDemo }, { items: featuredArticles, isDemo: articlesDemo }, settings] = await Promise.all([
    getPublicPrograms(), getPublicArticles(), getPublicSettings(),
  ]);
  const tones = ["moss", "clay", "fern", "sand", "stone"];
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, "Halo, saya ingin berdiskusi tentang program outdoor.");
  return (
    <main id="konten">
      <section className="hero" aria-labelledby="hero-title">
        <Image
          className="hero__image"
          src="/images/hero-rimba.png"
          alt="Rombongan kecil berjalan di jalur hutan berkabut di antara pegunungan"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero__scrim" />
        <div className="container hero__content">
          <p className="eyebrow eyebrow--light">{settings.organizationName || "Ruang Rimba"} · ruang untuk tumbuh di alam</p>
          <h1 id="hero-title">Bertualang,<br />belajar, dan<br /><em>menjaga alam.</em></h1>
          <p className="hero__description">Pengalaman luar ruang yang membuka ruang untuk kebersamaan, pembelajaran, dan kepedulian.</p>
          <div className="hero__actions">
            <ButtonLink href="#program" variant="light">Jelajahi program <span aria-hidden="true">↗</span></ButtonLink>
            <ButtonLink href="#hubungi" variant="outline">Hubungi kami</ButtonLink>
          </div>
          <p className="hero__note">Visual ilustrasi demo · ganti dengan foto kegiatan organisasi</p>
        </div>
        <div className="hero__index" aria-hidden="true"><span>01</span><span className="hero__index-line" /><span>Alam sebagai ruang belajar</span></div>
      </section>

      <section className="intro section-pad" id="tentang">
        <div className="container intro__grid">
          <div className="intro__marker"><span>01</span><span className="marker-line" /><span>Tentang kami</span></div>
          <div className="intro__copy">
            <p className="eyebrow">Kenalan dengan {organization.name}</p>
            <h2>Pengalaman di alam bisa mengubah cara kita <em>melihat sekitar.</em></h2>
            <div className="intro__bottom">
              <p>{settings.description || organization.description}</p>
              <ButtonLink href="#nilai" variant="outline">Cerita kami <span aria-hidden="true">↗</span></ButtonLink>
            </div>
          </div>
          <div className="intro__image-wrap">
            <Image src="/images/intro-landscape.svg" alt="Placeholder ilustrasi perbukitan hijau dan jalur setapak" fill sizes="(max-width: 800px) 90vw, 36vw" />
            <span className="image-caption">Ilustrasi demo, bukan dokumentasi kegiatan</span>
          </div>
        </div>
      </section>

      <section className="program-section section-pad" id="program">
        <div className="container">
          <div className="section-topline"><span>02 / Program</span><span>Dirancang untuk dijalani bersama</span></div>
          <SectionHeading title="Temukan cara baru untuk terhubung." description="Mulai dari membangun kekompakan hingga mengenal lingkungan lebih dekat. Program dapat disesuaikan bersama organisasi." />
          <div className="program-grid">
            {featuredPrograms.slice(0, 5).map((program, index) => <ProgramCard key={program.slug} number={String(index + 1).padStart(2, "0")} title={program.title} description={program.excerpt} image={program.image} alt={program.imageAlt} href={`/program/${program.slug}`} tone={tones[index % tones.length]} />)}
          </div>
          <div className="program-section__bottom"><p>{programsDemo ? "Program berikut merupakan konten demo." : "Program terbit dari CMS organisasi."}</p><ButtonLink href="/program" variant="outline">Jelajahi semua program <span aria-hidden="true">↗</span></ButtonLink></div>
        </div>
      </section>

      <section className="manifesto" id="konservasi">
        <div className="manifesto__visual">
          <Image src="/images/conservation.svg" alt="Placeholder ilustrasi hutan tropis dan sungai" fill sizes="100vw" />
          <div className="manifesto__shade" />
        </div>
        <div className="container manifesto__content">
          <p className="eyebrow eyebrow--light">Petualangan dengan kepedulian</p>
          <h2>Lebih dari<br />sekadar <em>perjalanan.</em></h2>
          <p>Alam bukan hanya latar untuk beraktivitas. Ia adalah ruang hidup yang perlu kita kenali, hormati, dan jaga bersama.</p>
          <ButtonLink href="#nilai" variant="light">Kenali pendekatan kami <span aria-hidden="true">↗</span></ButtonLink>
        </div>
        <span className="manifesto__caption">Ilustrasi demo · visual konservasi aktual perlu ditambahkan</span>
      </section>

      <section className="values section-pad" id="nilai">
        <div className="container values__grid">
          <div className="values__intro">
            <div className="section-topline"><span>03 / Cara kami bekerja</span></div>
            <SectionHeading title="Bertumbuh dengan rasa hormat." description="Prinsip untuk memandu setiap rancangan kegiatan. Ganti dengan nilai dan prosedur organisasi yang telah disepakati." />
          </div>
          <div className="values__list">
            {principles.map((principle, index) => (
              <article className="value-item" key={principle.title}>
                <span className="value-item__number">0{index + 1}</span>
                <div><h3>{principle.title}</h3><p>{principle.text}</p></div>
                <span className="value-item__arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="activities section-pad">
        <div className="container">
          <div className="section-topline"><span>04 / Di lapangan</span><span>Contoh aktivitas, bukan dokumentasi nyata</span></div>
          <SectionHeading title="Ruang untuk pengalaman yang berkesan." description="Setiap kelompok punya cerita yang berbeda. Berikut inspirasi kegiatan yang dapat dikembangkan bersama." />
          <div className="activity-grid">{activities.map((activity, index) => <ActivityCard key={activity.title} {...activity} index={index} />)}</div>
        </div>
      </section>

      <section className="stories section-pad" id="cerita">
        <div className="container">
          <div className="section-topline"><span>05 / Jurnal alam</span><span>Pengetahuan tumbuh saat dibagikan</span></div>
          <div className="stories__heading"><SectionHeading title="Catatan kecil dari alam." description="Ruang untuk berbagi pengetahuan, panduan, dan cerita kegiatan." /><ButtonLink href="/artikel" variant="outline">Lihat semua cerita <span aria-hidden="true">↗</span></ButtonLink></div>
          <div className="story-grid">{featuredArticles.slice(0, 3).map((article) => <StoryCard key={article.slug} category={article.category} title={article.title} image={article.coverImage} alt={article.coverAlt} href={`/artikel/${article.slug}`} />)}</div>
          {articlesDemo && <p className="demo-note">Artikel yang ditampilkan adalah konten demo.</p>}
        </div>
      </section>

      <section className="contact-band" id="hubungi">
        <div className="container contact-band__inner">
          <div><p className="eyebrow eyebrow--light">Mari mulai percakapan</p><h2>Ada rencana kegiatan<br />di alam?</h2><p>Ceritakan kebutuhan program dan rencana kegiatanmu.</p></div>
          <div className="contact-band__actions">
            {whatsappUrl && <a className="button button--light contact-band__button" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Hubungi organisasi melalui WhatsApp, membuka tab baru">Mulai di WhatsApp <span aria-hidden="true">↗</span></a>}
            <ButtonLink href="/kontak" variant="light" className="contact-band__button">Kirim permintaan program <span aria-hidden="true">↗</span></ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
