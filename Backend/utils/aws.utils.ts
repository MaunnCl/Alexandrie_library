import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_SECRET_KEY!,
  },
});

export async function getPresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function getObjectText(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  const { Body } = await s3.send(command);
  if (!Body || !(Body instanceof Readable)) {
    throw new Error("Invalid stream returned by S3");
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of Body) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export async function listObjectsFromPrefix(prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3.send(command);
  return response.Contents?.map((obj) => obj.Key!) || [];
}