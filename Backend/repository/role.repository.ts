import { db } from "../config/database";
import { roleList } from "../schemas/user";
import { eq } from "drizzle-orm";

export class RoleRepository {
    static async createRole(roleData: any) {
        return db.insert(roleList).values(roleData).returning();
    }

    static async getAllRoles() {
        return db.select().from(roleList);
    }

    static async getRoleById(id: number) {
        return db.select().from(roleList).where(eq(roleList.id, id)).then(res => res[0]);
    }

    static async updateRole(id: number, roleData: any) {
        return db.update(roleList).set(roleData).where(eq(roleList.id, id)).returning();
    }

    static async deleteRole(id: number) {
        return db.delete(roleList).where(eq(roleList.id, id));
    }
}
