/* Directories */
//create sections
const addSections = function(parent, header) {
    let sectEl = document.createElement('section');
    sectEl.classList.add("gallery-section");

    let h = document.createElement("h1");
    h.innerText = header;

    let div = document.createElement("div");
    div.classList.add("gallery-inner");

    sectEl.append(h);
    parent.append(sectEl);
}


const getDirectories = function(dpath) {
    return new Promise((resolve, reject) => {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    paths = JSON.parse(this.responseText);
                    console.log(paths)
                    resolve(paths);
                    console.log("HTTP request to " + dpath + " finished");
                }
                if (this.status == 404) {
                    reject("404 - Resource not found.")
                    console.log("HTTP request to " + dpath + " failed");
                }
            }
        }
        xhttp.open("POST", "AJAX/getDirectories.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("path="+dpath);
        console.log("HTTP request to " + dpath + " sent");
    });
}


/* Images */

//appends the image to the page
const addImg = function(parent, src) {
    let div = document.createElement("div");
    div.classList.add("image-wrapper");

    let imgEl = document.createElement('img');
    
    let fileName = decodeURI(src.split('\\').pop().split('/').pop()).replace("_", " ");
    console.log(fileName);
    let p = document.createElement("p");
    p.innerText = fileName;

    imgEl.src = src;

    div.append(p);
    div.append(imgEl);
    parent.append(div);
}

//get img sources
const getimages = function(dpath) {
    return new Promise((resolve, reject) => {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    paths = JSON.parse(this.responseText);
                    console.log(paths)
                    resolve(paths);
                    console.log("HTTP request to " + dpath + " finished");
                }
                if (this.status == 404) {
                    reject("404 - Resource not found.")
                    console.log("HTTP request to " + dpath + " failed");
                }
            }
        }
        xhttp.open("POST", "AJAX/getImgSrcs.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("path="+dpath);
        console.log("HTTP request to " + dpath + " sent");
    });
}

//loads individual images
const loadImage = function(url) {
    return new Promise((resolve, reject) => {
        let img = new Image()

        img.onload = function() {
            resolve(img)
        }

        img.onerror = function() {
            let msg = 
                "Could not load image at " + url;
            reject(new Error(msg));
        }
        img.src = url
    })
}


//loads a gallery
const loadGallery = function(parentSelector, gallery) {
    let parentEl = document.querySelector(parentSelector);
    getDirectories("images/"+encodeURIComponent(gallery)+"/").then((directories) =>{
        console.log(directories);
        directories.forEach((directory) => {
            getimages(directory).then((paths) => {
                console.log(paths);
                paths.forEach((path) => {
                    loadImage(path).then((img) => {
                        console.log(img);
                        addImg(parentEl, img.src);
                    })
                });
            });
        });
    });
} 
    