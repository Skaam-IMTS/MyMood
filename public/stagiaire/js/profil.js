const profil1 = document.getElementById('profil1');
const profil2 = document.getElementById('profil2');

const btnValiderProfil = document.getElementById('btn-valider-profil');

btnValiderProfil.addEventListener('click', function (e) {
  e.preventDefault()
  
  profil1.style.display = 'none';
  profil2.style.display = 'flex';
  
});