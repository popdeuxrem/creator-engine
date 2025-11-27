import axios from "axios";

export async function instagramPublish(videoUrl, caption) {
  const igUserId = process.env.IG_USER_ID;
  const accessToken = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !accessToken) {
    throw new Error("Missing IG_USER_ID or IG_ACCESS_TOKEN");
  }

  const containerRes = await axios.post(
    `https://graph.facebook.com/v18.0/${igUserId}/media`,
    {
      media_type: "VIDEO",
      video_url: videoUrl,
      caption
    },
    { params: { access_token: accessToken } }
  );
  const containerId = containerRes.data.id;

  const publishRes = await axios.post(
    `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
    { creation_id: containerId },
    { params: { access_token: accessToken } }
  );

  return publishRes.data;
}
