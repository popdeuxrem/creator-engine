// Note: For production, you should use a proper OAuth 1.0a client.
// This is a simplified placeholder using bearer + v2 tweet endpoint.

import axios from "axios";

export async function xPost(caption) {
  const token = process.env.X_ACCESS_TOKEN;
  if (!token) throw new Error("Missing X_ACCESS_TOKEN (Bearer)");

  const tweetRes = await axios.post(
    "https://api.twitter.com/2/tweets",
    { text: caption },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return tweetRes.data;
}
