const UPSTREAM = "https://api.jerexd.my.id/api/tools/bypas-sfl";

function send(res, status, payload) {
  res.status(status).setHeader("Cache-Control", "no-store");
  res.json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Metode tidak diizinkan. Gunakan POST." });
  }

  const apikey = process.env.JEREXD_APIKEY;
  if (!apikey) {
    return send(res, 500, { error: "Server belum dikonfigurasi (JEREXD_APIKEY kosong)." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const url = body && typeof body.url === "string" ? body.url.trim() : "";

  let parsed;
  try { parsed = new URL(url); } catch (e) { parsed = null; }
  if (!parsed || !/^https?:$/.test(parsed.protocol) || url.length > 2048) {
    return send(res, 400, { error: "Link tidak valid. Masukkan link lengkap, misalnya https://sfl.gl/xxxxxx" });
  }

  try {
    const target = UPSTREAM + "?apikey=" + encodeURIComponent(apikey) + "&url=" + encodeURIComponent(url);
    const upstream = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: url }),
      signal: AbortSignal.timeout(25000)
    });

    const text = (await upstream.text()).split(apikey).join("***");

    let data;
    try { data = JSON.parse(text); } catch (e) { data = { result: text }; }
    return send(res, upstream.status, data);
  } catch (e) {
    return send(res, 502, { error: "Tidak bisa menghubungi layanan bypass. Coba lagi sebentar lagi." });
  }
};
