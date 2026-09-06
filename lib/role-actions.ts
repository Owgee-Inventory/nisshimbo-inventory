"use server"

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/authorization";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const RoleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    active: z.boolean(),
    permissionIds: z.array(z.uuid()),
});

export type RoleState = {
    errors?: {
        name?: string[];
        description?: string[];
        active?: string[];
        permissionIds?: string[];
    };
    message?: string;
    values?: {
        name?: string;
        description?: string;
        active?: boolean;
        permissionIds?: string[];
    };
}

export async function listRoles() {
    // await requirePermission("roles:manage");

    const roles = await prisma.role.findMany({
        select: {
            id: true,
            name: true,
            active: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    rolePermissions: true,
                },
            },
        },
    });

    return roles;
}

export async function getRole(id: string) {
    // await requirePermission("roles:view")

    const role = await prisma.role.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            active: true,
            description: true,
            createdAt: true,
            updatedAt: true,

            rolePermissions: {
                select: {
                    id: true,
                    permission: {
                        select: {
                            id: true,
                            key: true,
                            name: true,
                            resource: true,
                            action: true,
                            active: true,
                        },
                    },
                },
            },
        },
    });

    return role;
}

export async function createRole(
    prevState: RoleState,
    formData: FormData,
): Promise<RoleState> {
    // await requirePermission("roles:create")

    const rawName = formData.get("name");
    const rawDescription = formData.get("description");
    const rawPermissionIds = formData.getAll("permissionIds");
    const uniquePermissionIds = Array.from(new Set(rawPermissionIds));

    const formValues = {
        name: typeof rawName === "string" ? rawName: "",
        description: typeof rawDescription === "string" ? rawDescription : "",
        active: formData.has("active"),
        permissionIds: rawPermissionIds.filter(
            (value): value is string => typeof value === "string",
        ),
    };

    const validatedFields = RoleSchema.safeParse({
        name: formValues.name,
        description: formValues.description,
        active: formValues.active,
        permissionIds: uniquePermissionIds,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
            values: formValues,
        };
    }

    const { name, description, active, permissionIds } = validatedFields.data;
    let result;

    try {
        result = await prisma.$transaction(async (tx) => {
            const validPermissionIds = permissionIds;

            const permissions = await tx.permission.findMany({
                where: {
                    id: {
                        in: validPermissionIds,
                    },
                    active: true,
                },
                select: {
                    id: true,
                },
            });

            if (permissions.length !== validPermissionIds.length) {
                return {
                    success: false as const,
                    message: "One or more permissions do not exist or are inactive"
                }
            }

            const role = await tx.role.create({
                data: {
                    name,
                    description,
                    active,
                },
            });

            if (permissions.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissions.map(entry => ({
                        roleId: role.id,
                        permissionId: entry.id,
                    }))
                })
            }

            return {
                success: true as const,
                roleId: role.id,
            };
        });
    } catch (error) {
        console.error("Failed to create role", error);

        return {
            message: "Unable to create role. Please try again.",
            values: formValues
        };
    };

    if (!result.success) {
        return {
            message: result.message,
            values: formValues,
        }
    }

    revalidatePath("/roles");
    redirect(`/roles/${result.roleId}`);
}
