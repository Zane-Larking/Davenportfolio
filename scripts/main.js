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

var chop = function(str, chars=1) {
    console.log("chopped " + chars + " charactors!");
    return str.substring(0, str.length - chars);;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function showModal() {
    el = event.target;
    console.log("modal test");
}

//added functionality
window.addEventListener(
    "load", 
    ()=>{
        console.log("test"); 
    }
);


