import fs from "fs";
import crypto from "crypto";
import { DOMParser } from "xmldom";
import { createInstance } from "polotno-node";

async function fetchText(url: string) {
  if (typeof fetch === "undefined") {
    // Node <18 fallback (install node-fetch wenn nötig)
    // npm i node-fetch
    // @ts-ignore
    const nodeFetch = await import("node-fetch");
    return (await nodeFetch.default(url)).text();
  }
  return (await fetch(url)).text();
}

function getRGB(str: string) {
  const hash = crypto.createHash("sha1").update(str).digest("hex");
  return `#${hash.slice(0, 6)}`;
}

async function exporter(instance: any, template: any, url: string, x: string, languages: string) {
  fs.mkdirSync(`../../content/${url}/images/${languages}`, { recursive: true });

  const outPaths: Record<string, string> = {
    "ogimage.json": `../../content/${url}/images/${languages}/preview.jpg`,
    "instagram1.json": `../../content/${url}/images/${languages}/instagram1.jpg`,
    "instagram2.json": `../../content/${url}/images/${languages}/instagram2.jpg`,
    "feed.json": `../../content/${url}/images/${languages}/feed.jpg`,
    "reel.json": `../reel/src/background/${url}-${languages}.jpg`,
  };

  const outPath = outPaths[x];
  if (!outPath) return;

  if (fs.existsSync(outPath)) return;

  const pdfBase64 = await instance.jsonToImageBase64(template, { mimeType: "image/jpeg" });
  fs.writeFileSync(outPath, pdfBase64, "base64");
}

async function run(instance: any, x: string, langUrl: string) {
  try {
    const text = await fetchText(langUrl);
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = Array.from(xml.getElementsByTagName("item"));
    const languageNode = xml.getElementsByTagName("language")[0];
    const languages = (languageNode && languageNode.textContent) ? languageNode.textContent : "de";

    for (let o = 0; o < items.length; o++) {
      const item = items[o];
      const titleNode = item.getElementsByTagName("title")[0];
      const pubDateNode = item.getElementsByTagName("pubDate")[0];
      const linkNode = item.getElementsByTagName("link")[0];
      const descNode = item.getElementsByTagName("description")[0];
      const infoNode = item.getElementsByTagName("info")[0];

      const title = titleNode?.textContent ?? `post-${o}`;
      const pubDate = pubDateNode?.textContent ?? "";
      const link = linkNode?.textContent ?? "";
      const description = (descNode?.textContent ?? "").replace(/<[^>]*>?/gm, "");
      const information = infoNode?.textContent ?? "";

      const date = pubDate ? new Date(pubDate) : new Date();
      const formattedDate = date.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" });

      let url = link.split("/");
      url = url.length >= 3 ? `${url[url.length - 3]}/${url[url.length - 2]}` : `post-${o}`;

      // write info text file (keeps original behaviour)
      fs.mkdirSync("../reel/src/text", { recursive: true });
      fs.writeFileSync(`../reel/src/text/${url}-${languages}.txt`, information, "utf8");

      // load template and inject data
      const templateRaw = fs.readFileSync(`data/${x}`, "utf8");
      const template = JSON.parse(templateRaw);

      for (let i = 0; i < template.pages.length; i++) {
        template.pages[i].background = `linear-gradient(228deg,white 0%,${getRGB(title)} 100%)`;
        for (let j = 0; j < template.pages[i].children.length; j++) {
          const child = template.pages[i].children[j];
          if (child.name === "title") child.text = title;
          if (child.name === "date") child.text = `Simeon Stanek :: ${formattedDate}`;
          if (child.name === "hintergrundtext") child.text = description.length > 500 ? description.substring(0, 500) + "..." : description;
        }
      }

      await exporter(instance, template, url, x, languages);
    }
  } catch (err) {
    console.error(`Fehler bei run(${x}, ${langUrl}):`, err);
  }
}

export async function generateAll() {
  const key = process.env.POLOTNO_KEY || "BYTOqo8fIB_6kgfI5SkT";
  const instance = await createInstance({ key });
  try {
    const tasks = [
      ["ogimage.json", "http://127.0.0.1:1234/rss.xml"],
      ["instagram1.json", "http://127.0.0.1:1234/rss.xml"],
      ["instagram2.json", "http://127.0.0.1:1234/rss.xml"],
      ["feed.json", "http://127.0.0.1:1234/rss.xml"],
      ["ogimage.json", "http://127.0.0.1:1234/en/rss.xml"],
      ["instagram1.json", "http://127.0.0.1:1234/en/rss.xml"],
      ["instagram2.json", "http://127.0.0.1:1234/en/rss.xml"],
      ["feed.json", "http://127.0.0.1:1234/en/rss.xml"],
      ["reel.json", "http://127.0.0.1:1234/rss.xml"],
      ["reel.json", "http://127.0.0.1:1234/en/rss.xml"],
    ];

    // sequenziell ausführen, damit die API nicht überlastet wird
    for (const [x, lang] of tasks) {
      // kleine Pause zwischen Requests, falls nötig
      await run(instance, x, lang);
      await new Promise((r) => setTimeout(r, 250));
    }
  } finally {
    try {
      instance.close();
    } catch (e) {
      // ignore
    }
  }
}

if (require.main === module) {
  generateAll().catch((e) => {
    console.error("generateAll failed:", e);
    process.exitCode = 1;
  });
}