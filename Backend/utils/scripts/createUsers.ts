import { UsersService } from "../../src/services/users.service";
import { UsersProfilesService } from "../../src/services/usersProfiles.service";
import { UsersRolesService } from "../../src/services/usersRoles.service";
import { RoleService } from "../../src/services/role.service";

async function createInitialUsers() {
  console.log("🚀 Initial user setup starting...");

  // 1. Create roles if they don't exist
  const roles = [
    { name: "admin", description: "Administrator" },
    { name: "user", description: "Standard user" }
  ];

  for (const role of roles) {
    await RoleService.create(role.name, role.description);
  }

  // 2. Create admin user
  const admin = await UsersService.create("admin@alexandria.com", "securePassword");
  const adminRole = await RoleService.findByName("admin");
  await UsersRolesService.create(admin.id, adminRole.id);

  for (let i = 1; i <= 4; i++) {
    await UsersProfilesService.create(admin.id, `Admin Profile ${i}`);
  }

  const user = await UsersService.create("user@alexandria.com", "userPassword");
  const userRole = await RoleService.findByName("user");
  await UsersRolesService.create(user.id, userRole.id);

  // Create 2 profiles for user
  for (let i = 1; i <= 2; i++) {
    await UsersProfilesService.create(user.id, `User Profile ${i}`);
  }

  console.log("✅ Users, roles and profiles created successfully.");
}

createInitialUsers().catch((err) => {
  console.error("❌ Error during user setup:", err);
});
