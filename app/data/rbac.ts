export type PermissionRecord = {
    id: string;
    key: string;
    resource: string;
    action: string;
    name: string;
    active: boolean;
    updatedAt: string;
};

export type RoleRecord = {
    id: string;
    name: string;
    description: string;
    active: boolean;
    permissionIds: string[];
    updatedAt: string;
};

export const permissionRecords: PermissionRecord[] = [
    {
        id: "permission-inventory-view",
        key: "inventory:view",
        resource: "Inventory",
        action: "View",
        name: "View inventory",
        active: true,
        updatedAt: "Sep 4, 2026",
    },
    {
        id: "permission-inventory-manage",
        key: "inventory:manage",
        resource: "Inventory",
        action: "Manage",
        name: "Manage inventory",
        active: true,
        updatedAt: "Sep 4, 2026",
    },
    {
        id: "permission-users-invite",
        key: "users:invite",
        resource: "Users",
        action: "Invite",
        name: "Invite users",
        active: true,
        updatedAt: "Sep 5, 2026",
    },
    {
        id: "permission-roles-manage",
        key: "roles:manage",
        resource: "Roles",
        action: "Manage",
        name: "Manage roles",
        active: true,
        updatedAt: "Sep 5, 2026",
    },
    {
        id: "permission-permissions-manage",
        key: "permissions:manage",
        resource: "Permissions",
        action: "Manage",
        name: "Manage permissions",
        active: true,
        updatedAt: "Sep 5, 2026",
    },
];

export const roleRecords: RoleRecord[] = [
    {
        id: "role-finance",
        name: "Finance",
        description: "Can access finance pages and inventory reports.",
        active: true,
        permissionIds: ["permission-inventory-view"],
        updatedAt: "Sep 4, 2026",
    },
    {
        id: "role-it-staff",
        name: "IT Staff",
        description: "Can manage inventory and maintain system access.",
        active: true,
        permissionIds: [
            "permission-inventory-view",
            "permission-inventory-manage",
        ],
        updatedAt: "Sep 4, 2026",
    },
    {
        id: "role-manager",
        name: "Manager",
        description: "Can access all pages and manage the workspace.",
        active: true,
        permissionIds: permissionRecords.map((permission) => permission.id),
        updatedAt: "Sep 5, 2026",
    },
];

export function getRole(roleId: string) {
    return roleRecords.find((role) => role.id === roleId);
}

export function getPermission(permissionId: string) {
    return permissionRecords.find((permission) => permission.id === permissionId);
}

export function getRolePermissions(role: RoleRecord) {
    return role.permissionIds
        .map((permissionId) => getPermission(permissionId))
        .filter((permission): permission is PermissionRecord => Boolean(permission));
}
