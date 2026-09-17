const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export async function onRequestGet({ request, env }) {
  const pageId = new URL(request.url).searchParams.get("pageId");
  if (!pageId) return json([]);
  const { results } = await env.COMMENTS_DB.prepare(
    "SELECT id, page_id, author, body, status, created_at FROM prototype_comments WHERE page_id = ? ORDER BY created_at DESC"
  ).bind(pageId).all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const { pageId, author, body } = await request.json();
  if (!pageId || !body?.trim()) return json({ error: "pageId and body are required" }, 400);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.COMMENTS_DB.prepare(
    "INSERT INTO prototype_comments (id, page_id, author, body, status, created_at) VALUES (?, ?, ?, ?, 'open', ?)"
  ).bind(id, pageId, String(author || "审核人").slice(0, 40), String(body).trim().slice(0, 1000), createdAt).run();
  return json({ id, page_id: pageId, author: author || "审核人", body: String(body).trim(), status: "open", created_at: createdAt }, 201);
}
