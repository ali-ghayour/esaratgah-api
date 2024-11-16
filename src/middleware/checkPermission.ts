import getUserWithDetails from "../helpers/getUserWithDetails";

export const checkPermission = (permissionName: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.user_id; // Assuming user_id is available in `req.user`
      const user = await getUserWithDetails(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPermissions = new Set<string>();

      // Collect permissions directly assigned to the user
      user.permissions.forEach((perm) => {
        userPermissions.add(perm.name);
      });

      //   // Collect permissions from roles
      //   for (const role of user.role) {
      //     const populatedRole = await role.populate("permissions");
      //     populatedRole.permissions.forEach((perm: any) => {
      //       userPermissions.add(perm.name);
      //     });
      //   }

      if (!userPermissions.has(permissionName)) {
        return res.status(403).json({ error: "Permission denied" });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

export default checkPermission;
