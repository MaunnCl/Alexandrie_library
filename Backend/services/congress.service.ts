import { CongressRepository } from "../repository/congress.repository";
import { SessionRepository } from "@repository/session.repository";

export class CongressService {
  static async create(name: string, key: string, session_ids: number[], picture: string | null, date: string, city: string) {
    return CongressRepository.create(name, key, session_ids, picture, date, city);
  }

  static async getAll() {
    return CongressRepository.findAll();
  }

  static async getById(id: number) {
    return CongressRepository.findById(id);
  }

  static async update(id: number, name: string, key: string, session_ids: number[], picture: string | null, date: string, city: string) {
    return CongressRepository.update(id, name, key, session_ids, picture, date, city);
  }

  static async delete(id: number) {
    return CongressRepository.delete(id);
  }

  static async addSessionToCongress(congressId: number, sessionId: number) {
    const congress = await CongressRepository.findById(congressId);
    if (!congress) throw new Error("Congress not found");
  
    const session = await SessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");
  
    if (!congress.session_ids.includes(sessionId)) {
      congress.session_ids.push(sessionId);
      return CongressRepository.update(congress.id, congress.name, congress.key, congress.session_ids, congress.picture, congress.date, congress.city);
    }
  
    throw new Error("Session already exists in the congress");
  }
 
  static async removeSessionFromCongress(congressId: number, sessionId: number) {
    const congress = await CongressRepository.findById(congressId);
    if (!congress) throw new Error("Congress not found");
  
    const session = await SessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");
  
    const index = congress.session_ids.indexOf(sessionId);
    if (index > -1) {
      congress.session_ids.splice(index, 1);
      return CongressRepository.update(congress.id, congress.name, congress.key, congress.session_ids, congress.picture, congress.date, congress.city);
    }
  
    throw new Error("Session not found in the congress");
  }  
}
