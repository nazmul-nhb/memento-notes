/** User Roles */
export const USER_ROLES = ['admin', 'user'] as const;

/**Admin Roles */
export const ADMIN_ROLES = USER_ROLES.filter((role) => role !== 'user');

/** Collection Names */
export const COLLECTIONS = ['N/A', 'User'] as const;
