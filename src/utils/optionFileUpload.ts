import { IkasAPIClientConfig, IkasProductOption, productOptionFileUpload } from "@ikas/bp-storefront";

type PresignedPost = { url: string; fields: Record<string, string> | string | null; optionUrl: string };

async function getPresignedPost(option: IkasProductOption, file: File): Promise<PresignedPost | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...IkasAPIClientConfig.HEADERS };
  if (IkasAPIClientConfig.TOKEN) headers.authorization = `Bearer ${IkasAPIClientConfig.TOKEN}`;
  const res = await fetch(`${IkasAPIClientConfig.URL}/getProductOptionFileUrl`, {
    method: "POST",
    headers,
    body: JSON.stringify({ fileName: file.name, productOptionSetId: option.productOptionSetId, productOptionId: option.id }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.getProductOptionFileUrl ?? null;
}

/**
 * Same flow as the SDK's `productOptionFileUpload` (getProductOptionFileUrl → presigned S3 POST →
 * keep `optionUrl`), minus its bug: the SDK sets `Content-Type: multipart/form-data` by hand, which
 * drops the boundary and S3 answers 400 MalformedPOSTRequest ("Dosya yüklenemedi"). Letting the
 * browser set the header from the FormData makes S3 accept it (204). Falls back to the SDK call when
 * the API client isn't configured. Resolves to the uploaded files' option URLs (failed files dropped).
 */
export async function uploadOptionFiles(option: IkasProductOption, files: File[]): Promise<string[]> {
  if (!files.length) return [];
  if (!IkasAPIClientConfig.URL) return productOptionFileUpload(option, files);
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const post = await getPresignedPost(option, file);
        if (!post?.url || !post.optionUrl) return null;
        const fields = typeof post.fields === "string" ? JSON.parse(post.fields) : post.fields ?? {};
        const body = new FormData();
        Object.entries(fields).forEach(([k, v]) => body.append(k, String(v)));
        body.append("file", file);
        const res = await fetch(post.url, { method: "POST", body });
        return res.ok ? post.optionUrl : null;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((u): u is string => !!u);
}
