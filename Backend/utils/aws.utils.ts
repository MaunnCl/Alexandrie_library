import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    type GetObjectCommandOutput,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import { config } from "dotenv";
  import Bun from "bun";
  
  config();
  
  const s3Client = new S3Client({
    endpoint: Bun.env.BUCKET_ENDPOINT as string, // tu peux laisser vide si tu n’as pas besoin
    region: Bun.env.BUCKET_REGION as string,
    forcePathStyle: true,
    credentials: {
      accessKeyId: Bun.env.BUCKET_ACCESS_KEY as string,
      secretAccessKey: Bun.env.BUCKET_SECRET_KEY as string,
    },
  });
  
  export async function uploadFile(
    bucketName: string,
    localPath: string,
    remoteKey: string
  ) {
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
      Key: key,
    });
  
    const s3Response: GetObjectCommandOutput = await s3Client.send(command);
    if (!s3Response.Body) {
      throw new Error("No file body returned from S3");
    }
  
    const arrayBuffer = await new Response(s3Response.Body as any).arrayBuffer();
    return arrayBuffer;
  }
  
  export async function getSignedUrlForStreaming(key: string) {
    const command = new GetObjectCommand({
      Bucket: Bun.env.BUCKET_NAME as string,
      Key: key,
    });
  
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  }
  
  // Construction propre à partir du title : garde le nom original
  export function buildS3KeyFromTitle(title: string): string {
    const withoutExt = title.replace(/\.mp4$/i, ""); // supprime .mp4 si déjà là
    return `${withoutExt}.mp4`; // remet proprement
  }

  export async function getSignedFileUrl(bucketName: string, key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1h
    return url;
  }
  
  