import * as Ably from "ably";

// Issues short-lived Ably token requests for the live visitor count. The
// capability only allows joining and watching one presence channel. Without
// ABLY_API_KEY the route reports itself disabled and the indicator stays hidden.
// POST (not GET) so it is never prerendered.

const CHANNEL = "presence:site";

export async function POST() {
  const key = process.env.ABLY_API_KEY;
  if (!key) return Response.json({ error: "disabled" }, { status: 503 });

  const rest = new Ably.Rest({ key });
  const tokenRequest = await rest.auth.createTokenRequest({
    clientId: `visitor-${crypto.randomUUID().slice(0, 8)}`,
    capability: { [CHANNEL]: ["presence", "subscribe"] },
    ttl: 60 * 60 * 1000,
  });
  return Response.json(tokenRequest, { headers: { "cache-control": "no-store" } });
}
