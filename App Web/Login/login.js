//-----------------------IMPORTs-----------------------------------//

import {
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import {auth} from "../FireBase.js";

//-----------------------DECLARATION OF VARIABLEs-----------------------------------//

//FORMS
const frmLogin = document.querySelector("#frmLogin");
const frmSignUp = document.querySelector("#frmSignUp");
//LIVE-ALERT
const alertPlaceholder = document.querySelector('#liveAlertPlaceholder');
const alertPlaceholderModal = document.querySelector('#liveAlertPlaceholderModal');
//FORGOTTEN PASSWORD
const recoverPw = document.querySelector('#recuperarContrasenya');
//LOGIN WITH GOOGLE BUTTON
const btnGoogle = document.querySelector('#btnGoogle');

//------------------------------EVENTs/FUNCTIONs-----------------------------------//

//LogIn
frmLogin.addEventListener('submit', async (e)=> {

    e.preventDefault();
    let email = frmLogin["inputEmail"].value;
    let pw = frmLogin["inputPassword"].value;
    try{
        await signInWithEmailAndPassword(auth, email, pw);
        if(auth.currentUser.emailVerified){
            frmLogin.reset();
            window.location.href = "http://localhost:5500/Main/index.html";
        }else{
            appendAlert("First verify your email address.","warning");
        }
    }catch(error){
        const errorCode = error.code;
        if(errorCode=="auth/user-disabled"){
            appendAlert(email +": the user has been disabled.","danger");
        }else if(errorCode=="auth/user-not-found"){
            appendAlert(email +": the user does not exist, please register." ,"danger");
        }else if(errorCode=="auth/invalid-email"){
            appendAlert(email +": email not valid.","danger");
        }else if(errorCode=="auth/wrong-password"){
            appendAlert("The password is incorrect.","danger");
        }else if(errorCode=="auth/too-many-requests"){
            appendAlert("Too many attempts, try again later.","warning");
        }else{
            console.log(error);
        }
    }
});

//LogOut
frmSignUp.addEventListener('submit', async (e)=> {

    e.preventDefault();
    let email = frmSignUp["inputEmailRegistrarse"].value;
    let pw = frmSignUp["inputPasswordRegistrarse"].value;
    try{
        await createUserWithEmailAndPassword(auth, email, pw);
        await sendEmailVerification(auth.currentUser)
        appendAlertModal("User created. Verify the received email.", "success");
        frmSignUp.reset();
    }catch(error){
        const errorCode = error.code;
        if(errorCode=="auth/network-request-failed"){
            appendAlertModal(email +" is already in use.", "danger");
        }else if(errorCode=="auth/email-already-in-use"){
            appendAlertModal(email +" is already in use.", "danger");
        }else if(errorCode=="auth/invalid-email"){
            appendAlertModal(email +": email not valid.", "danger");
        }else if(errorCode=="auth/weak-password"){
            appendAlertModal("The password must be at least 6 characters long.", "info");
        }else{
            console.log(error);
        }
    }
});

//Auth User Observer
auth.onAuthStateChanged ( user =>{

    if(user){
        console.log("Active user");
        if(user.emailVerified){
            console.log("Active and verified user");
            window.location.href = "http://localhost:5500/Main/index.html";
        }
    }else{
        console.log("Usuario Inactivo");
    }
});

//Recover Password
recoverPw.addEventListener ('click', async (e)=> {

    let email = frmLogin["inputEmail"].value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var isValidEmail = emailRegex.test(email);

    if(email==""){
        appendAlert("Please enter your email address." , "warning");
    }else if(isValidEmail){
        try{
            await sendPasswordResetEmail(auth ,email);
            appendAlert("We have sent you an email to recover your password." , "success");
        }catch(error){
            console.log(error);
        }
    }else{
        appendAlert("The email entered is invalid." , "danger");
    }
    
});

//Bootstrap Live Alert
const appendAlert = (message, type) => {

    let icon;
    if(type=="info"){
        icon='<i class="bi bi-info-circle-fill d-inline"></i>';
    }else if(type=="success"){
        icon='<i class="bi bi-check-circle-fill d-inline"></i>';
    }else if(type=="warning"){
        icon='<i class="bi bi-exclamation-diamond-fill d-inline"></i>';
    }else if(type=="danger"){ 
        icon='<i class="bi bi-exclamation-triangle-fill d-inline"></i>';
    }else{
        type="info";
        icon='<i class="bi bi-info-circle-fill d-inline"></i>';
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${icon+" "+message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper)
}

//Bootstrap Live Alert in Modal
const appendAlertModal = (message, type) => {

    let icon;
    if(type=="info"){
        icon='<i class="bi bi-info-circle-fill d-inline"></i>';
    }else if(type=="success"){
        icon='<i class="bi bi-check-circle-fill d-inline"></i>';
    }else if(type=="warning"){
        icon='<i class="bi bi-exclamation-diamond-fill d-inline"></i>';
    }else if(type=="danger"){ 
        icon='<i class="bi bi-exclamation-triangle-fill d-inline"></i>';
    }else{
        type="info";
        icon='<i class="bi bi-info-circle-fill d-inline"></i>';
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${icon+" "+message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholderModal.append(wrapper)
}

//LogIn with Google
btnGoogle.addEventListener ('click', async (e)=> {

    try{
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth , provider);
    }catch(error){
        console.log(error);
    }
});

//------------------------------MAIN-----------------------------------//