import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../util/awsClient";
import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

export class FileService {
  private bucketName = process.env.AWS_BUCKET_NAME!;
  private tempBucketName = process.env.AWS_TEMP_BUCKET_NAME;

  async generatePutSignedUrl(
    key: string,
    contentType: string,
    isPublic: boolean = false,
    isTemp: boolean = false
  ): Promise<string> {
    const bucketName = isTemp ? this.tempBucketName : this.bucketName;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expiration time
    });

    return signedUrl;
  }

  async generateGetSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command);
    return signedUrl;
  }
  async generateCloudFrontGetSignedCookies(videoPath: string) {

    const dateLessThan = Math.floor(Date.now() / 1000) + 3600;
    const policy = {
      Statement: [
        {
          Resource: `${process.env.CLOUDFRONT_DOMAIN}/${videoPath}*`,
          Condition: {
            DateLessThan: {
              "AWS:EpochTime": dateLessThan, // time in seconds
            },
          },
        },
      ],
    };
    
    const policyString = JSON.stringify(policy);

    const signedCookies = getSignedCookies({
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
      policy: policyString,
    });

    return signedCookies;
  }
}
