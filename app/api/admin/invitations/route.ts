import { NextResponse } from "next/server";

import {
    getAuthenticatedUser,
    hasPermission
} from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: "Authentication required." },
            { status: 401 },
        );
    }

    const canInvite = await hasPermission(
        currentUser.id,
        "users:invite",
    );

    if (!canInvite) {
        return NextResponse.json(
            { error: "You do not have permission to invite users." },
            { status: 403 },
        )
    }

    const body = await request.json();

    const email = String(body.email ?? "")
        .trim()
        .toLowerCase()

    const roleIds: string[] = Array.isArray(body.roleIds)
        ? Array.from(
              new Set(
                  (body.roleIds as unknown[]).filter(
                      (roleId: unknown): roleId is string =>
                          typeof roleId === "string",
                  ),
              ),
          )
        : [];

    if (!emailPattern.test(email)) {
        return NextResponse.json(
            { error: "Enter a valid email address." },
            { status: 400 },
        )
    }

    if (roleIds.length === 0) {
        return NextResponse.json(
            { error: "select at least one role." },
            { status: 400 },
        )
    };

    const activeRoles = await prisma.role.findMany({
        where: {
            id: {
                in: roleIds,
            },
            active: true,
        },
        select: {
            id: true,
        },
    });

    if (activeRoles.length !== roleIds.length) {
        return NextResponse.json(
            { error: "One or more roles are invalid or inactive." },
            { status: 400 },
        );
    }

    const adminSupabase = createAdminClient();
    const origin = new URL(request.url).origin;

    const { data, error } =
        await adminSupabase.auth.admin.inviteUserByEmail(email, {
            redirectTo: `${origin}/auth/confirm`
        });

    if (error || !data.user) {
        return NextResponse.json(
            { error: "Unable to send invitation. The user may already exists." },
            { status: 500 },
        );
    }

    try {
        await prisma.$transaction(async (transaction) => {
            await transaction.user.upsert({
                where: {
                    id: data.user.id,
                },
                update: {},
                create: {
                    id: data.user.id,
                    active: false,
                },
            });

            await transaction.userRole.createMany({
                data: roleIds.map((roleId) => ({
                    userId: data.user.id,
                    roleId,
                })),
                skipDuplicates: true,
            });
        });
    } catch {
       return NextResponse.json(
           { error: "Invitation sent, but roles could not be assigned." },
           { status: 500 },
       )
    }

    return NextResponse.json(
        {
            success: true,
            userId: data.user.id,
        },
        { status: 201 },
    )
}
