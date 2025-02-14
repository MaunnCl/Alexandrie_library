import { db } from "../config/database";
import { userProfile } from "../schemas/user";
import { eq } from "drizzle-orm";

export class UserProfileRepository {
    static async createUserProfile(profileData: any) {
        return db.insert(userProfile).values(profileData).returning();
    }

    static async getAllUserProfiles() {
        return db.select().from(userProfile);
    }

    static async getUserProfileById(id: string) {
        return db.select().from(userProfile).where(eq(userProfile.id, id)).then(res => res[0]);
    }

    static async updateUserProfile(id: string, profileData: any) {
        return db.update(userProfile).set(profileData).where(eq(userProfile.id, id)).returning();
    }

    static async deleteUserProfile(id: string) {
        return db.delete(userProfile).where(eq(userProfile.id, id));
    }
}
