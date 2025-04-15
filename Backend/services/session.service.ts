import { SessionRepository } from "../repository/session.repository";

export class SessionService {
  static create(name: string, content_ids: number[]) {
    return SessionRepository.create(name, content_ids);
  }

  static getAll() {
    return SessionRepository.findAll();
  }

  static getById(id: number) {
    return SessionRepository.findById(id);
  }

  static update(id: number, name: string, content_ids: number[]) {
    return SessionRepository.update(id, name, content_ids);
  }

  static delete(id: number) {
    return SessionRepository.delete(id);
  }

  static async addContentToSession(sessionId: number, contentId: number) {
    const session = await SessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");
    
    const updatedIds = [...(session.content_ids || []), contentId];
    return SessionRepository.update(sessionId, session.name, updatedIds);
  }

  static async removeContentFromSession(sessionId: number, contentId: number) {
    const session = await SessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");

    const list = (session.content_ids || []).filter(id => id !== contentId);
    return SessionRepository.update(sessionId, session.name, list);
  }
}
