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

let currentSubjectId;

//USEREMAIL
let userEmail;

//FORMs
let addSubjectForm = document.querySelector("#addSubjectForm");
let addTaskForm = document.querySelector("#addTaskForm");

//NAV
let appNav = document.querySelector("#appNav");
let generalNav = document.querySelector("#generalNav");
let webDocNav = document.querySelector("#webNav");
let apkDocNav = document.querySelector("#apkNav");
//nav buttons
let btnLogOut = document.querySelector("#btnLogOut");
let theme = document.querySelector("#theme");

//DIVs/LAYOUTSs
let contenido = document.querySelector("#Contenido");
let app = document.querySelector("#appDiv");

let subjectsLayout= document.querySelector("#subjectsLayout");
let subjectsCanvas = document.querySelector("#subjectsCanvas");
let tasksLayout = document.querySelector("#tasksLayout");
let tasksCanvas = document.querySelector("#tasksCanvas");

let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");

let loadingDiv = document.querySelector("#loading-page");
let loadingTasks = document.querySelector("#loadingTasks");

//BUTTONs
let goToSubjects = document.querySelector("#goToSubjects");





//------------------------------EVENTs-----------------------------------//

//SPA EVENTs (Single-Page-Aplication)
appNav.addEventListener("click",showSubjectsLayout);
generalNav.addEventListener("click",showGeneralNav);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
//BUTTONs EVENTs
btnLogOut.addEventListener("click",logOut);
theme.addEventListener("click",changeTheme);
goToSubjects.addEventListener("click",showSubjectsLayout);
//FORMs EVENTs
addSubjectForm.addEventListener("submit",addSubject)
addTaskForm.addEventListener("submit",addTask)

//------------------------------FUNCTIONs-----------------------------------//

//THEME
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
function showGeneralNav(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "block";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
}
function showWebDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "block";
}
function showApkDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
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
        },1000);
}
async function showSubjectsLayout(event){
    showLoading();
    subjectsLayout.style.display = "block";
    tasksLayout.style.display = "none";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    await getSubjects(event);
    unShowLoadingSubjects();
}
async function showTasksLayout(subjectId){
    showLoading();
    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "block";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    await getTasks(subjectId);
    unShowLoadingTasks();
}


function showLoading(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    loadingTasks.classList.remove("d-none")
    loadingTasks.classList.add("d-flex")
}
function unShowLoadingTasks(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "block";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    loadingTasks.classList.remove("d-flex")
    loadingTasks.classList.add("d-none")  
}
function unShowLoadingSubjects(){

    subjectsLayout.style.display = "block";
    tasksLayout.style.display = "none";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    loadingTasks.classList.remove("d-flex")
    loadingTasks.classList.add("d-none")  
}


//LOGOUT
async function logOut(){
    console.debug("logOut()...");
    try{
        await auth.signOut();
    }catch(error){
        console.log(error);
    }
    console.debug("logOut()...Completed");
}

//AUTH ONCHANGE OBSERVER
auth.onAuthStateChanged ( async user =>{
    
    if (user) {
        console.info("Active user");

        if (user.emailVerified) {
            console.info("Verified user");

            try {

                //Saving userEmail
                userEmail = auth.currentUser.email;
                //ADD NEW USER
                addingUser();


            }catch (error) {
                console.error(error);
            }           
        }else{
            console.error("Unverified user");
            window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
        }
    } else {
        console.error("Inactive user");
        window.location.href = "http://localhost:5500/App%20Web/Login/login.html";
    }

});

//SET CURRENT SUBJECT
async function setCurrentSubjectId(event){

    console.debug("setCurrentSubjectId()...");
    
    try {

        let nameSubject = event.target.id.split("-")[1];

        const q = query(collection(db, "users/" + userEmail + "/subjects"), where("name", "==", nameSubject));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {

            const documentSnapshot = querySnapshot.docs[0];

            currentSubjectId = documentSnapshot.id;

        } else {
            console.error("No subject found matching the query");
        }

    } catch (error) {
        console.error(error);
    }

    console.debug("setCurrentSubjectId()...Completed");
}



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
    console.debug("addSubject()...");
    e.preventDefault();

    try {

        let subjectName = addSubjectForm["subjectName"].value;
        let teacher = addSubjectForm["subjectTeacher"].value;
        await addDoc(collection(db, "users/" + userEmail + "/subjects"), { name: subjectName, teacher: teacher }, { merge: true });
        addSubjectForm.reset();
        console.info("Subject added successfully");
        await showSubjectsLayout();
        console.info("Subject printed successfully");

    } catch (error) {
        console.error("Error adding subject: ", error);
    }
    console.debug("addSubject()...Completed");
}

async function addTask(e){
    console.debug("addTask()...");
    e.preventDefault();

    try {

        let name = addTaskForm["taskName"].value;
        let description = addTaskForm["taskDescription"].value;
        let deadline = addTaskForm["taskDeadline"].value;


        await addDoc(collection(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks"), { name: name, description: description, deadline: deadline }, { merge: true });
        addTaskForm.reset();
        console.info("Task added successfully");
        await showTasksLayout(currentSubjectId);
        console.info("Task printed successfully");

        

    } catch (error) {
        console.error("Error adding Task: ", error);
    }
    console.debug("addTask()...Completed");
}



//FIRESTORE <READ>

async function getSubjects(){
    console.debug("getSubjects()...");
    try {

        let subjectsRetrieved = [];
        const q = query(collection(db, "users/" + userEmail + "/subjects")/*, where("state", "==", "CA")*/);
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            subjectsRetrieved.push(doc.data());
        });
            
        console.info("Subjects retrieved successfully");
        printSubjects(subjectsRetrieved);
        unShowLoadingSubjects();
    } catch (error) {
        console.error("Error getting subjects: ",error);
    }
    console.debug("getSubjects()...Completed"); 
}

function printSubjects(subjects){
    console.debug("printSubjects()...");
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
                        '<button id="update-'+subject.name+'-modal" type="button" class="btn fadedPencil options" data-bs-toggle="modal" data-bs-target="#updateSubjectModal-'+subject.name+'"><i class="bi bi-pencil"></i></button>' +
                    '</div>' +
                    '<div id="card-'+subject.name+'" class="card-body my-4">' +
                        '<h5 class="card-title"><i class="bi bi-journal-bookmark"></i> ' + subjectName + '</h5>' +
                        '<p class="card-text"><i class="bi bi-person-add"></i> ' + subjectTeacher + '</p>' +
                    '</div>' +
                    '<div class="d-flex flex-row-reverse">' +
                        '<button id="delete-'+subject.name+'-modal" type="button" class="btn fadedTrash options" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal-'+subject.name+'"><i class="bi bi-trash3"></i></button>' +
                    '</div>' +
                '</div>'+

                '<div class="modal fade" id="updateSubjectModal-'+subject.name+'" tabindex="-1" aria-labelledby="updateSubjectModalLabel"aria-hidden="true">'+
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
                                        '<button type="button" id="updateSubject-'+subject.name+'" class="fadedPencil p-2 rounded-4">UPDATE <i class="bi bi-wrench-adjustable-circle"></i></button>'+
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


                '<div class="modal fade" id="deleteSubjectModal-'+subject.name+'" tabindex="-1" aria-labelledby="deleteSubjectModalLabel"aria-hidden="true">'+
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

        subjectsCanvas.addEventListener("click", async function(event) {

            if (event.target.id.split("-")[0] === "deleteSubject") {
                deleteSubject(event);
            }else if(event.target.id.split("-")[0] === "updateSubject"){
                updateSubject(event);
            }else if(event.target.id.split("-")[0] === "card"){
               
                await setCurrentSubjectId(event);
                await showTasksLayout(currentSubjectId);
                
            }
        });
               
    }catch(error){
        console.error("Error printing subjects: ",error);
    }

    console.debug("printSubjects()...Completed");
}

async function getTasks(subjectId) {
    console.debug("getTasks()...");

    try {

        let tasksRetrieved = [];
        const q = query(collection(db, "users/" + userEmail + "/subjects/" + subjectId + "/tasks")/*, where("state", "==", "CA")*/);

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            tasksRetrieved.push(doc.data());
        });

        console.info("Tasks retrieved successfully");
        printTasks(tasksRetrieved);

    } catch (error) {
        console.error("Error getting tasks: ", error);
    }
    console.debug("getTasks()...Completed");
}

function printTasks(tasks){
    console.debug("printTasks()...");
    try{

        tasksCanvas.innerHTML = ""; 

        for (const task of tasks) {

            tasksCanvas.innerHTML += 
                '<div id="card-'+task.name+'" class="card btn col-md-3 mx-3 my-2 p-1 appCard">' +
                    '<div class="d-flex justify-content-left">' +
                        '<button id="update-'+task.name+'-modal" type="button" class="btn fadedPencil options" data-bs-toggle="modal" data-bs-target="#updateSubjectModal-'+task.name+'"><i class="bi bi-pencil"></i></button>' +
                    '</div>' +
                    '<div class="card-body my-4">' +
                        '<h5 class="card-title"><i class="bi bi-journal-bookmark"></i> ' + task.name + '</h5>' +
                        '<p class="card-text"><i class="bi bi-person-add"></i> ' + task.naem + '</p>' +
                    '</div>' +
                    '<div class="d-flex flex-row-reverse">' +
                        '<button id="delete-'+task.name+'-modal" type="button" class="btn fadedTrash options" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal-'+task.name+'"><i class="bi bi-trash3"></i></button>' +
                    '</div>' +
                '</div>'+

                '<div class="modal fade" id="updateSubjectModal-'+task.name+'" tabindex="-1" aria-labelledby="updateSubjectModalLabel"aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto" id="updateSubjectModalLabel">Update Subject</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<form id="updateSubjectForm-'+task.name+'">'+
                                    '<div class="input-group mb-3 w-75 mx-auto align-items-center">'+
                                        '<input id="updateSubjectName-'+task.name+'" value="'+task.name+'" type="text" class="form-control" placeholder="Name"aria-label="updateSubjectName'+task.name+'" aria-describedby="updateSubjectName'+task.name+'" required>'+
                                        '<span class="input-group-text" id="subjectName'+task.name+'"><i class="bi bi-journal-bookmark"></i></span>'+
                                        '<input id="updateSubjectTeacher-'+task.name+'" value="'+task.name+'" type="text" class="form-control" placeholder="Teacher name"aria-label="updateSubjectTeacher'+task.name+'" aria-describedby="updateSubjectTeacher'+task.name+'" required>'+
                                        '<span class="input-group-text" id="subjectTeacher'+task.name+'"><i class="bi bi-person-add"></i></span>'+
                                    '</div>'+
                                    '<div class="text-center pt-1 pb-1">'+
                                        '<button type="button" id="updateSubject-'+task.name+'" class="fadedPencil p-2 rounded-4">UPDATE <i class="bi bi-wrench-adjustable-circle"></i></button>'+
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


                '<div class="modal fade" id="deleteSubjectModal-'+task.name+'" tabindex="-1" aria-labelledby="deleteSubjectModalLabel"aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto" id="deleteSubjectModalLabel">Delete Subject</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div class="text-center pt-1 pb-1">'+
                                    '<button type="button" id="deleteSubject-'+task.name+'" class="fadedTrash p-2 rounded-4">DELETE <i class="bi bi-journal-x"></i></button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
        }

        tasksCanvas.addEventListener("click", function(event) {

            if (event.target.id.split("-")[0] === "deleteTask") {
                
            }else if(event.target.id.split("-")[0] === "updateTask"){
                
            }else if(event.target.id.split("-")[0] === "card"){
                
            }
        });
               
    }catch(error){
        console.error("Error printing tasks: ",error);
    }
    console.debug("printTasks()...Completed");
}




//FIRESTORE <UPDATE>

async function deleteSubject(button){
    console.debug("deleteSubject()...");
    try{
        let idSubject = button.target.id.split("-")[1];
        
        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects"), where("name", "==", idSubject));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
    
                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/subjects", documentSnapshot.id);
    
                await deleteDoc(documentRef);
    
                console.info("Subject has been deleted successfully");
            } else {
                console.error("No subject found matching the query");
            }
    
        } catch (error) {
            console.error("Error deleting subject: ", error);
        }

        try {
            const backdrop = document.querySelector(".modal-backdrop");
            //backdrop.classList.remove("show");
            //backdrop.classList.add("close");
            backdrop.remove();
            
        } catch (error) {
            console.error("Error al cerrar el modal")
        }
       

        await showSubjectsLayout();
        
    }catch(error){
        console.error(error);
    }
    console.debug("deleteSubject()...Completed"); 
}




//FIRESTORE <DELETE>

async function updateSubject(button) {
    console.debug("updateSubject()...");
    try {

        let idSubject = button.target.id.split("-")[1];
        let newName = document.querySelector("#updateSubjectName-" + idSubject).value;
        let newTeacher = document.querySelector("#updateSubjectTeacher-" + idSubject).value;

        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects"), where("name", "==", idSubject));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/subjects", documentSnapshot.id);

                await updateDoc(documentRef, {
                    name: newName,
                    teacher: newTeacher
                });

                console.info("Subject has been updated successfully");
            } else {
                console.error("No subject found matching the query");
            }

        } catch (error) {
            console.error("Error updating subject: ", error);
        }

        try {
            const backdrop = document.querySelector(".modal-backdrop");
            //backdrop.classList.remove("show");
            //backdrop.classList.add("close");
            backdrop.remove();
            
        } catch (error) {
            console.error("Error al cerrar el modal")
        }

        await showSubjectsLayout();

    } catch (error) {
        console.error(error);
    }
    console.debug("updateSubject()...Completed");
}
    

//------------------------------MAIN-----------------------------------//

showContent();
