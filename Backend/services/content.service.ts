import { ContentRepository } from "../repository/content.repository";
import {
  getSignedUrlForStreaming,
  buildS3KeyFromTitle,
  getSignedFileUrl,
} from "../utils/aws.utils";

export class ContentService {
  static async create(content: any) {
    const { title, folder, picture_orator, thumbnail_name } = content;

    const videoKey = `${folder}/${title}`;
    const oratorKey = `${folder}/${picture_orator}`;
    const thumbnailKey = `${folder}/${thumbnail_name}`;

    const url = await getSignedFileUrl(process.env.BUCKET_NAME!, videoKey);
    const orator_image_url = await getSignedFileUrl(process.env.BUCKET_NAME!, oratorKey);
    const video_thumbnail_url = await getSignedFileUrl(process.env.BUCKET_NAME!, thumbnailKey);

    const contentToCreate = {
      ...content,
      url,
      orator_image_url,
      video_thumbnail_url,
    };

    return await ContentRepository.create(contentToCreate);
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

  static async getContentByTitle(title: string) {
    return await ContentRepository.findByTitle(title);
  }

}
