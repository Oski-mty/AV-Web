import "../FireBase.js";
import {createUserWithEmailAndPassword , sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import {auth} from "../FireBase.js";



let frmLogin = document.querySelector("#frmLogin");
let frmSignUp = document.querySelector("#frmSignUp");


frmLogin.addEventListener('submit', (e)=> {

    e.preventDefault();
    let email = frmLogin["inputEmail"];
    let pw = frmLogin["inputPassword"];
    
    frmLogin.reset();
});


frmSignUp.addEventListener('submit', async (e)=> {

    e.preventDefault();
    let email = frmSignUp["inputEmailRegistrarse"].value;
    let pw = frmSignUp["inputPasswordRegistrarse"].value;
    console.log(email , pw);
    try{
        const userCredentials = await createUserWithEmailAndPassword(auth, email, pw)
        console.log(userCredentials)
        await verificarCorreo();
        alert("Usuario creado.");
    }catch(error){
        const errorCode = error.code;

        if(errorCode=="auth/network-request-failed"){
            alert(email +" Ya está en uso.");
        }else if(errorCode=="auth/email-already-in-use"){
            alert(email +" Ya está en uso.");
        }else if(errorCode=="auth/invalid-email"){
            alert(email +": correo NO válido.");
        }else if(errorCode=="auth/weak-password"){
            alert("La contraseña debe tener al menos 6 caracteres.");
        }
    }
    frmSignUp.reset();
});



async function verificarCorreo() {
    try{
        const user = auth.currentUser;
        await sendEmailVerification(user)
        alert("Se ha mandado un correo de verificación a "+user.email);
    }catch(error){
        alert(error.message);
    }
}










