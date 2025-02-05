let rootURL="http://localhost:3000/login";

let body=document.querySelector('body');
let loginForm=document.querySelector('#login-form');
let btnConnect=document.querySelector('#btn-connect');
let loginMailInput=document.querySelector('#email');
let loginPasswordInput=document.querySelector('#mdp');



/**
 * 
 * @param {string} email 
 * @param {string} password 
 */

// fonction connect login
const login=(email, password)=>{
    let obj={email,password};
    console.log(obj);

    let initParam={
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(obj)
    };
    console.log(rootURL, initParam)
    fetch(rootURL, initParam)
    .then(
        Response=>Response.json()
    )
    .then(
        data=>{
            console.log(data)
            localStorage.setItem('SuperviseurToken',data.token);
            
            let spStorage=localStorage.getItem('SuperviseurToken');
            if(spStorage === 'undefined'){
                localStorage.removeItem('SuperviseurToken')
            }
            
            redirectConnect(data);
        }
    )
    .catch(
        error=>console.log(error)
    )
}
// si tu a déja le token ca t'ammène à la page liste formation
const redirectConnect=(data)=>{
    if(localStorage.getItem('SuperviseurToken')){
        window.location.replace('/formation-list.html')
    }
}

// vérif si tu à déja un token et si c'est le cas, t'ammène dans la page formation list
redirectConnect();


// btn connection login
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    login(loginMailInput.value, loginPasswordInput.value)
})