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


//added functionality
window.addEventListener(
    "load", 
    ()=>{
        console.log("test"); 
    
    }
);


