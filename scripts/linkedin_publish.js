import axios from "axios";

export async function linkedinPublish(text) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const org = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!token || !org) {
    throw new Error("Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_ORGANIZATION_ID");
  }

  const postRes = await axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      author: `urn:li:organization:${org}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE"
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return postRes.data;
}
