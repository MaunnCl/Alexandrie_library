import { ContentRepository } from "../repository/content.repository";
import {
  getSignedUrlForStreaming,
  buildS3KeyFromTitle,
} from "../utils/aws.utils";

export class ContentService {
  static async createContent(data: any) {
    const videoKey = buildS3KeyFromTitle(data.title);
    const signedUrl = await getSignedUrlForStreaming(videoKey);
    return await ContentRepository.create({
      ...data,
      url: signedUrl,
    });
  }

  static async getAllContents() {
    return await ContentRepository.findAll();
  }

  static async getContentById(id: number) {
    return await ContentRepository.findById(id);
  }

  static async updateContent(id: number, data: any) {
    return await ContentRepository.update(id, data);
  }

  static async deleteContent(id: number) {
    return await ContentRepository.delete(id);
  }
}
