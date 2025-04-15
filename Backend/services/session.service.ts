import { SessionRepository } from "../repository/session.repository";
import { ContentRepository } from "@repository/content.repository";

export class SessionService {
  static async create(name: string) {
    return SessionRepository.create(name);
  }

  static async getAll() {
    return SessionRepository.findAll();
  }

  static async getById(id: number) {
    return SessionRepository.findById(id);
  }

  static async update(id: number, name: string) {
    return SessionRepository.update(id, name);
  }

  static async delete(id: number) {
    return SessionRepository.delete(id);
  }

  static async addContentToSession(sessionId: number, contentId: number) {
    const session = await SessionRepository.findById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const content = await ContentRepository.findById(contentId);
    if (!content) {
      throw new Error("Content not found");
    }
    const updatedContentIds = [...new Set([...session.content_ids, contentId])];
    const updatedSession = await SessionRepository.update(sessionId, session.name, updatedContentIds);
    return updatedSession;
  }

  static async removeContentFromSession(sessionId: number, contentId: number) {
    const session = await SessionRepository.findById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    session.content_ids = session.content_ids.filter(id => id !== contentId);
    const updatedSession = await SessionRepository.update(sessionId, session.name, session.content_ids);
    return updatedSession;
  }
}
