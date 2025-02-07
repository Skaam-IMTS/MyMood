const form1 = document.getElementById('myForm1');
const form2 = document.getElementById('myForm2');
const feedback = document.getElementById('feedback');
const moodSlider = document.querySelector('.mood-bar');
// const moodSliderM = document.querySelector('.mobile-cursor');
const btnAppel = document.getElementById('btn-appel');
const btnValider = document.getElementById('btn-valider');
const btnValiderMood = document.getElementById('btn-valider-mood');
const token = localStorage.getItem('Token');



btnAppel.addEventListener('click', function (event) {
  event.preventDefault()
  
  form1.style.display = 'none';
  form2.style.display = 'block';
  
});





let selectField = document.getElementById('selectField');
let selectText = document.getElementById('selectText');
let options = document.getElementsByClassName('options');
let list = document.getElementById('list');

selectField.addEventListener('click', function (event) {
  event.preventDefault()
  
  list.classList.toggle('hide');
  
  
  
  for (let option of options) {
    option.onclick = function () {
      selectText.innerHTML = this.textContent;
      list.classList.toggle('hide');
    }
  }
  
});

// Récupérer l'humeur de l'étudiant
const getMood = async () => {
  try {
    const response = await fetch('/mood/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      moodSlider.value = data.score;
    } else {
      console.error('Erreur:', data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Modifier l'humeur de l'étudiant
const updateMood = async (newMood, enAlerte) => {
  try {
    const response = await fetch('/mood/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newMood, enAlerte })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Erreur:', data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

btnValiderMood.addEventListener('click', function (event) {
  event.preventDefault()
  
  form1.style.display = 'none';
  feedback.style.display = 'flex';
  updateMood(moodSlider.value, false);
  
});

btnValider.addEventListener('click', function (event) {
  event.preventDefault()
  
  form2.style.display = 'none';
  feedback.style.display = 'flex';
  updateMood(moodSlider.value, true);
  
});

getMood();