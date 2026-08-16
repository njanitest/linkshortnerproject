"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createLinkForCurrentUser,
  deleteLinkForCurrentUser,
  getLinkByShortCode,
  updateLinkForCurrentUser,
} from "@/data/links";

const shortCodeSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9-_]+$/, "Only letters, numbers, - and _ are allowed")
  .min(3, "Must be at least 3 characters")
  .max(30, "Must be at most 30 characters");

const createLinkSchema = z.object({
  url: z.string().trim().min(1, "URL is required").url("Enter a valid URL"),
  customCode: shortCodeSchema.optional().or(z.literal("")),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to create a link." };
  }

  const parsed = createLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { url, customCode } = parsed.data;
  const shortCode = customCode || nanoid(7);

  try {
    const existing = await getLinkByShortCode(shortCode);

    if (existing) {
      return { error: "That short code is already taken." };
    }

    await createLinkForCurrentUser({ userId, url, shortCode });
  } catch {
    return { error: "Failed to create link. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true as const };
}

const updateLinkSchema = z.object({
  id: z.number(),
  url: z.string().trim().min(1, "URL is required").url("Enter a valid URL"),
  customCode: shortCodeSchema,
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(input: UpdateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to edit a link." };
  }

  const parsed = updateLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { id, url, customCode } = parsed.data;

  try {
    const existing = await getLinkByShortCode(customCode);

    if (existing && existing.id !== id) {
      return { error: "That short code is already taken." };
    }

    const updated = await updateLinkForCurrentUser({
      id,
      userId,
      url,
      shortCode: customCode,
    });

    if (!updated) {
      return { error: "Link not found." };
    }
  } catch {
    return { error: "Failed to update link. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true as const };
}

const deleteLinkSchema = z.object({
  id: z.number(),
});

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to delete a link." };
  }

  const parsed = deleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Invalid input." };
  }

  try {
    const deleted = await deleteLinkForCurrentUser({
      id: parsed.data.id,
      userId,
    });

    if (!deleted) {
      return { error: "Link not found." };
    }
  } catch {
    return { error: "Failed to delete link. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true as const };
}
