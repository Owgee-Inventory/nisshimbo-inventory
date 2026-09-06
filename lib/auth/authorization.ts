import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

export async function hasPermission(
    userId: string,
    permissionKey: string,
) {
    const assignment = await prisma.userRole.findFirst({
        where: {
            userId,
            user: {
                is: {
                    active: true,
                }
            },
            role: {
                is: {
                    active: true,
                    rolePermissions: {
                        some: {
                            permission: {
                                is: {
                                    key: permissionKey,
                                    active: true,
                                }
                            }
                        }
                    }
                }
            }
        },
        select: {
            userId: true,
        }
    });

    return Boolean(assignment);
}

export async function requirePermission(permissionKey: string) {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect("/login");
    }

    if (!(await hasPermission(user.id, permissionKey))) {
        redirect("/dashboard?error=forbidden");
    }

    return user;
}
