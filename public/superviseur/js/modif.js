let btnOk=document.querySelector('#btn-ok');



// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect=()=>{
    if(localStorage.getItem('SuperviseurToken')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect();

btnOk.addEventListener('click', ()=>{
    window.location.replace('/superviseur/formation-list.html')
})