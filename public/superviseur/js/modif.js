



// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect=()=>{
    if(localStorage.getItem('SuperviseurToken')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect();