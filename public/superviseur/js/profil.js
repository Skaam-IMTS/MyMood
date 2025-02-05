let moodURL="http://localhost:3000/";
let profileURL="user/profile";


let body=document.querySelector('body');
let inputName=document.getElementById('nameModif');
let inputFirstName=document.getElementById('firstNameModif');
let inputMail=document.getElementById('emailModif');
let newPassword=document.getElementById('nouvMdpModif');
let btnAnnuler=document.querySelector('#btn-annuler');
let form=document.querySelector('#profil-form');


// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect=()=>{
    if(localStorage.getItem('SuperviseurToken')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect();


// créer l'url de la route profile, et le fetch
const profileFetch=()=>{
    let moodProfileUrl=`${moodURL}${profileURL}`;

    let profileUrlParamGet={
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('SuperviseurToken')}`,
        }
    }
    fetch(moodProfileUrl, profileUrlParamGet)
    .then(
        response=>response.json()
    )
    .then(
        data=>placeValToInput(data)
    )
    .catch(
        error=>console.log(error)
    )
}

// place ton nom/prenom/mail, automatiquement dans l'input
const placeValToInput=(values)=>{
    let nom=values.nom;
    let prenom=values.prenom;
    let email=values.email;
    
    inputName.value=`${nom}`;
    inputFirstName.value=`${prenom}`;
    inputMail.value=`${email}`;
}
profileFetch();



// TODO: FAIRE EN SORTE DE FAIRE CHANGER L'ATTRIBUT DU PROFIL AVEC METHODE 'PUT' QUAND TU CHANGE TON PROFIL ET QUE TA VALIDER
const recupValeursInputs=(data)=>{
    console.log(data);
    let moodProfileUrl=`${moodURL}${profileURL}`;

    let profileUrlParamPut={
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('SuperviseurToken')}`,
        },
        body:JSON.stringify(data)
    }
    fetch(moodProfileUrl, profileUrlParamPut)
    .then(
        response=>response.json()
    )
    .then(
        data=>{
            console.log(data)
            window.location.replace('/modif.html')
        }
    )
    .catch(
        error=>console.log(error)
    )
}

// envoie ce que tu à mis dans les input vers une fonction
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const recup={
        nom: inputName.value,
        prenom: inputFirstName.value,
        email: inputMail.value,
        newPassword: newPassword.value
    }
    recupValeursInputs(recup)
});

// retourne dans la dernière page
btnAnnuler.addEventListener('click', ()=>{
    window.location.replace('/superviseur/formation-list.html')
});

