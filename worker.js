// Relais Cloudflare Worker pour le site « Anime ton image ».
// Pourquoi : le navigateur n'a pas le droit d'appeler directement l'API d'Agnes (blocage CORS).
// Ce relais transmet seulement les appels vidéo et le téléchargement du résultat. Il ne garde rien et n'écrit aucun journal.
//
// À MODIFIER : l'adresse de TON site GitHub Pages (sans « / » à la fin).
const SITE = "https://TON-PSEUDO.github.io";

const API = "https://apihub.agnes-ai.com";

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin");
    const cors = {
      "Access-Control-Allow-Origin": SITE,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    const fail = (code, msg) => new Response(JSON.stringify({ detail: msg }), { status: code, headers: { ...cors, "Content-Type": "application/json" } });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin !== SITE) return fail(403, "Appel refusé : ce relais n'est utilisable que depuis le site.");

    // Appels vers l'API d'Agnes : uniquement la création et le suivi d'une vidéo
    if (url.pathname === "/api/v1/videos" || url.pathname === "/api/agnesapi") {
      const target = API + url.pathname.slice(4) + url.search;
      const headers = { "Content-Type": "application/json" };
      const auth = req.headers.get("Authorization");
      if (auth) headers["Authorization"] = auth;
      const r = await fetch(target, { method: req.method, headers, body: req.method === "POST" ? req.body : undefined });
      return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "application/json" } });
    }

    // Téléchargement de la vidéo terminée (lien https public uniquement)
    if (url.pathname === "/dl") {
      const target = url.searchParams.get("url") || "";
      let host = "";
      try { host = new URL(target).hostname; } catch (e) {}
      const interdit = !target.startsWith("https://") || !host.includes(".") || /^[\d.]+$/.test(host) || host === "localhost" || host.endsWith(".local");
      if (interdit) return fail(400, "Lien non autorisé.");
      const r = await fetch(target);
      return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "video/mp4" } });
    }

    return fail(404, "Introuvable.");
  },
};
