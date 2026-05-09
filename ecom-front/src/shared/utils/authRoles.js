export const normalizeRole = (role) => String(role || "").trim().toUpperCase();

export const extractUserRoles = (authUser) => {
  if (!authUser || typeof authUser !== "object") return [];

  const directRoles = Array.isArray(authUser.roles) ? authUser.roles : [];
  const nestedRoles =
    authUser.user && Array.isArray(authUser.user.roles) ? authUser.user.roles : [];
  const roleCandidates = [
    ...directRoles,
    ...nestedRoles,
    authUser.role,
    authUser.user?.role,
  ];

  return roleCandidates
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .map((role) =>
      typeof role === "string"
        ? role
        : role?.name || role?.authority || role?.roleName || ""
    )
    .map(normalizeRole)
    .filter(Boolean);
};

export const hasRole = (authUser, roleName) =>
  extractUserRoles(authUser).includes(normalizeRole(roleName));

