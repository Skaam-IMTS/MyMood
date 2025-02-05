let moodURL="http://localhost:3000/";
let moodGroupUrl="groups/";
let moodMainUrl="mood/";
let moodIdUrl=`${localStorage.getItem('groupId')}/`;
let moodFromUrl="students";  
let moodResetAlertUrl="/reset-alert";

let body=document.querySelector('body');
let btnRetour=document.getElementById('btn-retour');
let alertContainer=document.getElementById('alertContainer');
let studentsContainer=document.getElementById('students-container');
let moodMeterValue=document.getElementById('mood-o-meter-value');



// Vérifie si tu a le token, sinon il te redirect dans le login
const redirect=()=>{
    if(localStorage.getItem('Token')){}
    else{
        window.location.replace('/index.html')
    }
}
redirect();



let initParam={
    method: 'GET',
    headers:{'Content-Type': 'application/json',
        'Authorization':`Bearer ${localStorage.getItem('Token')}`
    }
};
let moodPlainURL=`${moodURL}${moodGroupUrl}${moodIdUrl}${moodFromUrl}`;
fetch(moodPlainURL, initParam)
.then(
    response=>response.json()
)
.then(
    data=>{
        buildStudents(data)
    }
)
.catch(
    error=>console.log(error)
)


const buildStudents=(groupX)=>{
    n=1;
    let moyenneMood=0;
    for(eachStudent of groupX.students){
        console.log(eachStudent);
        let studentAlertRoot=eachStudent.en_alerte;
        let studentFNameRoot=eachStudent.prenom;
        let studentSNameRoot=eachStudent.nom;
        let studentMoodRoot=eachStudent.mood;
        let studentIdRoot=eachStudent.id;

        moyenneMood+=studentMoodRoot;

        let studentDiv=document.createElement('div');
        let studentName=document.createElement('label');
        let studentMood=document.createElement('label');
        studentsContainer.appendChild(studentDiv);
        studentDiv.appendChild(studentName);
        studentDiv.appendChild(studentMood);

        studentDiv.className='exemple-student fr aic jcsa fww exst1 colorB2';
        studentName.className='student-name width100prc stnm1 BDSuppR colorTXT1';
        studentName.htmlFor='mood';
        studentName.id='student';
        studentMood.className='student-mood height50px grJcAc stmd1 color2 BDSuppR';
        studentMood.htmlFor='student';
        studentMood.id='mood';

        studentName.innerHTML=`${studentFNameRoot} ${studentSNameRoot}`;
        studentMood.innerHTML=`${studentMoodRoot}`;

        if(studentAlertRoot!==0){
            console.log('ye');

            let studentAlertDiv=document.createElement('div');
            let studentDiv=document.createElement('div');
            let alertBtn=document.createElement('input');
            let studentName=document.createElement('label');
            let studentMood=document.createElement('label');
            alertContainer.appendChild(studentAlertDiv);
            studentAlertDiv.appendChild(studentDiv);
            studentAlertDiv.appendChild(alertBtn);
            studentDiv.appendChild(studentName);
            studentDiv.appendChild(studentMood);

            studentAlertDiv.className='fr aic jcc';
            studentAlertDiv.id='alert-student-container';
            studentDiv.className='exemple-student fr aic jcsa fww exst1 alerted colorB2';
            studentDiv.id=`exemple-student${n}`;
            alertBtn.className='alert-done CocoGL color2';
            alertBtn.type='button';
            alertBtn.value='Marquer comme géré';
            alertBtn.name='alert';
            studentName.className='student-name width100prc stnm1 BDSuppR colorTXT1';
            studentName.htmlFor='mood';
            studentName.id='student';
            studentMood.className='student-mood height50px grJcAc stmd1 color2 BDSuppR';
            studentMood.htmlFor='student';
            studentMood.id='mood';

            studentName.innerHTML=`${studentFNameRoot} ${studentSNameRoot}`;
            studentMood.innerHTML=`${studentMoodRoot}`;

            alertBtn.addEventListener('click', ()=>{
                let moodStudentIdUrl=`${studentIdRoot}`; 
                let moodAlertUrl=`${moodURL}${moodMainUrl}${moodStudentIdUrl}${moodResetAlertUrl}`;

                let paramAlert={
                    method:'PUT',
                    headers:{'Content-Type': 'application/json',
                        'Authorization':`Bearer ${localStorage.getItem('Token')}`
                    }
                }
                fetch(moodAlertUrl, paramAlert)
                .then(
                    response=>response.json()
                )
                .then(
                    data=>{
                        console.log(data)
                    }
                )

            })
        }
        n++;
    }
    moyenneMood=moyenneMood/groupX.students.length;
    moodMeterValue.innerHTML=`${moyenneMood}`;
}





// te renvoie dans la page formation list
btnRetour.addEventListener('click', ()=>{
    window.location.replace('/superviseur/formation-list.html');
})