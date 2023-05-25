//-----------------------IMPORTs-----------------------------------//

import {auth} from "../FireBase.js";


//-----------------------DECLARATION OF VARIABLEs-----------------------------------//

//NAV
let appNav = document.querySelector("#appNav");
let generalNav = document.querySelector("#generalNav");
let webDocNav = document.querySelector("#webNav");
let apkDocNav = document.querySelector("#apkNav");
//DIVs
let contenido = document.querySelector("#Contenido");
let app = document.querySelector("#appDiv");
let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");
let loadingDiv = document.querySelector("#loading-page");
//BUTTONs
let btnLogOut = document.querySelector("#btnLogOut");


//------------------------------EVENTs-----------------------------------//

//SPA EVENTs (Single-Page-Aplication)
appNav.addEventListener("click",showApp);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
//BUTTONs EVENTs
btnLogOut.addEventListener("click",logOut);

//------------------------------FUNCTIONs-----------------------------------//

//SPA EVENTs FUNCTIONs
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
function showContenido(){

    setTimeout(
        ()=>{
            loadingDiv.classList.add("d-none");
            contenido.classList.remove("d-none");
        },100);
}
//FIREBASE AUTH FUNCTIONs
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
        window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
    }
});


//------------------------------MAIN-----------------------------------//

showContenido();    