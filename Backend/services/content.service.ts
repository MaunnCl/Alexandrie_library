import { url } from "inspector";
import { ContentRepository } from "../repository/content.repository";
import {
  getSignedUrlForStreaming,
  buildS3KeyFromTitle,
  getSignedFileUrl,
  extractS3Key
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

  static async refreshContentUrls(id: number) {
    const content = await ContentRepository.findById(id);
    if (!content) throw new Error("Content not found");
    const { folder, title, picture_orator, thumbnail_name } = content;

    const videoKey = `${folder}/${title}`;
    const oratorKey = `${folder}/${picture_orator}`;
    const thumbnailKey = `${folder}/${thumbnail_name}`;
    
    const newUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, videoKey);
    const newOratorImageUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, oratorKey);
    const newThumbnailUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, thumbnailKey);
  
    const updatedContent = await ContentRepository.update(id, {
      url: newUrl,
      orator_image_url: newOratorImageUrl,
      video_thumbnail_url: newThumbnailUrl
    });
  
    return updatedContent;
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

  static async refreshAllContentUrls() {
    const allContents = await ContentRepository.findAll();
  
    const updated = [];
  
    for (const content of allContents) {
      if (!content.folder || !content.title || !content.picture_orator || !content.thumbnail_name) {
        console.warn(`Skip content ID ${content.id} — données manquantes`);
        continue;
      }
  
      const videoKey = `${content.folder}/${content.title}`;
      const oratorKey = `${content.folder}/${content.picture_orator}`;
      const thumbnailKey = `${content.folder}/${content.thumbnail_name}`;
  
      const newUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, videoKey);
      const newOratorImageUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, oratorKey);
      const newThumbnailUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, thumbnailKey);
  
      const result = await ContentRepository.update(content.id, {
        url: newUrl,
        orator_image_url: newOratorImageUrl,
        video_thumbnail_url: newThumbnailUrl
      });
  
      updated.push(result);
    }
  
    return updated;
  }
}
