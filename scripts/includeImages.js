const imageFolder = "images/";

function* iterGenerator(directories) { 
    for (directory of directories) {
        yield directory;
    }
}

const Gallery = function(name, selector, path) {
    this.name = name;
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.path = path;
    this.sections = [];
    this.sectionIter;
    this.nextSection;

    /*Component Constructors*/
    const Section = function(gallery, dir) {
        this.gallery = gallery;
        this.name = chop(dir);
        this.selector;
        this.dir = dir;
        this.path = gallery.path + dir;
        this.images = [];
        this.isAdded = false;
        this.isPlaceHeld = false;
        this.el = (() => {
            let sectEl = document.createElement('section');
            sectEl.classList.add("gallery-section");
    
            let hr = document.createElement('hr');
    
            let h = document.createElement("h2");
            let header = capitalizeFirstLetter(this.name);
            h.innerText = header;
    
            let div = document.createElement("div");
            div.classList.add("gallery-inner");
            this.inner = div;
    
            sectEl.append(hr);
            sectEl.append(h);
            sectEl.append(div);
            return sectEl;
        })();
        
        this.add = () => {
            this.load();
            this.gallery.el.append(this.el);
        }
        this.insert = () => {
            this.load();
            this.gallery.el.insertBefore(this.el, this.placeholderEl);
            this.gallery.el.removeChild(this.placeholderEl);
        }
        this.holdPlace = () => {
            this.isPlaceHeld = true;

            this.placeholderEl = document.createElement("section");
            this.placeholderEl.classList.add("gallery-placeholder");
    
            let h = document.createElement("h2");
            let header = capitalizeFirstLetter(this.name);
            h.innerText = "Click to load " + header;
            
            this.placeholderEl.append(h);
            this.gallery.el.append(this.placeholderEl);
            
            this.placeholderEl.addEventListener("click", this.insert);
        }

        

        this.load = () => {    
            // console.log(this.path);
            //append section element to the gallery
            this.isAdded = true;
            mainGallery.updateNextBtn();
            getimages(this.path).then((files) => {
                // console.log(files);
                files.forEach((file) => {
                    var filePath = this.path + file;
                    // console.log(filePath);
                    loadImage(filePath).then((img) => {
                        // console.log(img);
                        addImg(this.inner, filePath);
                    })
                });
            });
        }
        
    
    }

    /*Methods*/
    this.load = () => {

        //gallery info
    
        /*controls*/
        //populate the gallery selector
        getDirectories(imageFolder)
        .then((directoryNames) => {
            populateSelectEl("#controls #gallery-selector", directoryNames, this.name, chop)
        });
             
        //populate the section selector
        getDirectories(this.path) //returns an array of sub folders at this path
        .then((sectionNames) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            this.sections = sectionNames.map((sectionDir) => {
                return (sectionName = new Section(this, sectionDir));
            });
            console.log(this.sections);
            populateSelectEl("#controls #section-selector", sectionNames, "Jump To Section", chop)
        });
    
        //loads gallery
        getDirectories(this.path)
        .then((directories) =>{
            //tracks what sections were loaded
            this.sectionIter = iterGenerator(this.sections);
            this.nextSection = this.sectionIter.next();

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
        console.log(this.nextSection);
        if (this.nextSection.done == false) {
            
            if (this.nextSection.value.isAdded == true) {
                while (this.nextSection.value.isAdded == true) {
                    this.nextSection = this.sectionIter.next();
                }
            }
            else {
                if (this.nextSection.value.isPlaceHeld == true) {
                    this.nextSection.value.insert();
                }
                else {
                    this.nextSection.value.add();
                }
            }
            this.nextSection = this.sectionIter.next();
        }
    
        //disable subsequent clicks
    }

    this.getSection = (sectionName) => {
        return this.sections.find((section)=>{
            return (section.name == sectionName);
        })
    }

    this.updateNextBtn = () => {
        if (this.nextSection.done == true || this.sections.every((section) => {return (section.isAdded || section.isPlaceHeld)})) {
            document.querySelector("#load-next-section").setAttribute("disabled","");
        }
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
    // console.log(fileName);
    let p = document.createElement("p");
    p.innerText = fileName;

    let imgEl = document.createElement('img');
    imgEl.alt = fileName;
    imgEl.src = src;

    btn.append(imgEl);
    btn.append(p);
    parent.append(btn);
    // console.log(parent);

    
    let width = imgEl.offsetWidth;
    // console.log(width);
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
                    // console.log(paths)
                    resolve(paths);
                    // console.log("HTTP request to " + dpath + " finished");
                }
                if (this.status == 404) {
                    reject("404 - Resource not found.")
                    // console.log("HTTP request to " + dpath + " failed");
                }
            }
        }
        xhttp.open("POST", "AJAX/getImgSrcs.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("path="+dpath);
        // console.log("HTTP request to " + dpath + " sent");
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
    let sectionName = event.target.value;
    let sectionObj = mainGallery.getSection(sectionName)
    if (sectionObj.isAdded === false) {
        // let sectionDir = event.target.value+"/";
        // let sectionPath = imageFolder+encodeURIComponent(mainGallery.name)+"/"+sectionDir;

        // loadedSections = [...mainGallery.el.querySelectorAll(".gallery-section")].indexOf(sectionObj)


        //makes placeholders for missing gallery sections
        let indexOfSection = mainGallery.sections.indexOf(sectionObj)
        console.log("idex of sectionObj = " + indexOfSection);
        for (let i = 0; i < indexOfSection; i++) {
            if (mainGallery.sections[i].isAdded === false && mainGallery.sections[i].isPlaceHeld === false) {
                console.log("placeheld");
                mainGallery.sections[i].holdPlace(mainGallery.sections[i])
            }
        }

        if (sectionObj.isPlaceHeld) {
            sectionObj.insert();
        }
        else {
            sectionObj.add();
        }

        // mainGallery.loadSection(sectionPath, sectionDir); //Needs to be updated to work for multiple galleries
    }
    else {
        console.log("already added");
    }
    let tempFunct = function() {
        sectionObj.el.scrollIntoView({ behavior: 'smooth', block: 'start'})
    }
    setTimeout(tempFunct, 200);
    
    
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

var resetSelectionSelector;

window.addEventListener(
    "load", 
    ()=>{
        const sectionSelector = document.querySelector("#section-selector");
        resetSelectionSelector = function() {
            console.log("scroll");
            sectionSelector.value = "Jump To Section";
        }
        document.addEventListener("scroll", resetSelectionSelector);
    }
);
