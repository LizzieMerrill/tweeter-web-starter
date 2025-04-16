import { Buffer } from "buffer";

export interface IS3DAO {
  uploadProfileImage(
    userAlias: string,
    imageBuffer: Buffer,
    fileExtension: string
  ): Promise<string>;
}
