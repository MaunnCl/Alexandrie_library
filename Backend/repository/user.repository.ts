import { db } from "../config/database";
import { userTable } from "../schemas/user";
import { eq } from "drizzle-orm";

export class UserRepository {
    static async createUser(userData: any) {
        return (await db.insert(userTable).values({
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            password: userData.password,
            date_of_birth: userData.date_of_birth,
            address: userData.address,
            zipcode: userData.zipcode,
            country: userData.country
        }).returning());
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
