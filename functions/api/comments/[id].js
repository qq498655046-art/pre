const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export async function onRequestPatch({ request, env, params }) {
  const { status } = await request.json();
  if (!["open", "resolved"].includes(status)) return json({ error: "invalid status" }, 400);
  await env.COMMENTS_DB.prepare("UPDATE prototype_comments SET status = ? WHERE id = ?").bind(status, params.id).run();
  return json({ id: params.id, status });
}
