const API_URL = 'http://localhost:3000';

const AUTH_LOGIN = '/login';

/**
 * elements de l'interface
 */
const authSection=document.getElementById('auth');
const authForm=document.getElementById('authform');

/**
 * Fonction de connexion à l'API
 * @param {string} email
 * @param {string} password
 */

const connectAPI=(email, password)=>{
    let obj={email, password};
    let myRequest=`${API_URL}${AUTH_LOGIN}`
    let initParam={
     method:'POST',
     headers:{'Content-Type': 'application/json'},
     body:JSON.stringify(obj)
    };
    fetch(myRequest, initParam)
     .then(
         reponse=>reponse.json()
     )
     .then(
         data=>{
             console.log(data)
             // sauvegarde du token dans le localStorage
             // 2 paramètres : nom de l'item, valeur (string)
             localStorage.setItem('token',data.token);
             buildInterface(data.user.role)

         }

     )
     .catch(
         error=>console.log(error)
         
     )
 }

 const buildInterface=(role)=>{
    if(localStorage.getItem('token')){
        if (role === 'stagiaire') {
            window.location.replace('mymood.html');
        }
        //console.log(localStorage.getItem('token'));
    }
}

// Appel de la fonction connectAPI sur le submit du formulaire :
authForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let email=authForm.email.value;
    let password=authForm.password.value;
    if(email!='' && password !=''){
        connectAPI(email, password);
    }
})