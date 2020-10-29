/* Directories */
//create sections
const addSections = function(parent, directory) {
    let sectEl = document.createElement('section');
    sectEl.classList.add("gallery-section");

    let hr = document.createElement('hr');

    let h = document.createElement("h2");
    let header = capitalizeFirstLetter(chop(directory))
    h.innerText = header;

    let div = document.createElement("div");
    div.classList.add("gallery-inner");

    sectEl.append(hr);
    sectEl.append(h);
    sectEl.append(div);
    parent.append(sectEl);
    return div
}

//returns an array of directories
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
    let btn = document.createElement("button");
    btn.classList.add("image-wrapper");


    let imgEl = document.createElement('img');
    imgEl.src = src;
    
    let fileName = decodeURI(src.split('\\').pop().split('/').pop()).replace("_", " ");
    console.log(fileName);
    let p = document.createElement("p");
    p.innerText = fileName;


    btn.append(imgEl);
    btn.append(p);
    parent.append(btn);

    
    let width = imgEl.offsetWidth;
    console.log(width);
    btn.style.width = width+"px";
    btn.addEventListener("click", showModal);
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


var loadSection = function() {

}

//loads a gallery
var loadGallery = function(parentSelector, gallery) {
    //control
    var selectEl = document.querySelector("#controls select");

    getDirectories("images/")
    .then((directories) => {
        directories.forEach((directory) => {
            var option = document.createElement("option");
            directoryName = chop(directory);
            option.value = directoryName;
            option.innerText = capitalizeFirstLetter(directoryName);
            selectEl.append(option);
            selectEl.value = gallery;
        });
    });


    //gallery sections
    var galleryPath = "images/"+encodeURIComponent(gallery)+"/";
    var galleryEl = document.querySelector(parentSelector);
    getDirectories(galleryPath)
         
    .then((directories) =>{
        console.log(directories);
        directories.forEach((directory) => {
            var directoryPath = galleryPath + directory;
            
            console.log(directoryPath);
            sectionEl = addSections(galleryEl, directory);
            getimages(directoryPath).then((files) => {
                console.log(files);
                files.forEach((file) => {
                    var filePath = directoryPath + file;
                    console.log(filePath);
                    loadImage(filePath).then((img) => {
                        console.log(img);
                        addImg(sectionEl, filePath);
                    })
                });
            });
        });
    });
} 
    
//Changes the gallery
var handleGalleryChange = function() {
    console.log(event)
    gallery = event.target.value;
    document.location.search = "?gallery="+gallery;
    // loadGallery("article.gallery", gallery);
} 


const galleryCB = function() {
    console.log("Gallery script ran")
    let searchParams = new URLSearchParams(window.location.search);
    let gallery = searchParams.get("gallery");
    loadGallery("article.gallery", gallery);
}