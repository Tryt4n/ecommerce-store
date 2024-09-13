"use server";

import { notFound } from "next/navigation";
import db from "../db";
import type { User } from "@prisma/client";

export async function deleteUser(id: User["id"]) {
  try {
    const user = await db.user.delete({ where: { id } });

    if (user == null) return notFound();
  } catch (error) {
    console.error(`Can't delete user. Error: ${error}`);
  }
}
