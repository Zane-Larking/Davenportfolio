function toggleDisplay(ev, id) {
    console.log(ev);
    let nav = document.getElementById(id);
    if (nav.getAttribute("state") === "closed") {
        nav.removeAttribute("state");
    }
    else {
        nav.setAttribute("state", "closed");
    }
}

function toggleDisplayGenerator(id) {
    var id = id;
    return function(ev) {
        toggleDisplay(ev, id);
    }
} 



window.addEventListener(
    "load", 
    ()=>{
        console.log("test"); 
        document.getElementById("year").innerHTML = new Date().getFullYear();

        let navToggle = document.body.querySelector("#main-nav-toggle");

        navToggle.addEventListener("click", toggleDisplayGenerator("main-nav"));
    
    }
);


