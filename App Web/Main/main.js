//-----------------------IMPORTs-----------------------------------//

import {auth} from "../FireBase.js";
import {db} from "../FireBase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc ,
    query,
    where,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


//-----------------------DECLARATION OF VARIABLEs-----------------------------------//


//USEREMAIL
let userEmail;

//FORMs
let addSubjectForm = document.querySelector("#addSubjectForm");

//NAV
let appNav = document.querySelector("#appNav");
let generalNav = document.querySelector("#generalNav");
let webDocNav = document.querySelector("#webNav");
let apkDocNav = document.querySelector("#apkNav");

//NAV BUTTONs
let btnLogOut = document.querySelector("#btnLogOut");
let theme = document.querySelector("#theme");

//DIVs
let contenido = document.querySelector("#Contenido");
let app = document.querySelector("#appDiv");
let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");
let loadingDiv = document.querySelector("#loading-page");

//CANVAs
let subjectsCanvas = document.querySelector("#subjectsCanvas");



//------------------------------EVENTs-----------------------------------//

//SPA EVENTs (Single-Page-Aplication)
appNav.addEventListener("click",showApp);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
//BUTTONs EVENTs
btnLogOut.addEventListener("click",logOut);
theme.addEventListener("click",changeTheme);

//FORMs EVENTs
addSubjectForm.addEventListener("submit",addSubject)


//------------------------------FUNCTIONs-----------------------------------//

//Change theme dark/light
function changeTheme() {

    var link = document.getElementById("theme-link");
    var themeToggle = document.getElementById("theme");
  
    if (link.getAttribute("href") === "styles.css") {
      link.setAttribute("href", "stylesDark.css");
    } else {
      link.setAttribute("href", "styles.css");
    }
}



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

function showContent(){

    setTimeout(
        ()=>{
            loadingDiv.classList.add("d-none");
            contenido.classList.remove("d-none");
        },500);
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

            subjectsCanvas.innerHTML += 
                '<div id="card-'+subject.name+'" class="card btn col-md-3 mx-3 my-2 p-1 appCard">' +
                    '<div class="d-flex justify-content-left">' +
                        '<button id="update-'+subject.name+'-modal" type="button" class="btn fadedPencil options" data-bs-toggle="modal" data-bs-target="#updateSubjectModal"><i class="bi bi-pencil"></i></button>' +
                    '</div>' +
                    '<div class="card-body my-4">' +
                        '<h5 class="card-title"><i class="bi bi-journal-bookmark"></i> ' + subjectName + '</h5>' +
                        '<p class="card-text"><i class="bi bi-person-add"></i> ' + subjectTeacher + '</p>' +
                    '</div>' +
                    '<div class="d-flex flex-row-reverse">' +
                        '<button id="delete-'+subject.name+'-modal" type="button" class="btn fadedTrash options" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal"><i class="bi bi-trash3"></i></button>' +
                    '</div>' +
                '</div>'+

                '<div class="modal fade" id="updateSubjectModal" tabindex="-1" aria-labelledby="updateSubjectModalLabel"aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto" id="updateSubjectModalLabel">Update Subject</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<form id="updateSubjectForm-'+subject.name+'">'+
                                    '<div class="input-group mb-3 w-75 mx-auto align-items-center">'+
                                        '<input id="updateSubjectName-'+subject.name+'" value="'+subject.name+'" type="text" class="form-control" placeholder="Name"aria-label="updateSubjectName'+subject.name+'" aria-describedby="updateSubjectName'+subject.name+'" required>'+
                                        '<span class="input-group-text" id="subjectName'+subject.name+'"><i class="bi bi-journal-bookmark"></i></span>'+
                                        '<input id="updateSubjectTeacher-'+subject.name+'" value="'+subject.teacher+'" type="text" class="form-control" placeholder="Teacher name"aria-label="updateSubjectTeacher'+subject.teacher+'" aria-describedby="updateSubjectTeacher'+subject.teacher+'" required>'+
                                        '<span class="input-group-text" id="subjectTeacher'+subject.teacher+'"><i class="bi bi-person-add"></i></span>'+
                                    '</div>'+
                                    '<div class="text-center pt-1 pb-1">'+
                                        '<button type="button" id="updateSubject-'+subject.name+'" class="faded p-2 rounded-4">UPDATE <i class="bi bi-wrench-adjustable-circle"></i></button>'+
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


                '<div class="modal fade" id="deleteSubjectModal" tabindex="-1" aria-labelledby="deleteSubjectModalLabel"aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto" id="deleteSubjectModalLabel">Delete Subject</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div class="text-center pt-1 pb-1">'+
                                    '<button type="button" id="deleteSubject-'+subject.name+'" class="fadedTrash p-2 rounded-4">DELETE <i class="bi bi-journal-x"></i></button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
        }

        subjectsCanvas.addEventListener("click", function(event) {

            if (event.target.id.split("-")[0] === "deleteSubject") {
                deleteSubject(event);
            }else if(event.target.id.split("-")[0] === "updateSubject"){
                updateSubject(event);
            }else if(event.target.id.split("-")[0] === "card"){
                
            }
        });
               
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



//FIRESTORE <UPDATE>

async function deleteSubject(button){

    try{
        let idSubject = button.target.id.split("-")[1];
        
        await deleteDoc(doc(db,"users/" + userEmail + "/asignaturas", idSubject));
        console.info("Subject: "+idSubject+" has been deleted succesfully");


        try {
            const q = query(collection(db, "users/" + userEmail + "/asignaturas"), where("name", "==", idSubject));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
    
                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/asignaturas", documentSnapshot.id);
    
                await deleteDoc(documentRef);
    
                console.log("Documento borrado exitosamente");
            } else {
                console.error("No se encontró ningún documento que coincida con la consulta");
            }
    
        } catch (error) {
            console.error("Error al borrar el documento:", error);
        }

        const cerrarModal = document.querySelector(".modal-backdrop");
        cerrarModal.remove();

        getSubjects();
        
    }catch(error){
        console.error(error);
    } 
}



//FIRESTORE <DELETE>

async function updateSubject(button) {

    try {

        let idSubject = button.target.id.split("-")[1];
        let newName = document.querySelector("#updateSubjectName-" + idSubject).value;
        let newTeacher = document.querySelector("#updateSubjectTeacher-" + idSubject).value;

        try {
            const q = query(collection(db, "users/" + userEmail + "/asignaturas"), where("name", "==", idSubject));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/asignaturas", documentSnapshot.id);

                await updateDoc(documentRef, {
                    name: newName,
                    teacher: newTeacher
                });

                console.log("Documento actualizado exitosamente");
            } else {
                console.error("No se encontró ningún documento que coincida con la consulta");
            }

        } catch (error) {
            console.error("Error al actualizar el documento:", error);
        }

        const cerrarModal = document.querySelector(".modal-backdrop");
        cerrarModal.remove();

        getSubjects();

    } catch (error) {
        console.error(error);
    }
}
    

//------------------------------MAIN-----------------------------------//

showContent();