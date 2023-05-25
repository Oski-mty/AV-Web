//-----------------------IMPORTACIONES-----------------------------------//

import {auth} from "../FireBase.js";


//-----------------------DECLARACIÓN DE VARIABLES-----------------------------------//

//NAV
let appNav = document.querySelector("#appNav");
let generalNav = document.querySelector("#generalNav");
let webDocNav = document.querySelector("#webNav");
let apkDocNav = document.querySelector("#apkNav");
//DIVs
let app = document.querySelector("#appDiv");
let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");
let loadingDiv = document.querySelector("#loading-page");
//BOTONES
let btnLogOut = document.querySelector("#btnLogOut");


//------------------------------EVENTOS-----------------------------------//

//EVENTOS SPA (Single-Page-Aplication)
appNav.addEventListener("click",showApp);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
//EVENTOS DE BOTONES
btnLogOut.addEventListener("click",logOut);


//------------------------------FUNCIONES-----------------------------------//

//FUNCIONES DE EVENTOS SPA (Single-Page-Aplication)
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
function showLoading(){
    loadingDiv.classList.remove("d-none"); 
    setTimeout(()=>{loadingDiv.classList.add("d-none")},4000);
}

//FUNCIONES DE FIREBASE AUTH
async function logOut(){
    try{
        await auth.signOut();
    }catch(error){
        console.log(error);
    }
}

auth.onAuthStateChanged ( user =>{
    if(user){
        console.log("Usuario activo");
    }else{
        window.location.href = "http://127.0.0.1:5500/App%20Web/Login/login.html";
    }
});


//------------------------------MAIN-----------------------------------//

showLoading();