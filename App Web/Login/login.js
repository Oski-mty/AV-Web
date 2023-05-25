//-----------------------IMPORTACIONES-----------------------------------//

import {createUserWithEmailAndPassword , sendEmailVerification ,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {auth} from "../FireBase.js";

//-----------------------DECLARACIÓN DE VARIABLES-----------------------------------//

//FORMS
const frmLogin = document.querySelector("#frmLogin");
const frmSignUp = document.querySelector("#frmSignUp");
//LIVE-ALERT
const alertPlaceholder = document.querySelector('#liveAlertPlaceholder');
const alertPlaceholderModal = document.querySelector('#liveAlertPlaceholderModal');

//------------------------------EVENTOS/FUNCIONES-----------------------------------//

frmLogin.addEventListener('submit', async (e)=> {

    e.preventDefault();
    let email = frmLogin["inputEmail"].value;
    let pw = frmLogin["inputPassword"].value;
    try{
        await signInWithEmailAndPassword(auth, email, pw);
        if(auth.currentUser.emailVerified){
            frmLogin.reset();
            window.location.href = "http://127.0.0.1:5500/App%20Web/Main/index.html";
        }else{
            appendAlert("Estamos esperando a que verifiques tu email.","info");
        }
    }catch(error){
        const errorCode = error.code;
        if(errorCode=="auth/user-disabled"){
            appendAlert(email +": el usuario ha sido deshabilitado.","danger");
        }else if(errorCode=="auth/user-not-found"){
            appendAlert(email +": el usuario no existe, registrate." ,"warning");
        }else if(errorCode=="auth/invalid-email"){
            appendAlert(email +": correo NO válido.","danger");
        }else if(errorCode=="auth/wrong-password"){
            appendAlert("La contraseña es incorrecta.","danger");
        }else{
            console.log(error);
        }
    }
});


frmSignUp.addEventListener('submit', async (e)=> {

    e.preventDefault();
    let email = frmSignUp["inputEmailRegistrarse"].value;
    let pw = frmSignUp["inputPasswordRegistrarse"].value;
    try{
        await createUserWithEmailAndPassword(auth, email, pw);
        await sendEmailVerification(auth.currentUser)
        appendAlertModal("Usuario creado. Se ha mandado un correo de verificación a "+email , "success");
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
            appendAlertModal("La contraseña debe tener al menos 6 caracteres.", "warning");
        }else{
            console.log(error);
        }
    }
});


auth.onAuthStateChanged ( user =>{
    if(user){
        console.log("Usuario activo"); 
    }else{
        console.log("Usuario Inactivo");
    }
});


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

//------------------------------MAIN-----------------------------------//






