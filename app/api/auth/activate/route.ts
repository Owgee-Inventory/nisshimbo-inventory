import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json(
            { error: "Authentication required." },
            { status: 401 },
        );
    }

    const assignedRole = await prisma.userRole.findFirst({
        where: {
            userId: user.id,
            role: {
                is: {
                    active: true,
                },
            },
        },
    });

    if (!assignedRole) {
        return NextResponse.json(
            { error: "No active role is assigned." },
            { status: 403 },
        );
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            active: true,
        },
    });

    return NextResponse.json({ success: true });
}

