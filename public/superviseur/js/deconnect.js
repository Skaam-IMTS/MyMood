let body=document.querySelector('body');
let btnAnnuler=document.querySelector('#btn-annuler');
let btnValider=document.querySelector('#btn-valider');



// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect=()=>{
    if(localStorage.getItem('Token')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect();



// retire le token et retoure à login
btnValider.addEventListener('click', ()=>{
    localStorage.removeItem('Token');
    window.location.reload();
});

// retourne dans la dernière page
btnAnnuler.addEventListener('click', ()=>{
    window.location.replace('/superviseur/formation-list.html')
});