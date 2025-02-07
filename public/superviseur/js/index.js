// la route login qui servira à fetch
let rootURL="http://localhost:3000/login";

// les variable qui prends des éléments HTML (changez la string en fonction de ce que vous l'identifiez)
let body=document.querySelector('body');                   //element body
let loginForm=document.querySelector('#login-form');       //element form qui englobe les inputs et le bouton submit
let btnConnect=document.querySelector('#btn-connect');     //element bouton "submit"
let loginMailInput=document.querySelector('#email');       //element input "mail"
let loginPasswordInput=document.querySelector('#mdp');     //element input "password"
let inputContainer=document.querySelector('#inputDiv');    //element div qui englobe les inputs



/**
 * 
 * @param {string} email 
 * @param {string} password 
 */

// fonction login (contient l'email et mdp que tu à tapé) :
const login=(email, password)=>{
    // variable "obj" contenant l'email et mdp
    let obj={email,password};
    console.log(obj);

    // les paramètres qui envoie sous forme de JSON la variable "obj"
    let initParam={
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(obj)
    };
    // fetch la route du login + les paramètres mises en place
    fetch(rootURL, initParam)
    .then(
        Response=>Response.json()
    )
    .then(
        // ici la fonction est sous forme d'objet pour ajouter plus d'action
        data=>{
            console.log(data)

            // créer le token qui s'apelle "Token", sa valeur peut être trouvée dans le JSON du compte crée
            localStorage.setItem('Token',data.token);
            localStorage.setItem('role',data.user.role);
            
            // Il est possible que la valeur du Token soit crée en tant que "undefined"
            // (ca arrive quand tu login un compte qui n'est pas censer exister), cette condition retire le token si il est "undefined".
            let spStorage=localStorage.getItem('Token');
            if(spStorage==='undefined'){
                localStorage.removeItem('Token');

                let errorInfo=document.createElement('p');
                inputContainer.appendChild(errorInfo);
                errorInfo.innerHTML=`${data.message}`;
                errorInfo.style.color='Brown';
            }            
            // apelle la fonction redirectConnect
            redirectConnect(data);
        }
    )
    .catch(
        error=>console.log(error)
    )
}
// Cette fonction détecte si tu à le Token, si tu l'as, on t'envoie vers la page principale du [Stagiaire/Superviseur/Admin].
const redirectConnect=(data)=>{
    if(localStorage.getItem('Token')) {

        let role = localStorage.getItem('role');
        if (role === 'stagiaire') window.location.replace('/stagiaire/mymood.html');
        if (role === 'superviseur') window.location.replace('/superviseur/formation-list.html');
        if (role === 'admin') window.location.replace('/admin/formation-list.html');
    }
}

// Utilié si tu utilise l'url pour illégalement aller dans la page login *AVEC* le Token.
redirectConnect();


// Quand tu sumbit, récupère la valeur de l'Email et Mdp que tu à tapé, apelle la fonction Login.
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    login(loginMailInput.value, loginPasswordInput.value)
})