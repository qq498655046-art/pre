const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export async function onRequestPost({ request, env, params }) {
  const { author, body } = await request.json();
  if (!body?.trim()) return json({ error: "body is required" }, 400);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.COMMENTS_DB.prepare(
    "INSERT INTO prototype_comment_replies (id, comment_id, author, body, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, params.id, String(author || "审核人").slice(0, 40), String(body).trim().slice(0, 1000), createdAt).run();
  return json({ id, comment_id: params.id, author: author || "审核人", body: String(body).trim(), created_at: createdAt }, 201);
}
