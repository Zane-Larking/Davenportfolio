function toggleDisplay(ev, id) {
    console.log(ev);
    const nav = document.getElementById(id);
    if (nav.getAttribute("state") === "closed") {
        nav.removeAttribute("state");
    }
    else {
        nav.setAttribute("state", "closed");
    }
}

function toggleDisplayGenerator(id) {
    const id = id;
    return function(ev) {
        toggleDisplay(ev, id);
    }
} 



window.addEventListener(
    "load", 
    ()=>{
        document.getElementById("year").innerHTML = new Date().getFullYear();

        const navToggle = document.body.querySelector("#main-nav-toggle");

        navToggle.addEventListener("click", toggleDisplayGenerator("main-nav"));
    }
);


