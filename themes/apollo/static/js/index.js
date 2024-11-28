function toggleLanguage() {
    if (localStorage.getItem("language") == null) {
        localStorage.setItem("language", "en");
        document.getElementsByTagName("html")[0].setAttribute("lang", "en");
        location.href = window.location.origin+"/en"+window.location.pathname;
        return;
    }
    if (localStorage.getItem("language") === "en") {
        localStorage.setItem("language", "de");
        document.getElementsByTagName("html")[0].setAttribute("lang", "de");
        let url = window.location.href;
        url = url.replace("/en", "");
        location.href = url;

    } else if (localStorage.getItem("language") === "de") {
        localStorage.setItem("language", "en");
        document.getElementsByTagName("html")[0].setAttribute("lang", "en");
        location.href = window.location.origin+"/en"+window.location.pathname;
    }
    
}

function updatelanguage() {
    if (localStorage.getItem("language") === "en") {
        let navigationanchors = document.getElementsByClassName("navigation_lang");
        for (let i = 0; i < navigationanchors.length; i++) {
            let url = navigationanchors[i].getAttribute("href");
            navigationanchors[i].setAttribute("href", "/en" + url );
        }
        document.getElementsByClassName("rss")[0].setAttribute("href", "/en/rss.xml");
        document.getElementById("navigation_start").setAttribute("href", "/en");
        document.getElementById("language-name").innerHTML = "en";
        document.getElementsByTagName("html")[0].setAttribute("lang", "en");
        if (!location.href.includes("/en")) {
            location.href = window.location.origin+"/en"+window.location.pathname;
        }
    }
    else{
        let readmore = document.getElementsByClassName("readmore");
        for (let i = 0; i < readmore.length; i++) {
           readmore[i].innerText = "Weiterlesen ⟶";
        }
        document.getElementsByClassName("/posts")[0].innerText = "/Artikel";
        document.getElementsByClassName("/pages")[0].innerText = "/Seiten";
        document.getElementsByClassName("/about")[0].innerText = "/Über";
        document.getElementsByClassName("/tags")[0].innerText = "/Tags";
        if (document.getElementsByClassName("toc-title")[0]){
        document.getElementsByClassName("toc-title")[0].innerText = "Inhaltsverzeichnis";
        }
        if (document.getElementsByClassName("date-label-posted")[0]){
        document.getElementsByClassName("date-label-posted")[0].innerText = ":: Verfasst am ";
        }
        if (document.getElementsByClassName("date-label-updated")[0]){
        document.getElementsByClassName("date-label-updated")[0].innerText = ":: Aktualisiert am ";
        }
       let times = document.getElementsByTagName("time")
        for (let i = 0; i < times.length; i++) {
            let date = times[i].innerText
            // convert to locale date
            date = new Date(date).toLocaleDateString();


            times[i].innerText = date;
        }

    }

}




function changeGiscusTheme () {
    const theme = document.documentElement.getAttribute('data-theme');
    console.log(theme);

    function sendMessage(message) {
    if (localStorage.getItem("theme-storage") === "dark") {
        

      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) {
        setTimeout(changeGiscusTheme, 1000); 
      }
      else{
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
      }
    }
    }

    sendMessage({
      setConfig: {
        theme: "https://simeon.staneks.de/css/giscus.dark.css"
      }
    });
  }

  changeGiscusTheme ()