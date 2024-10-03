"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

export async function checkPermissions(permissionsToCheck: string | string[]) {
  const { getPermissions } = getKindeServerSession();
  const permissions = await getPermissions();

  if (typeof permissionsToCheck === "string") {
    if (!permissions?.permissions.includes(permissionsToCheck)) {
      return notFound();
    } else if (Array.isArray(permissionsToCheck)) {
      if (
        !permissionsToCheck.every((permission) =>
          permissions?.permissions.includes(permission)
        )
      ) {
        return notFound();
      }
    }
  }
}
