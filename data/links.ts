import "server-only";
import { auth } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

export type LinkRecord = typeof links.$inferSelect;

export async function getLinksForCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link ?? null;
}

export async function createLinkForCurrentUser(values: {
  userId: string;
  url: string;
  shortCode: string;
}) {
  const [link] = await db.insert(links).values(values).returning();

  return link;
}

export async function updateLinkForCurrentUser(values: {
  id: number;
  userId: string;
  url: string;
  shortCode: string;
}) {
  const [link] = await db
    .update(links)
    .set({
      url: values.url,
      shortCode: values.shortCode,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, values.id), eq(links.userId, values.userId)))
    .returning();

  return link ?? null;
}

export async function deleteLinkForCurrentUser(values: {
  id: number;
  userId: string;
}) {
  const [link] = await db
    .delete(links)
    .where(and(eq(links.id, values.id), eq(links.userId, values.userId)))
    .returning();

  return link ?? null;
}
