//-----------------------IMPORTs-----------------------------------//

import {auth} from "../FireBase.js";
import {db} from "../FireBase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


//-----------------------DECLARATION OF VARIABLEs-----------------------------------//


//FORMS
let addSubjectForm = document.querySelector("#addSubjectForm");
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
let btnopenAddSubjectModal = document.querySelector("#openAddSubjectModal");
let btnAddSubject = document.querySelector("#addSubject");


//------------------------------EVENTs-----------------------------------//

//SPA EVENTs (Single-Page-Aplication)
appNav.addEventListener("click",showApp);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
//BUTTONs EVENTs
btnLogOut.addEventListener("click",logOut);
//FORMs EVENTs
addSubjectForm.addEventListener("submit",addSubject)
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
auth.onAuthStateChanged ( async user =>{

    if (user) {
        console.log("Usuario activo");
        if (user.emailVerified) {
            console.log("Usuario activo y verificado");           
        }else{
            window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
        }
    } else {
        console.log("Usuario Inactivo");
        window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
    }
});

//FIREBASE FIRESTORE DB
async function addSubject(e){

    e.preventDefault();
    let subjectName = addSubjectForm["subjectName"].value;
      
    try {
        await addDoc(collection(db, "users/"+auth.currentUser.email+"/asignaturas"), subjectName , {nombre:subjectName});
    }catch (error) {
        console.error("Error adding document: ", error);
    }
    addSubjectForm.reset();
}

//------------------------------MAIN-----------------------------------//

showContenido();    
