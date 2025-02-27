import { db } from "../config/database";
import { userTable } from "../schemas/user";
import { eq } from "drizzle-orm";

export class UserRepository {
    static async createUser(userData: any) {
        const user = {
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: (userData.email as string).toLowerCase(),
            password: userData.password,
            date_of_birth: userData.birthDate,
            address: userData.address,
            country: userData.country,
            phone: userData.phone,
            zipcode: userData.zipcode
        };

        try {
            const result = await db.insert(userTable).values(user).returning();
            if (result.length > 0) return result[0];
            console.log("⚠️ User not created.");
        } catch (error) {
            console.error("❌ Database Insert Error:", error);
            return null;
        }
    }

    static async getAllUsers() {
        return db.select().from(userTable);
    }

    static async getUserByEmail(email: string) {
        return db.select().from(userTable).where(eq(userTable.email, email)).then(users => users[0]);
    }

    static async getUserById(id: number) {
        return db.select().from(userTable).where(eq(userTable.id, id));
    }

    static async updateUser(id: number, userData: any) {
        return db.update(userTable).set(userData).where(eq(userTable.id, id)).returning();
    }

    static async deleteUser(id: number) {
        return db.delete(userTable).where(eq(userTable.id, id));
    }
}
