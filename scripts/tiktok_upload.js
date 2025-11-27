import axios from "axios";
import fs from "fs";

const BASE = "https://business-api.tiktok.com/open_api/v1.3";

export async function tiktokUpload(videoPath, caption) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  const advertiserId = process.env.TIKTOK_ADVERTISER_ID;

  if (!token || !advertiserId) {
    throw new Error("Missing TIKTOK_ACCESS_TOKEN or TIKTOK_ADVERTISER_ID");
  }

  const size = fs.statSync(videoPath).size;

  // 1) INIT
  const initRes = await axios.post(
    `${BASE}/file/video/init/`,
    { advertiser_id: advertiserId, file_size: size },
    { headers: { "Access-Token": token } }
  );
  const { upload_id, upload_url } = initRes.data.data;

  // 2) Single-part upload (sufficient for typical short-form)
  const file = fs.readFileSync(videoPath);
  await axios.put(upload_url, file, {
    headers: { "Content-Type": "video/mp4" }
  });

  // 3) COMPLETE
  const completeRes = await axios.post(
    `${BASE}/file/video/complete/`,
    { advertiser_id: advertiserId, upload_id },
    { headers: { "Access-Token": token } }
  );
  const video_id = completeRes.data.data.video_id;

  // 4) PUBLISH
  const publishRes = await axios.post(
    `${BASE}/video/publish/`,
    {
      advertiser_id: advertiserId,
      video_id,
      post_info: { caption }
    },
    { headers: { "Access-Token": token } }
  );

  return publishRes.data;
}
