import { Request, Response } from "express";
import { ContentService } from "../services/content.service";
import { getSignedUrlForStreaming } from "@utils/aws.utils";

export class ContentController {
    static async create(req: Request, res: Response) {
        try {
            const content = await ContentService.createContent(req.body);
            res.status(201).json(content);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const videoKey = req.query.videoKey as string;
            const url = await getSignedUrlForStreaming(videoKey);
            //const contents = await ContentService.getAllContents();
            res.status(200).json(url);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const content = await ContentService.getContentById(Number(req.params.id));
            if (!content) {
                return res.status(404).json({ message: "Content not found" });
            }
            res.status(200).json(content);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const updatedContent = await ContentService.updateContent(Number(req.params.id), req.body);
            res.status(200).json(updatedContent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await ContentService.deleteContent(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
