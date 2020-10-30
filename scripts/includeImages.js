const imageFolder = "images/";

function* directoryGenerator(directories) { 
    for (directory of directories) {
        yield directory;
    }
}

var directoryIterator;


const Gallery = function(name, selector, path) {
    this.name = name;
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.path = path;
    this.dirIter;
    this.nextDir;
    this.sections = [];


    /*methods*/
    this.load = () => {

        //gallery info
    
        /*controls*/
        //populate the gallery selector
        getDirectories(imageFolder)
        .then((directories) => {
            populateSelectEl("#controls #gallery-selector", directories, this.name, chop)
        });
             
        //populate the section selector
        getDirectories(this.path) //returns an array of sub folders at this path
        .then((sections) => {
            populateSelectEl("#controls #section-selector", sections, this.name, chop)
        });
    
        //loads gallery
        getDirectories(this.path)
        .then((directories) =>{
            //tracks what sections were loaded
            this.dirIter = directoryGenerator(directories);
            this.nextDir = this.dirIter.next();
            this.loadNextSection();
        });
    } 



    /* Directories */
    //create sections
    this.addSection = (directory) => {
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
        this.el.append(sectEl);
        return div
    }



    this.loadNextSection = () => {
        let directory = this.nextDir.value;
        let directoryPath = this.path + directory;
        if (directory) {
            this.loadSection(directoryPath, directory);
        }
        this.nextDir = this.dirIter.next();
    
        //disable subsequent clicks
        console.log(this.nextDir);
        if (this.nextDir.done == true) {
            document.querySelector("#load-next-section").setAttribute("disabled","");
        }
    }
    
    

    this.loadSection = (directoryPath, directory) => {    
        console.log(directoryPath);
        sectionEl = this.addSection(directory);
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
    }
    
}




/* Directories */
//create sections
const addSection = function(parent, directory) {
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

    let fileName = decodeURI(src.split('\\').pop().split('/').pop()).replace("_", " ");
    console.log(fileName);
    let p = document.createElement("p");
    p.innerText = fileName;

    let imgEl = document.createElement('img');
    imgEl.alt = fileName;
    imgEl.src = src;

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

/*controls*/
var populateSelectEl = function(selector, options, value, processor) {
    var selectEl = document.querySelector(selector);
        options.forEach((option) => {
        var optionEl = document.createElement("option");
        optionName = processor(option);
        optionEl.value = optionName;
        optionEl.innerText = capitalizeFirstLetter(optionName);
        selectEl.append(optionEl);
    });
    if (value == false) {
        selectEl.value = "select 1";
    }
    else {
        selectEl.value = value;
    }
}


//Changes the gallery
var handleGalleryChange = function() {
    console.log(event)
    gallery = event.target.value;
    document.location.search = "?gallery="+gallery;
} 

//Changes the gallery section
var handleSectionChange = function() {
    console.log(event)
    let sectionDir = event.target.value+"/";
    let sectionPath = imageFolder+encodeURIComponent(mainGallery.name)+"/"+sectionDir;
    mainGallery.loadSection(sectionPath, sectionDir); //Needs to be updated to work for multiple galleries
    
} 

var handleLoadNextSection = function() {
    console.log(event)
    mainGallery.loadNextSection(); //Needs to be updated to work for multiple galleries
}

//runs the loadGallery script in the page load callback
const galleryCB = function() {
    console.log("Gallery script ran")
    let searchParams = new URLSearchParams(window.location.search);
    let galleryName = searchParams.get("gallery");

    var galleryPath = imageFolder+encodeURIComponent(galleryName)+"/";
    mainGallery = new Gallery(galleryName, "article.gallery", galleryPath)

    mainGallery.load()

}