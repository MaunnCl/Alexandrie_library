import { S3Client, PutObjectCommand, GetObjectCommand, type GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import Bun from "bun";

config();


const s3Client = new S3Client({
    endpoint: Bun.env.BUCKET_ENDPOINT as string,
    region: Bun.env.BUCKET_REGION as string,
    forcePathStyle: true,
    credentials: {
        accessKeyId: Bun.env.BUCKET_ACCESS_KEY as string,
        secretAccessKey: Bun.env.BUCKET_SECRET_KEY as string,
    },
});

export async function uploadFile(bucketName: string, localPath: string, remoteKey: string) {
    const fileArrayBuffer = await Bun.file(localPath).arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: remoteKey,
        Body: new Uint8Array(fileArrayBuffer),
    });

    try {
        const response = await s3Client.send(command);
        console.log("✅ File uploaded successfully. Response:", response);
    } catch (error) {
        console.error("❌ Error uploading file:", error);
    }
}

export async function downloadFile(key: string) {
    const command = new GetObjectCommand({
        Bucket: Bun.env.BUCKET_NAME as string,
        Key: key
    });

    const s3Response: GetObjectCommandOutput = await s3Client.send(command);
    if (!s3Response.Body) {
        throw new Error("No file body returned from Hetzner");
    }

    const arrayBuffer = await new Response(s3Response.Body as any).arrayBuffer();
    return arrayBuffer;
}

const LOCAL_FILE_PATH = "/Users/rafaelsapaloesteves/Downloads/Bassez Video.mp4";
const REMOTE_FILE_KEY = Bun.env.BUCKET_FILE_NAME as string;

uploadFile(Bun.env.BUCKET_NAME as string, LOCAL_FILE_PATH, REMOTE_FILE_KEY);