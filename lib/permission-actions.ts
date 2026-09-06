"use server"

import { prisma } from "@/lib/prisma";

export async function getAllPermissionRecords() {
    return prisma.permission.findMany({
        where: {
          active: true,
        },
        select: {
            id: true,
            name: true,
            key: true,
            action: true,
            resource: true,
        },
        orderBy: {
            key: "asc",
        },
    });
}
