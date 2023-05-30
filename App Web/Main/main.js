//-----------------------IMPORTs-----------------------------------//

import {auth} from "../FireBase.js";
import {db} from "../FireBase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    query,
    where,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


//-----------------------DECLARATION OF VARIABLEs-----------------------------------//

//SUBJECTS
let subjects = [] ;
let currentSubject="currentSubject";
//TASKS
let tasks = [] ;
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
    writeSubjects();
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

//FIRESTORE <CREATE>

async function addSubject(e){

    e.preventDefault();

    auth.onAuthStateChanged ( async user =>{

        let subjectName = addSubjectForm["subjectName"].value;
        let teacher = addSubjectForm["subjectTeacher"].value;
        try {
            await setDoc(doc(db,"users/"+user.email+"/asignaturas", subjectName),{name:subjectName , teacher:teacher},{merge: true});
        }catch (error) {

            console.error("Error adding document: ", error);
        }
        addSubjectForm.reset();
        console.log(subjects);
    });
}

async function addTask(){
    
    

     
}

//FIRESTORE <READ>

auth.onAuthStateChanged ( async user =>{
    
    if (user) {
        console.debug("Usuario activo");

        if (user.emailVerified) {
            console.debug("Usuario verificado");

            try {

                //ADDING NEW USER
                async function addingUser(){
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

                    await setDoc(doc(db, "users/", auth.currentUser.email), { provider: providerId }, { merge: true });
                }
                addingUser();
                console.info("User merge successfully");
                //READING SUBJECTS
                async function getSubjects(){
                    const q = query(collection(db, "users/" + user.email + "/asignaturas")/*, where("state", "==", "CA")*/);
                    const unsubscribe = onSnapshot(q, (querySnapshot) => {
                        let subjectsRetrieved = [];
                        querySnapshot.forEach((doc) => {
                            subjectsRetrieved.push(doc.data());
                        });
                        subjects = subjectsRetrieved;
                    });
                }
                getSubjects();
                console.info("Subjects retrieved successfully");
                //READING TASKS
                async function getTasks(){
                    const q = query(collection(db, "users/" + user.email + "/asignaturas/"+currentSubject+"/tareas")/*, where("state", "==", "CA")*/);
                    const unsubscribe = onSnapshot(q, (querySnapshot) => {
                        let tasksRetrieved = [];
                        querySnapshot.forEach((doc) => {
                            tasksRetrieved.push(doc.data());
                        });
                        tasks = tasksRetrieved;
                    });
                }
                getTasks();
                console.info("Tasks retrieved successfully");

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

function writeSubjects(){
    subjects.forEach(subject => {
        subjectsCanvas.innerHTML = '<div class="card col-3 mx-2 my-5 text-center appCard">'+
                                    '<div class="card-body my-4"><h5 class="card-title"><i class="bi bi-journal-bookmark"></i> '+subject.name+'</h5>'+
                                    '<p class="card-text"><i class="bi bi-person-add"></i> '+subject.teacher+'</p>'+
                                    '<a href="#" class="btn faded rounded-4 mt-3">Ver asignatura</a>'+
                                    '</div>'+
                                    '<button type="button" class="d-inline rounded-5 faded"><i class="bi bi-pencil"></i></button>'+
                                    '<button type="button" class="d-inline rounded-5 faded"><i class="bi bi-trash3"></i></button>'+
                                    '</div>';
    });
}





//------------------------------MAIN-----------------------------------//

showContenido();


