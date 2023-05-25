"use strict";

//DECLARACIÓN DE VARIABLES
const appNav = document.querySelector("#appNav");
const generalNav = document.querySelector("#generalNav");
const webDocNav = document.querySelector("#webNav");
const apkDocNav = document.querySelector("#apkNav");

let app = document.querySelector("#appDiv");
let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");

//EVENTOS SPA
appNav.addEventListener("click",showApp);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);

function showApp(){

    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
}

function showGeneralNav(){

    app.style.display = "none";
    generalDoc.style.display = "block";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
}

function showWebDoc(){

    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "block";
}

function showApkDoc(){

    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "block";
    webDoc.style.display = "none";
}


