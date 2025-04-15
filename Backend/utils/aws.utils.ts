import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    HeadObjectCommand,
    type GetObjectCommandOutput,
  } from "@aws-sdk/client-s3";
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

  export async function getSignedFileUrl(bucketName: string, key: string): Promise<string | null> {
    try {
      const headCommand = new HeadObjectCommand({ Bucket: bucketName, Key: key });
      const headResponse = await s3Client.send(headCommand);
  
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1h d'expiration
      return url;
  
    } catch (error) {
      if (error.name === "NotFound") {
        console.log(`File not found: ${key}`);
        return null;
      } else {
        console.error(`Error fetching file from S3: ${error.message}`);
        throw error;
      }
    }
  }

  export function extractS3Key(url?: string): string {
    if (!url) throw new Error("Missing URL for S3 key extraction");
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname).substring(1);
  }
  
  export async function getOratorPhotosFromS3() {
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Prefix: "orators/",  // Dossier orators sur AWS S3
    };
  
    try {
      const data = await s3Client.send(new ListObjectsV2Command(params));
      return data.Contents || [];
    } catch (error) {
      console.error("Error fetching photos from S3:", error);
      return [];
    }
  }
  