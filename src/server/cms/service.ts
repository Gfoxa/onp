import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { nextPublishedAt } from "./publication";
import { resolveSlug, slugify } from "@/lib/slug";
import {
  articleSchema, conservationProjectSchema, galleryImageSchema,
  programSchema, siteSettingsSchema, teamMemberSchema,
} from "./validation";

export type CmsEntity = "program" | "artikel" | "galeri" | "tim" | "konservasi";
export class CmsValidationError extends Error {}
const entityPaths: Record<CmsEntity, string> = {
  program: "/admin/program", artikel: "/admin/artikel", galeri: "/admin/galeri",
  tim: "/admin/tim", konservasi: "/admin/konservasi",
};
export function adminPath(entity: CmsEntity) { return entityPaths[entity]; }

function formValues(formData: FormData) {
  const values = Object.fromEntries([...formData.entries()].filter(([key]) => key !== "id" && key !== "_intent"));
  if (typeof values.title === "string" && typeof values.slug === "string") values.slug = resolveSlug(values.title, values.slug);
  return values;
}

async function categoryId(
  tx: Prisma.TransactionClient,
  entity: "program" | "artikel" | "galeri",
  name: string,
) {
  const slug = slugify(name);
  if (!slug) throw new Error("Nama kategori harus berisi huruf atau angka.");
  if (entity === "program") return (await tx.programCategory.upsert({ where: { slug }, update: { name }, create: { name, slug } })).id;
  if (entity === "artikel") return (await tx.articleCategory.upsert({ where: { slug }, update: { name }, create: { name, slug } })).id;
  return (await tx.galleryCategory.upsert({ where: { slug }, update: { name }, create: { name, slug } })).id;
}

export async function saveCmsEntity(entity: CmsEntity, actorId: string, formData: FormData) {
  const rawId = formData.get("id");
  const id = typeof rawId === "string" && rawId ? rawId : undefined;
  const intent = formData.get("_intent");
  const data = formValues(formData);

  if (intent === "archive") {
    if (!id) throw new Error("ID konten tidak tersedia.");
    return prisma.$transaction(async (tx) => {
      if (entity === "program") await tx.program.update({ where: { id }, data: { status: "ARCHIVED" } });
      else if (entity === "artikel") await tx.article.update({ where: { id }, data: { status: "ARCHIVED" } });
      else if (entity === "galeri") await tx.galleryImage.update({ where: { id }, data: { status: "ARCHIVED" } });
      else if (entity === "tim") await tx.teamMember.update({ where: { id }, data: { status: "ARCHIVED" } });
      else await tx.conservationProject.update({ where: { id }, data: { status: "ARCHIVED" } });
      await tx.auditLog.create({ data: { actorId, operation: "ARCHIVE", entity, entityId: id } });
      return id;
    });
  }

  const parsed = entity === "program" ? programSchema.safeParse(data)
    : entity === "artikel" ? articleSchema.safeParse(data)
    : entity === "galeri" ? galleryImageSchema.safeParse(data)
    : entity === "tim" ? teamMemberSchema.safeParse(data)
    : conservationProjectSchema.safeParse(data);
  if (!parsed.success) throw new CmsValidationError(parsed.error.issues.map((issue) => issue.message).join(" "));

  return prisma.$transaction(async (tx) => {
    let savedId = id ?? "";
    if (entity === "program") {
      const value = parsed.data as typeof programSchema._output;
      const category = await categoryId(tx, entity, value.category);
      const { category: _category, ...fields } = value;
      void _category;
      const current = id ? await tx.program.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
      const update = { ...fields, categoryId: category, publishedAt: nextPublishedAt(value.status, current?.publishedAt ?? null) };
      const saved = id ? await tx.program.update({ where: { id }, data: update }) : await tx.program.create({ data: update });
      savedId = saved.id;
    } else if (entity === "artikel") {
      const value = parsed.data as typeof articleSchema._output;
      const category = await categoryId(tx, entity, value.category);
      const { category: _category, ...fields } = value;
      void _category;
      const current = id ? await tx.article.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
      const update = { ...fields, categoryId: category, publishedAt: nextPublishedAt(value.status, current?.publishedAt ?? null) };
      const saved = id ? await tx.article.update({ where: { id }, data: update }) : await tx.article.create({ data: update });
      savedId = saved.id;
    } else if (entity === "galeri") {
      const value = parsed.data as typeof galleryImageSchema._output;
      const category = await categoryId(tx, entity, value.category);
      const { category: _category, ...fields } = value;
      void _category;
      const current = id ? await tx.galleryImage.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
      const update = { ...fields, categoryId: category, publishedAt: nextPublishedAt(value.status, current?.publishedAt ?? null) };
      const saved = id ? await tx.galleryImage.update({ where: { id }, data: update }) : await tx.galleryImage.create({ data: update });
      savedId = saved.id;
    } else if (entity === "tim") {
      const value = parsed.data as typeof teamMemberSchema._output;
      const saved = id ? await tx.teamMember.update({ where: { id }, data: value }) : await tx.teamMember.create({ data: value });
      savedId = saved.id;
    } else {
      const value = parsed.data as typeof conservationProjectSchema._output;
      const saved = id ? await tx.conservationProject.update({ where: { id }, data: { ...value, startedAt: value.startedAt ? new Date(value.startedAt) : null } })
        : await tx.conservationProject.create({ data: { ...value, startedAt: value.startedAt ? new Date(value.startedAt) : null } });
      savedId = saved.id;
    }
    await tx.auditLog.create({ data: { actorId, operation: id ? "UPDATE" : "CREATE", entity, entityId: savedId } });
    return savedId;
  });
}

export async function saveSiteSettings(actorId: string, formData: FormData) {
  const parsed = siteSettingsSchema.safeParse(formValues(formData));
  if (!parsed.success) throw new CmsValidationError(parsed.error.issues.map((issue) => issue.message).join(" "));
  return prisma.$transaction(async (tx) => {
    for (const [key, value] of Object.entries(parsed.data)) {
      await tx.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
    await tx.auditLog.create({ data: { actorId, operation: "UPDATE", entity: "settings", entityId: "site" } });
  });
}

export async function listCms(entity: CmsEntity) {
  if (entity === "program") return prisma.program.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  if (entity === "artikel") return prisma.article.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  if (entity === "galeri") return prisma.galleryImage.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  if (entity === "tim") return prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return prisma.conservationProject.findMany({ orderBy: { updatedAt: "desc" } });
}
