function toggleLanguage() {
    if (localStorage.getItem("language") == null) {
        localStorage.setItem("language", "en");
        location.href = "/en";
        return;
    }
    if (localStorage.getItem("language") === "en") {
        localStorage.setItem("language", "de");
        location.href = "/#";

    } else if (localStorage.getItem("language") === "de") {
        localStorage.setItem("language", "en");
        location.href = "/en";
    }
    
}

function updatelanguage() {
    if (localStorage.getItem("language") === "en") {
        let navigationanchors = document.getElementsByClassName("navigation_lang");
        for (let i = 0; i < navigationanchors.length; i++) {
            let url = navigationanchors[i].getAttribute("href");
            navigationanchors[i].setAttribute("href", "/en" + url );
        }
        document.getElementById("navigation_start").setAttribute("href", "/en");
        document.getElementById("language-name").innerHTML = "en";
    }
    else{
        let readmore = document.getElementsByClassName("readmore");
        for (let i = 0; i < readmore.length; i++) {
           readmore[i].innerText = "Weiterlesen ⟶";
        }
    }

}