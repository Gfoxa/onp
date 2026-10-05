"use server";

import { saveCmsAction, saveSettingsAction } from "@/server/cms/actions";

export async function saveProgram(formData: FormData) { await saveCmsAction("program", formData); }
export async function saveArticle(formData: FormData) { await saveCmsAction("artikel", formData); }
export async function saveGalleryImage(formData: FormData) { await saveCmsAction("galeri", formData); }
export async function saveTeamMember(formData: FormData) { await saveCmsAction("tim", formData); }
export async function saveConservationProject(formData: FormData) { await saveCmsAction("konservasi", formData); }
export async function saveSettings(formData: FormData) { await saveSettingsAction(formData); }
