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
    where 
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
let robotNav = document.querySelector("#robotNav");

//nav buttons
let btnLogOut = document.querySelector("#btnLogOut");
let theme = document.querySelector("#theme");

//DIVs/LAYOUTSs
let app = document.querySelector("#appDiv");

let subjectsLayout= document.querySelector("#subjectsLayout");
let subjectsCanvas = document.querySelector("#subjectsCanvas");
let tasksLayout = document.querySelector("#tasksLayout");
let tasksCanvas = document.querySelector("#tasksCanvas");

let generalDoc = document.querySelector("#generalDiv");
let webDoc = document.querySelector("#webDiv");
let apkDoc = document.querySelector("#apkDiv");
let robotDoc = document.querySelector("#robotDiv");

let loadingTasks = document.querySelector("#loadingTasks");

//BUTTONs
let goToSubjects = document.querySelector("#goToSubjects");





//------------------------------EVENTs-----------------------------------//

//SPA EVENTs (Single-Page-Aplication)
appNav.addEventListener("click", showSubjectsLayout);
generalNav.addEventListener("click",showGeneralDoc);
webDocNav.addEventListener("click",showWebDoc);
apkDocNav.addEventListener("click",showApkDoc);
robotNav.addEventListener("click",showRobotDoc);

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

    if(document.body.classList.contains("bg-light")){

        document.body.classList.remove("bg-light");
        document.body.classList.remove("text-dark");
        document.body.classList.add("bg-dark");
        document.body.classList.add("text-light");
        let accordionButtons = document.querySelectorAll(".accordion-button");
        accordionButtons.forEach(element => {
            element.classList.remove("bg-light");
            element.classList.add("bg-secondary");
        });
        let links = document.querySelectorAll(".text-decoration-none");
        links.forEach(a => {
            a.classList.add("text-info");
        });
        let dropdownMenus = document.querySelectorAll(".dropdown-menu");
        dropdownMenus.forEach(menu => {
          
            menu.classList.add("bg-secondary");
        });
       

    }else{
        document.body.classList.remove("bg-dark");
        document.body.classList.remove("text-light");
        document.body.classList.add("bg-light");
        document.body.classList.add("text-dark");
        let accordionButtons = document.querySelectorAll(".accordion-button");
        accordionButtons.forEach(element => {
            element.classList.remove("bg-secondary");
            element.classList.add("bg-light");
        });
        let links = document.querySelectorAll(".text-decoration-none");
        links.forEach(a => {
            a.classList.remove("text-info");
        });
        let dropdownMenus = document.querySelectorAll(".dropdown-menu");
        dropdownMenus.forEach(menu => {
            menu.classList.remove("bg-secondary");
          
        });
        
        
    }

}



//SPA EVENTs FUNCTIONs
function showGeneralDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "block";
    generalDoc.classList.add("animate__animated","animate__fadeInUp");
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
}
function showWebDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "block";
    webDoc.classList.add("animate__animated","animate__fadeInUp");
    robotDoc.style.display = "none";
}
function showApkDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "block";
    apkDoc.classList.add("animate__animated","animate__fadeInUp");
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
}
function showRobotDoc(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "block";
    robotDoc.classList.add("animate__animated","animate__fadeInUp");

}



async function showSubjectsLayout(){
    tasksLayout.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
    showLoading();
    await getSubjects();
    subjectsLayout.style.display = "block";
    app.style.display = "block";
    unShowLoadingSubjects();
    currentSubjectId="";
}
async function showTasksLayout(subjectId){
    subjectsLayout.style.display = "none";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
    showLoading();
    await getTasks(subjectId);
    tasksLayout.style.display = "block";
    app.style.display = "block";
    unShowLoadingTasks();
}


function showLoading(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "none";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
    loadingTasks.classList.remove("d-none")
    loadingTasks.classList.add("d-flex")
}
function unShowLoadingSubjects(){

    subjectsLayout.style.display = "block";
    tasksLayout.style.display = "none";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
    loadingTasks.classList.remove("d-flex")
    loadingTasks.classList.add("d-none")  
}
function unShowLoadingTasks(){

    subjectsLayout.style.display = "none";
    tasksLayout.style.display = "block";
    app.style.display = "block";
    generalDoc.style.display = "none";
    apkDoc.style.display = "none";
    webDoc.style.display = "none";
    robotDoc.style.display = "none";
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
            window.location.href = "../index.html";
        }
    } else {
        console.error("Inactive user");
        window.location.href = "../index.html";
    }

});

//SET CURRENT SUBJECT
async function setCurrentSubjectId(event){

    console.debug("setCurrentSubjectId()...");
    
    try {

        let nameSubjectTreated = event.target.id.split("-");
        nameSubjectTreated.shift();
        let nameSubject = nameSubjectTreated.join(" ");

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

    await showTasksLayout(currentSubjectId);
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

        let subjectName = addSubjectForm["subjectName"].value.trim();
        let teacher = addSubjectForm["subjectTeacher"].value.trim();
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

        let name = addTaskForm["taskName"].value.trim();
        let description = addTaskForm["taskDescription"].value.trim();
        let deadline = addTaskForm["taskDeadline"].value;


        await addDoc(collection(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks"), { name: name, description: description, deadline: deadline, completed: false, submited: false }, { merge: true });
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

            let subjectName = subject.name.toUpperCase();
            let subjectNameTreated = subject.name.replace(/ /g, "-");

            subjectsCanvas.innerHTML += 
                '<div id="card-'+subjectNameTreated+'" class="card btn col-md-3 mx-3 my-2 p-1 appCard">' +
                    '<div id="card-'+subjectNameTreated+'" class="d-inline-flex justify-content-left">' +
                        '<button id="update-'+subjectNameTreated+'-modal" type="button" class="btn fadedPencil options" data-bs-toggle="modal" data-bs-target="#updateSubjectModal-'+subjectNameTreated+'"><i class="bi bi-pencil"></i></button>' +
                    '</div>' +
                    '<div id="card-'+subjectNameTreated+'" class="card-body my-4">' +
                        '<h5 id="card-'+subjectNameTreated+'" class="card-title"><i class="bi bi-journal-bookmark"></i> ' + subjectName + '</h5>' +
                        '<p id="card-'+subjectNameTreated+'" class="card-text"><i class="bi bi-person-add"></i> ' + subjectTeacher + '</p>' +
                    '</div>' +
                    '<div id="card-'+subjectNameTreated+'" class="d-inline-flex flex-row-reverse">' +
                        '<button id="delete-'+subjectNameTreated+'-modal" type="button" class="btn fadedTrash options" data-bs-toggle="modal" data-bs-target="#deleteSubjectModal-'+subjectNameTreated+'"><i class="bi bi-trash3"></i></button>' +
                    '</div>' +
                '</div>'+

                '<div class="modal fade" id="updateSubjectModal-'+subjectNameTreated+'" tabindex="-1" aria-labelledby="updateSubjectModalLabel-'+subjectNameTreated+'"aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto text-dark" id="updateSubjectModalLabel">Update '+subjectName+'</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<form id="updateSubjectForm-'+subjectNameTreated+'">'+
                                    '<div class="input-group mb-3 w-75 mx-auto align-items-center">'+
                                        '<input id="updateSubjectName-'+subjectNameTreated+'" value="'+subject.name+'" type="text" class="form-control" placeholder="Name"aria-label="updateSubjectName'+subjectNameTreated+'" aria-describedby="updateSubjectName'+subjectNameTreated+'" required>'+
                                        '<span class="input-group-text" id="subjectName-'+subjectNameTreated+'"><i class="bi bi-journal-bookmark"></i></span>'+
                                        '<input id="updateSubjectTeacher-'+subjectNameTreated+'" value="'+subject.teacher+'" type="text" class="form-control" placeholder="Teacher name"aria-label="updateSubjectTeacher'+subject.teacher+'" aria-describedby="updateSubjectTeacher'+subject.teacher+'" required>'+
                                        '<span class="input-group-text" id="subjectTeacher-'+subject.teacher+'"><i class="bi bi-person-add"></i></span>'+
                                    '</div>'+
                                    '<div class="text-center pt-1 pb-1">'+
                                        '<button type="button" id="updateSubject-'+subjectNameTreated+'" class="fadedPencil p-2 rounded-4">UPDATE <i class="bi bi-wrench-adjustable-circle"></i></button>'+
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


                '<div class="modal fade" id="deleteSubjectModal-'+subjectNameTreated+'" tabindex="-1" aria-labelledby="deleteSubjectModalLabel-'+subjectNameTreated+'" aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header p-2">'+
                                '<h5 class="modal-title mx-auto text-dark" id="deleteSubjectModalLabel">Delete '+subjectName+'</h5>'+
                                '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div class="text-center pt-1 pb-1">'+
                                    '<button type="button" id="deleteSubject-'+subjectNameTreated+'" class="fadedTrash p-2 rounded-4">DELETE <i class="bi bi-journal-x"></i></button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
        }

        subjectsCanvas.addEventListener("click", subjectsListener );

        console.info("Subjects printed successfully");
        
    }catch(error){
        console.error("Error printing subjects: ",error);
    }

    console.debug("printSubjects()...Completed");
}

async function subjectsListener(event) {
    if (event.target.id.split("-")[0] === "deleteSubject") {
        await deleteSubject(event); 
    }else if(event.target.id.split("-")[0] === "updateSubject"){
        await updateSubject(event);
    }else if(event.target.id.split("-")[0] === "card"){
        await setCurrentSubjectId(event);
    }
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

            let completedIsChecked;
            let submitedIsChecked;

            if(task.completed){
                completedIsChecked = "checked";
            }else{
                completedIsChecked = "";
            }
            if(task.submited){
                submitedIsChecked = "checked";
            }else{
                submitedIsChecked = "";
            }

            let taskName = String(task.name).toUpperCase();
            let taskNameTreated = String(task.name).replace(/ /g, "-");

            tasksCanvas.innerHTML += 
            '<div id="card-'+taskNameTreated+'" class="card btn col-md-3 mx-3 my-2 p-1 appCard">' +
                '<div class="d-inline-flex justify-content-left">' +
                    '<button id="update-'+taskNameTreated+'-modal" type="button" class="btn fadedPencil options" data-bs-toggle="modal" data-bs-target="#updateTaskModal-'+taskNameTreated+'"><i class="bi bi-pencil"></i></button>' +
                '</div>' +
                '<div  class="card-body my-4">' +
                    '<h5  class="card-title"><i class="bi bi-clipboard"></i> ' + taskName + '</h5>' +
                    '<p class="card-text"><i class="bi bi-calendar-event"></i> ' + task.deadline + '</p>' +
                    '<div class="form-check form-switch px-5">'+
                        '<input class="form-check-input mx-0" type="checkbox" role="switch" id="cardTaskCompleted-'+taskNameTreated+'" disabled '+completedIsChecked+'>'+
                        '<label class="form-check-label mx-0" for="cardTaskCompleted-'+taskNameTreated+'">Completed</label>'+
                    '</div>'+
                    '<div class="form-check form-switch px-5">'+
                        '<input class="form-check-input mx-0" type="checkbox" role="switch" id="cardTaskSubmited-'+taskNameTreated+'" disabled '+submitedIsChecked+'>'+
                        '<label class="form-check-label mx-0" for="cardTaskSubmited-'+taskNameTreated+'">Submitted</label>'+
                    '</div>'+
                '</div>' +
                '<div class="d-inline-flex flex-row-reverse">' +
                    '<button id="delete-'+taskNameTreated+'-modal" type="button" class="btn fadedTrash options" data-bs-toggle="modal" data-bs-target="#deleteTaskModal-'+taskNameTreated+'"><i class="bi bi-trash3"></i></button>' +
                '</div>' +
            '</div>'+

            '<div class="modal fade" id="updateTaskModal-'+taskNameTreated+'" tabindex="-1" aria-labelledby="updateTaskModalLabel-'+taskNameTreated+'" aria-hidden="true">'+
                '<div  class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                    '<div  class="modal-content">'+
                                '<div class="modal-header p-2">'+
                                    '<h5 class="modal-title mx-auto text-dark" id="addTaskModalLabel">Update  '+taskName+'</h5>'+
                                    '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1" data-bs-dismiss="modal" aria-label="Close"></button>'+
                                '</div>'+
                        '<div class="modal-body">'+
                
                            '<form id="updateTaskForm-'+taskNameTreated+'">'+
                                '<div class="input-group mb-3 w-75 mx-auto align-items-center col">'+
                                    '<input id="updateTaskName-'+taskNameTreated+'" type="text" class="form-control " placeholder="Name" aria-label="taskName" aria-describedby="taskName" value="'+task.name+'" >'+
                                    '<span class="input-group-text" id="taskName"><i class="bi bi-clipboard2"></i></span>'+
                                '</div>'+
                
                                '<div class="input-group mb-3 w-75 mx-auto align-items-center col">'+
                                    '<textarea id="updateTaskDescription-'+taskNameTreated+'" type="text" class="form-control rounded" placeholder="Description" >'+task.description+'</textarea>'+
                                '</div>'+
                
                                '<div class="input-group mb-3 w-75 mx-auto align-items-center col">'+
                                    '<input id="updateTaskDeadline-'+taskNameTreated+'" type="date" class="form-control" value="'+task.deadline+'" aria-label="taskDeadline" aria-describedby="taskDeadline" >'+
                                '</div>'+
                                
                                '<div class="form-check form-switch  mb-3 w-75 mx-auto align-items-center text-light">'+
                                    '<input class="form-check-input " type="checkbox" role="switch" id="updateTaskCompleted-'+taskNameTreated+'" '+completedIsChecked+'>'+
                                    '<label class="form-check-label " for="updateTaskCompleted-'+taskNameTreated+'">Completed</label>'+
                                '</div>'+

                                '<div class="form-check form-switch  mb-3 w-75 mx-auto align-items-center text-light">'+
                                    '<input class="form-check-input" type="checkbox" role="switch" id="updateTaskSubmited-'+taskNameTreated+'"  '+submitedIsChecked+'>'+
                                    '<label class="form-check-label" for="updateTaskSubmited-'+taskNameTreated+'">Submitted</label>'+
                                '</div>'+

                                '<div class="text-center pt-1 pb-1">'+
                                    '<button type="submit" id="updateTask-'+taskNameTreated+'" class="faded p-2 rounded-4">UPDATE <i class="bi bi-wrench-adjustable-circle"></i></button>'+
                                '</div>'+

                            '</form>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+


            '<div class="modal fade" id="deleteTaskModal-'+taskNameTreated+'" tabindex="-1" aria-labelledby="deleteTaskModalLabel-'+taskNameTreated+'" aria-hidden="true">'+
                '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable my-0">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header p-2">'+
                            '<h5 class="modal-title mx-auto text-dark" id="deleteTaskModalLabel-'+taskNameTreated+'">Delete '+task.name+'</h5>'+
                            '<button type="button" class="btn-close bg-danger rounded-5 p-2 mx-1 cerrarModal" data-bs-dismiss="modal"aria-label="Close"></button>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<div class="text-center pt-1 pb-1">'+
                                '<button type="button" id="deleteTask-'+taskNameTreated+'" class="fadedTrash p-2 rounded-4">DELETE <i class="bi bi-journal-x"></i></button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
        }

        tasksCanvas.addEventListener("click", tasksListener);
        console.info("Tasks printed successfully");

               
    }catch(error){
        console.error("Error printing tasks: ",error);
    }
    console.debug("printTasks()...Completed");
}

async function tasksListener(event) {

    if (event.target.id.split("-")[0] === "deleteTask") {
        await deleteTask(event);
    }else if(event.target.id.split("-")[0] === "updateTask"){
        await updateTask(event);
    }
}


//FIRESTORE <UPDATE>

async function updateSubject(button) {
    console.debug("updateSubject()...");
    try {
     
        let nameSubjectTreated = button.target.id.split("-");
        nameSubjectTreated.shift();
        let idSubject = nameSubjectTreated.join("-");
        let nameSubject = nameSubjectTreated.join(" ");

        let newName = document.querySelector("#updateSubjectName-" + idSubject).value.trim();
        let newTeacher = document.querySelector("#updateSubjectTeacher-" + idSubject).value.trim();

        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects"), where("name", "==", nameSubject));
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
            backdrop.remove();
            document.body.classList.remove("modal-open");
            document.body.style="";
        } catch (error) {
           
        }

        await showSubjectsLayout();
        
    } catch (error) {
        console.error(error);
    }
    console.debug("updateSubject()...Completed");
}

async function updateTask(button) {
    console.debug("updateTask()...");
    try {
     
        let nameSubjectTreated = button.target.id.split("-");
        nameSubjectTreated.shift();
        let idTask = nameSubjectTreated.join("-");
        let nameTask = nameSubjectTreated.join(" ");

        let newName = document.querySelector("#updateTaskName-" + idTask).value;
        let newDescription = document.querySelector("#updateTaskDescription-" + idTask).value;
        let newDeadline = document.querySelector("#updateTaskDeadline-" + idTask).value;
        let newCompleted = document.querySelector("#updateTaskCompleted-" + idTask).checked;
        let newSubmited = document.querySelector("#updateTaskSubmited-" + idTask).checked;

        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks/"), where("name", "==", nameTask));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks/", documentSnapshot.id);

                await updateDoc(documentRef, {
                    name: newName,
                    description: newDescription,
                    deadline:newDeadline,
                    completed:newCompleted,
                    submited:newSubmited,
                });

                console.info("Task has been updated successfully");
            } else {
                console.error("No task found matching the query");
            }

        } catch (error) {
            console.error("Error updating task: ", error);
        }

        try {
            const backdrop = document.querySelector(".modal-backdrop");
            backdrop.remove();
            document.body.classList.remove("modal-open");
            document.body.style="";
        } catch (error) {
           
        }

        await showTasksLayout(currentSubjectId);
        
    } catch (error) {
        console.error(error);
    }
    console.debug("updateTask()...Completed");
}


//FIRESTORE <DELETE>

async function deleteSubject(button){
    console.debug("deleteSubject()...");
    try{
        let nameSubjectTreated = button.target.id.split("-");
        nameSubjectTreated.shift();
        let nameSubject = nameSubjectTreated.join(" ");
        
        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects"), where("name", "==", nameSubject));
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
            backdrop.remove();
            document.body.classList.remove("modal-open");
            document.body.style="";
        } catch (error) {
            
        }
       

        await showSubjectsLayout();
        
    }catch(error){
        console.error(error);
    }
    console.debug("deleteSubject()...Completed"); 
}

async function deleteTask(button){
    console.debug("deleteTask()...");
    try{
        let nameSubjectTreated = button.target.id.split("-");
        nameSubjectTreated.shift();
        let nameTask = nameSubjectTreated.join(" ");
        
        try {
            const q = query(collection(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks/"), where("name", "==", nameTask));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
    
                const documentSnapshot = querySnapshot.docs[0];
                const documentRef = doc(db, "users/" + userEmail + "/subjects/"+currentSubjectId+"/tasks/", documentSnapshot.id);
    
                await deleteDoc(documentRef);
    
                console.info("Task has been deleted successfully");
            } else {
                console.error("No task found matching the query");
            }
    
        } catch (error) {
            console.error("Error deleting task: ", error);
        }

        try {
            const backdrop = document.querySelector(".modal-backdrop");
            backdrop.remove();
            document.body.classList.remove("modal-open");
            document.body.style="";
        } catch (error) {
            
        }
       

        await showTasksLayout(currentSubjectId);
        
    }catch(error){
        console.error(error);
    }
    console.debug("deleteTask()...Completed"); 
}

//------------------------------MAIN-----------------------------------//