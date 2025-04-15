import { db } from "../../config/database";
import { roleList } from "../schemas/user";
import { eq } from "drizzle-orm";

export class RoleRepository {
    static async createRole(roleData: any) {
        return db.insert(roleList).values(roleData).returning();
    }

    static async getAllRoles() {
        return db.select().from(roleList);
    }

    static async getRoleById(id: string) {
        return db.select().from(roleList).where(eq(roleList.id, id)).then(res => res[0]);
    }
    
    static async updateRole(id: string, roleData: any) {
        return db.update(roleList).set(roleData).where(eq(roleList.id, id)).returning();
    }
    
    static async deleteRole(id: string) {
        return db.delete(roleList).where(eq(roleList.id, id));
    }
}
