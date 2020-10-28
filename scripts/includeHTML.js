const includeHTML = function() {
    var z, i, elmnt, file;
    /* Loop through a collection of all HTML elements: */
    z = document.querySelectorAll("[include-html]");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            writeFromFile(elmnt,file,i);
        }
    }
}
var footerLoadCB = function() {
    let ccyear = document.getElementById("year");
    ccyear.innerHTML = new Date().getFullYear();
}

var headerLoadCB = function() {
    let navToggle = document.body.querySelector("#main-nav-toggle");
    navToggle.addEventListener("click", toggleDisplayGenerator("main-nav"));
}

const handleRejectedPromise = function(err, ...args) {
    console.log("Rejected");
    console.log(args);
    alert("Oops! Something went wrong. Some features may not functional at the moment\nmessage: " + err);

}


const writeFromFile = function(elmnt, file, promiseId) {

    /* Make an HTTP request using the attribute value as the file name: */
    // (new Promise(loadElementExecutor(handleLoadFulfilled, handleRejectedPromise)))

    console.log("promise " + promiseId + " being created");
    //creates an array of promises for each element with a [include-html] attribute 
    promiseHTMLContent(elmnt, file, promiseId)
    //load the html content
    .then(loadHTMLContent.bind(null, elmnt, promiseId))
    //add functionality
    .then(loadFunctionality.bind(null, elmnt, promiseId))
    //error
    .catch(handleRejectedPromise.bind(null, elmnt, file, promiseId));
}





const promiseHTMLContent = function(elmnt, file, promiseId) {
    elmnt.removeAttribute("include-html");
    console.log("promise " + promiseId + " created");
    return new Promise((resolve, reject) => {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                    console.log("HTTP request " + promiseId + " finished");
                }
                if (this.status == 404) {
                    reject("404 - Resource not found.")
                    console.log("HTTP request " + promiseId + " failed");
                }
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        console.log("HTTP request " + promiseId + " sent");
    })
}

const loadHTMLContent = function(elmnt, promiseId, HTMLcontent) {
    console.log("HTML content " + promiseId + " loading");
    elmnt.innerHTML = HTMLcontent;
}

const loadFunctionality = function(elmnt, promiseId) {
    let loadCB = elmnt.getAttribute("loadcb");
    console.log("HTML functionality " + promiseId + " loading - " + loadCB);
    if (loadCB && window[loadCB]) {
        window[loadCB]();
        elmnt.removeAttribute("loadCB");
    }
}



// for debugging in console:
/*
[...document.querySelectorAll("[include-html]")].map((el)=>{return promiseHTMLContent(el, file)});
//runs the promises
Promise.all(myPromises)
//load the html content
.then(loadHTMLContent)
//add functionality
.then(loadFunctionality)
//error
.catch(handleRejectedPromise);
*/
