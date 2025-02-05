// let listURL="http://localhost:3000/groups/supervisor";
let listURL="http://localhost:3000/groups/supervisor";


let listContainer=document.getElementById('formation-list-container');
let groupBody=document.getElementsByName('groupBody');


// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect2=()=>{
    if(localStorage.getItem('SuperviseurToken')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect2();



let initParam2={
    method: 'GET',
    headers:{'Content-Type': 'application/json',
        'Authorization':`Bearer ${localStorage.getItem('SuperviseurToken')}`
    }
};
fetch(listURL, initParam2)
.then(
    response=>response.json()
)
.then(
    data=>{
        console.log(data),
        makeList(data)
    }
)
.catch(
    error=>console.log(error)
)


const makeList=(list)=>{
    for(item of list){
        console.log(item);

        let element=document.createElement('button');
        listContainer.appendChild(element);
        element.className='formation-element width100prc colorTXT1';
        element.id=`${item.id_groupe}`;
        element.innerHTML=`${item.nom_groupe} ${item.id_groupe}`;

        element.addEventListener('click',()=>{
            localStorage.setItem('groupId', element.id);
            window.location.replace('/formation.html');
        })
    }
}