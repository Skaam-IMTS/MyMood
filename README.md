# MyMood




# Installation

- Docker nécessaire

. Cloner le repository. 

. Créer un fichier '.env' à la racine du projet et y copier le contenu de '.env.example'.

. Construire le conteneur docker :

```sh
docker compose up --build -d
```



Et voilà l'api est prête !

# URL de base de l'api
L'adresse de base de l'api sera sur http://localhost:3000 .


# Front
La partie front sera dans le dossier 'public'.

Et sera accessible via http://localhost:3000 ou http://localhost:3000/index.html

# Docs
La documentation des routes sera accessible via http://localhost:3000/api-docs

# Utilisateurs par défaut : 
Admin :
- email : admin@mymood.fr
- password : adminpass


Superviseur : 
 - email : j.seigne@mymood.fr
- password : superpass
  
Stagiaire : 
- email : m.smith@mymood.fr
- password : stagpass

# Mail
Les mails seront interceptés par Maildev.

Ils seront accessible sur http://localhost:1080/
