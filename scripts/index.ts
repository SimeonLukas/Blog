import { hash } from "bun";
const fs = require("fs");
const { DOMParser } = require("xmldom");
const { createInstance } = require("polotno-node");

async function run(x, lang) {
  let titles = [];
  let dates = [];
  let urls = [];
  let content = [];
  let languages = "de"
  const data = fetch(lang)
    .then((response) => response.text())
    .then((str) => {
      // convert xml to json without domparser
      let parser = new DOMParser();
      let xml = parser.parseFromString(str, "text/xml");
      let items = xml.getElementsByTagName("item");
      languages = xml.getElementsByTagName("language")[0].childNodes[0].nodeValue;
      for (let o = 0; o < items.length; o++) {
        titles.push(
          items[o].getElementsByTagName("title")[0].childNodes[0].nodeValue
        );
  
        let date = new Date(
          items[o].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue
        );
        let options = { year: "numeric", month: "long", day: "numeric" };
        let formattedDate = date.toLocaleDateString("de-DE", options);
        dates.push(formattedDate);

        let url =
          items[o].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        url = url.split("/");
        url = url[url.length - 3] + "/" + url[url.length - 2];
        urls.push(url);
        let description =
          items[o].getElementsByTagName("description")[0].childNodes[0].nodeValue;
          // console.log(description)
        if (description.length > 500) {
          description = description.substring(0, 500) + "...";
        }
        description = description.replace(/<[^>]*>?/gm, "");
        content.push(description);
      }
      for (let k = 0; k < titles.length; k++) {
        // random color by title
      
        let template = JSON.parse(fs.readFileSync("data" + "/" + x, "utf8"));
        for (let i = 0; i < template.pages.length; i++) {
          template.pages[i].background = "linear-gradient(228deg,white 0%," + getRGB(titles[k]) + " 100%)";
          for (let j = 0; j < template.pages[i].children.length; j++) {
            if (template.pages[i].children[j].name == "title") {
              template.pages[i].children[j].text = titles[k];
            }
            if (template.pages[i].children[j].name == "date") {
              template.pages[i].children[j].text =
                "Simeon Stanek :: " + dates[k];
            }
            if (template.pages[i].children[j].name == "hintergrundtext") {
              template.pages[i].children[j].text = content[k];
            }
          }
        }
        

        exporter(template, k, urls[k], x, languages);
      }
    });

  async function exporter(template, i, url, x , languages) {

    fs.mkdirSync("../content/" + url + "/images/" + languages, { recursive: true });

      if (x == "ogimage.json" && !fs.existsSync("../content/" + url + "/images/"+languages+ "/preview.jpg")) {
        let instance = await createInstance({
          key: "BYTOqo8fIB_6kgfI5SkT",
        });
    
        let pdfBase64 = await instance.jsonToImageBase64(template, {
          mimeType: "image/jpeg",
        });
        fs.writeFileSync(
          "../content/" + url + "/images/"+languages+ "/preview.jpg",
          pdfBase64,
          "base64"
        );
        instance.close();
      }
      if (x == "instagram1.json" && !fs.existsSync("../content/" + url + "/images/"+languages+ "/instagram1.jpg")) {
        let instance = await createInstance({
          key: "BYTOqo8fIB_6kgfI5SkT",
        });
    
        let pdfBase64 = await instance.jsonToImageBase64(template, {
          mimeType: "image/jpeg",
        });
        fs.writeFileSync(
          "../content/" + url + "/images/"+languages+ "/instagram1.jpg",
          pdfBase64,
          "base64"
        );
        instance.close();
      }
      if (x == "instagram2.json" && !fs.existsSync("../content/" + url + "/images/"+languages+ "/instagram2.jpg")) {
        let instance = await createInstance({
          key: "BYTOqo8fIB_6kgfI5SkT",
        });
    
        let pdfBase64 = await instance.jsonToImageBase64(template, {
          mimeType: "image/jpeg",
        });
        fs.writeFileSync(
          "../content/"  + url + "/images/"+languages+ "/instagram2.jpg",
          pdfBase64,
          "base64"
        );
        instance.close();
      }
      if (x == "feed.json" && !fs.existsSync("../content/" + url + "/images/"+languages+ "/feed.jpg")) {
        let instance = await createInstance({
          key: "BYTOqo8fIB_6kgfI5SkT",
        });
    
        let pdfBase64 = await instance.jsonToImageBase64(template, {
          mimeType: "image/jpeg",
        });
        fs.writeFileSync(
          "../content/"  + url + "/images/"+languages+ "/feed.jpg",
          pdfBase64,
          "base64"
        );
        instance.close();
      }
    
  }
}

function getRGB(str) {
let hashed = hash(str);
let result = hashed.toString(16).substring(0, 6);
return "#" + result;
}

async function generate() {

run("ogimage.json", "http://127.0.0.1:1234/rss.xml");

setTimeout(() => {
  run("instagram1.json", "http://127.0.0.1:1234/rss.xml");
}, 5000);

setTimeout(() => {
  run("instagram2.json", "http://127.0.0.1:1234/rss.xml");
}, 10000);

setTimeout(() => {
  run("feed.json", "http://127.0.0.1:1234/rss.xml");
}, 15000);

setTimeout(() => {
  run("ogimage.json", "http://127.0.0.1:1234/en/rss.xml");
}, 20000);

setTimeout(() => {
  run("instagram1.json", "http://127.0.0.1:1234/en/rss.xml");
}, 25000);

setTimeout(() => {
  run("instagram2.json", "http://127.0.0.1:1234/en/rss.xml");
}, 30000);

setTimeout(() => {
  run("feed.json", "http://127.0.0.1:1234/en/rss.xml");
}, 35000);
}

generate();
