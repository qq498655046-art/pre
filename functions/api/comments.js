const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });
async function commentsWithReplies(env, sql, values = []) {
  let statement = env.COMMENTS_DB.prepare(sql);
  if (values.length) statement = statement.bind(...values);
  const { results: comments } = await statement.all();
  if (!comments.length) return comments;
  const placeholders = comments.map(() => "?").join(",");
  const { results: replies } = await env.COMMENTS_DB.prepare(
    `SELECT id, comment_id, author, body, created_at FROM prototype_comment_replies WHERE comment_id IN (${placeholders}) ORDER BY created_at ASC`
  ).bind(...comments.map((item) => item.id)).all();
  return comments.map((item) => ({ ...item, replies: replies.filter((reply) => reply.comment_id === item.id) }));
}

export async function onRequestGet({ request, env }) {
  const query = new URL(request.url).searchParams;
  const projectId = query.get("projectId") || "default";
  const pageId = query.get("pageId");
  if (!pageId) {
    return json(await commentsWithReplies(env,
      "SELECT id, project_id, page_id, author, body, x_pct, y_pct, status, created_at FROM prototype_comments WHERE project_id = ? ORDER BY created_at DESC",
      [projectId]
    ));
  }
  return json(await commentsWithReplies(env,
    "SELECT id, project_id, page_id, author, body, x_pct, y_pct, status, created_at FROM prototype_comments WHERE project_id = ? AND page_id = ? ORDER BY created_at DESC"
  , [projectId, pageId]));
}

export async function onRequestPost({ request, env }) {
  const { projectId, pageId, author, body, xPct, yPct } = await request.json();
  if (!pageId || !body?.trim()) return json({ error: "pageId and body are required" }, 400);
  const safeProjectId = String(projectId || "default").slice(0, 100);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.COMMENTS_DB.prepare(
    "INSERT INTO prototype_comments (id, project_id, page_id, author, body, x_pct, y_pct, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)"
  ).bind(id, safeProjectId, pageId, String(author || "审核人").slice(0, 40), String(body).trim().slice(0, 1000), Number(xPct) || 50, Number(yPct) || 50, createdAt).run();
  return json({ id, project_id: safeProjectId, page_id: pageId, author: author || "审核人", body: String(body).trim(), x_pct: Number(xPct) || 50, y_pct: Number(yPct) || 50, status: "open", created_at: createdAt }, 201);
}
