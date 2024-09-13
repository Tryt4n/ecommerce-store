"use server";

import { notFound } from "next/navigation";
import db from "../init";
import type { Order } from "@prisma/client";

export async function deleteOrder(id: Order["id"]) {
  try {
    const order = await db.order.delete({ where: { id } });

    if (order == null) return notFound();
  } catch (error) {
    console.error(`Can't delete order. Error: ${error}`);
  }
}
