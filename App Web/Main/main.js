//-----------------------IMPORTs-----------------------------------//

import {auth} from "../FireBase.js";
import {db} from "../FireBase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDocs,
    query,
    where,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


//-----------------------DECLARATION OF VARIABLEs-----------------------------------//


//USEREMAIL
let userEmail;
//SUBJECTS

//TASKS

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
//CANVAS
let subjectsCanvas = document.querySelector("#subjectsCanvas");



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
    getSubjects();
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



//LOGOUT
async function logOut(){
    try{
        await auth.signOut();
    }catch(error){
        console.log(error);
    }
}



//AUTH ONCHANGE OBSERVER
auth.onAuthStateChanged ( async user =>{
    
    if (user) {
        console.debug("Usuario activo");

        if (user.emailVerified) {
            console.debug("Usuario verificado");

            try {

                //Saving userEmail
                userEmail = auth.currentUser.email;
                //ADD NEW USER
                addingUser();


            }catch (error) {
                console.error(error);
            }           
        }else{
            console.debug("Usuario no verificado");
            window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
        }
    } else {
        console.debug("Usuario Inactivo");
        window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
    }

});



//FIRESTORE <CREATE>

async function addingUser(){

    try{
        let provider = await auth.currentUser.providerData;
        let providerId = [];

        provider.forEach(element => {

            if (element.providerId == "google.com") {

                providerId.push("GOOGLE");

            } else if (element.providerId == "password") {

                providerId.push("BASIC");

            } else {
                console.log("Provider encontrado que no coincide con Google ni Password");
            }
        });

        await setDoc(doc(db, "users/", userEmail), { provider: providerId }, { merge: true });
        console.info("User merge successfully");

    }catch(error){
        console.error("Error adding user: ",error);
    } 
} 

async function addSubject(e){

    e.preventDefault();

    try {

        let subjectName = addSubjectForm["subjectName"].value;
        let teacher = addSubjectForm["subjectTeacher"].value;

        await setDoc(doc(db, "users/" + userEmail + "/asignaturas", subjectName), { name: subjectName, teacher: teacher }, { merge: true });

        addSubjectForm.reset();
        getSubjects();
        
    } catch (error) {
        console.error("Error adding subject: ", error);
    }

    
}

async function addTask(e){
    
    

     
}



//FIRESTORE <READ>

async function getSubjects(){
    try {

        let subjectsRetrieved = [];
        const q = query(collection(db, "users/" + userEmail + "/asignaturas")/*, where("state", "==", "CA")*/);
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            subjectsRetrieved.push(doc.data());
        });
            
        console.info("Subjects retrieved successfully");
        printSubjects(subjectsRetrieved);

    } catch (error) {
        console.error("Error getting subjects: ",error);
    }
    
}
//Print Subjects
function printSubjects(subjects){
    try{
        subjectsCanvas.innerHTML = "";  
        for (const subject of subjects) {

            let arr = String(subject.teacher).split(" ");

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            
            }
            let subjectTeacher = arr.join(" ");
            let subjectName = String(subject.name).toUpperCase();

            subjectsCanvas.innerHTML += '<div class="card btn col-md-3 mx-3 my-2 p-1 appCard">'+
                                            '<div class="d-flex justify-content-left">'+
                                                '<button type="button" class="btn fadedPencil options"><i class="bi bi-pencil"></i></button>'+
                                            '</div>'+
                                            '<div class="card-body my-4">'+
                                                '<h5 class="card-title"><i class="bi bi-journal-bookmark"></i> '+subjectName+'</h5>'+
                                                '<p class="card-text"><i class="bi bi-person-add"></i> '+subjectTeacher+'</p>'+
                                            '</div>'+
                                            '<div class="d-flex flex-row-reverse">'+
                                                '<button type="button" class="btn fadedTrash options"><i class="bi bi-trash3"></i></button>'+
                                            '</div>'+
                                        '</div>';
        }
               
    }catch(error){
        console.error("Error printing subjects: ",error);
    }
}

async function getTasks(){
    const q = query(collection(db, "users/" + userEmail + "/asignaturas/"+currentSubject+"/tareas")/*, where("state", "==", "CA")*/);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let tasksRetrieved = [];
        querySnapshot.forEach((doc) => {
            tasksRetrieved.push(doc.data());
        });
        tasks = tasksRetrieved;
    });
}



//------------------------------MAIN-----------------------------------//

showContenido();


