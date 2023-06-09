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
            window.location.href = "http://localhost:5500/App%20Web/Main/index.html";
        }else{
            appendAlert("Estamos esperando a que verifiques tu email.","warning");
        }
    }catch(error){
        const errorCode = error.code;
        if(errorCode=="auth/user-disabled"){
            appendAlert(email +": el usuario ha sido deshabilitado.","danger");
        }else if(errorCode=="auth/user-not-found"){
            appendAlert(email +": el usuario no existe, registrate." ,"danger");
        }else if(errorCode=="auth/invalid-email"){
            appendAlert(email +": correo NO válido.","danger");
        }else if(errorCode=="auth/wrong-password"){
            appendAlert("La contraseña es incorrecta.","danger");
        }else if(errorCode=="auth/too-many-requests"){
            appendAlert("Demasiados intentos. Intentalo más tarde","warning");
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
        appendAlertModal("Usuario creado. Verifica el email recibido.", "success");
        frmSignUp.reset();
    }catch(error){
        const errorCode = error.code;
        if(errorCode=="auth/network-request-failed"){
            appendAlertModal(email +" ya está en uso.", "danger");
        }else if(errorCode=="auth/email-already-in-use"){
            appendAlertModal(email +" ya está en uso.", "danger");
        }else if(errorCode=="auth/invalid-email"){
            appendAlertModal(email +": correo NO válido.", "danger");
        }else if(errorCode=="auth/weak-password"){
            appendAlertModal("La contraseña debe tener al menos 6 caracteres.", "info");
        }else{
            console.log(error);
        }
    }
});

//Auth User Observer
auth.onAuthStateChanged ( user =>{

    if(user){
        console.log("Usuario activo");
        if(user.emailVerified){
            console.log("Usuario activo y verificado");
            window.location.href = "http://localhost:5500/App%20Web/Main/index.html";
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
        appendAlert("Introduce el email." , "warning");
    }else if(isValidEmail){
        try{
            await sendPasswordResetEmail(auth ,email);
            appendAlert("Te hemos enviado un correo para la recuperación de tu contraseña." , "success");
        }catch(error){
            console.log(error);
        }
    }else{
        appendAlert("El email introducido no es válido." , "danger");
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