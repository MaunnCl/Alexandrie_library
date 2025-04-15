import { CongressRepository } from "../repository/congress.repository";

export class CongressService {
  static async create(
    name: string,
    key: string,
    session_ids: number[] = [],
    picture: string | null,
    date: string,
    city: string
  ) {
    return CongressRepository.create(name, key, session_ids, picture, date, city);
  }

  static async getAll() {
    return CongressRepository.findAll();
  }

  static async getById(id: number) {
    return CongressRepository.findById(id);
  }

  static async update(
    id: number,
    name: string,
    key: string,
    session_ids: number[] = [],
    picture: string | null,
    date: string,
    city: string
  ) {
    return CongressRepository.update(id, name, key, session_ids, picture, date, city);
  }

  static async delete(id: number) {
    return CongressRepository.delete(id);
  }

  static async addSessionToCongress(congressId: number, sessionId: number) {
    const congress = await CongressRepository.findById(congressId);
    if (!congress) throw new Error("Congress not found");

    const sessions = Array.isArray(congress.session_ids) ? [...congress.session_ids] : [];

    if (!sessions.includes(sessionId)) {
      sessions.push(sessionId);
      return CongressRepository.update(congress.id, congress.name, congress.key, sessions, congress.picture, congress.date, congress.city);
    }

    throw new Error("Session already added to this congress");
  }

  static async removeSessionFromCongress(congressId: number, sessionId: number) {
    const congress = await CongressRepository.findById(congressId);
    if (!congress) throw new Error("Congress not found");

    const sessions = Array.isArray(congress.session_ids) ? congress.session_ids.filter(id => id !== sessionId) : [];

    return CongressRepository.update(congress.id, congress.name, congress.key, sessions, congress.picture, congress.date, congress.city);
  }
}
