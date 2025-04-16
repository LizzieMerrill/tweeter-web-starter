import * as AWS from "aws-sdk";
import { IS3DAO } from "../../interfaces/IS3DAO";
import { Buffer } from "buffer";
import * as dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({ region: "us-east-1" });
const S3_BUCKET = process.env.S3_BUCKET || "cs340milestone3lizziemerrill";

export class S3DAO implements IS3DAO {
  async uploadProfileImage(
    userAlias: string,
    imageBuffer: Buffer,
    fileExtension: string
  ): Promise<string> {
    const fileKey = `profile-images/${userAlias}.${fileExtension}`;
    const contentType = fileExtension === "png" ? "image/png" : "image/jpeg";
    const params: AWS.S3.PutObjectRequest = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: imageBuffer,
      ContentType: contentType,
      ACL: "public-read"
    };
    await s3.putObject(params).promise();
    return `https://${S3_BUCKET}.s3.amazonaws.com/${fileKey}`;
  }
}
