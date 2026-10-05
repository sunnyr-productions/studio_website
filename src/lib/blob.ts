import "server-only";
import { issueSignedToken, presignUrl } from "@vercel/blob";

const DOWNLOAD_LINK_TTL_MS = 1000 * 60 * 60 * 48; // 48 hours

export async function createSignedDownloadUrl(fileKey: string): Promise<string> {
  const validUntil = Date.now() + DOWNLOAD_LINK_TTL_MS;

  const signedToken = await issueSignedToken({
    pathname: fileKey,
    operations: ["get"],
    validUntil,
  });

  const { presignedUrl } = await presignUrl(signedToken, {
    operation: "get",
    pathname: fileKey,
    access: "private",
    validUntil,
  });

  return presignedUrl;
}
