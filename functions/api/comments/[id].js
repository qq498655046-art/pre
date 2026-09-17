const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export async function onRequestPatch({ request, env, params }) {
  const { projectId, status } = await request.json();
  if (!["open", "resolved"].includes(status)) return json({ error: "invalid status" }, 400);
  const result = await env.COMMENTS_DB.prepare("UPDATE prototype_comments SET status = ? WHERE id = ? AND project_id = ?").bind(status, params.id, String(projectId || "default").slice(0, 100)).run();
  if (!result.meta.changes) return json({ error: "comment not found" }, 404);
  return json({ id: params.id, status });
}
