// Fait que le script ne se lance qu'après le chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Selectionne tous les boutons de thème et les stock dans la variable buttons
  const buttons = document.querySelectorAll(".theme-button");
  // Selectionne le contenu de l'id "data-container" et le stock dans la variable du même nom
  const dataContainer = document.getElementById("data-container");
  // Selectionne le contenu de la classe ".container_button" et le stock dans la variable themeSelector
  const themeSelector = document.querySelector(".container_button");
  const titre = document.querySelector(".titre");
  const picture = document.querySelector(".picture");

  // Selectionne le contenu de l'id stop button et ensuite applique le style display none
  const stopButton = document.getElementById("stop-button");
  stopButton.style.display = "none";

  // Intialisation dans des variables l'index de questions ainsi que le score initial
  let currentQuestionIndex = 0;
  let score = 0;

  // Créer une boucle pour chacun des boutons thème
  buttons.forEach((button) => {
    // Lorsque l'utilisateur clique sur l'un des boutons alors :
    button.addEventListener("click", () => {
      // Le numéro du thème associé au bouton sur la page html est stocké dans la variable "theme"
      const theme = button.dataset.theme;
      // Ensuite on lance la fonction fetchTheme avec comme paramètre le nombre précédemment récupéré
      fetchTheme(theme);
    });
  });

  // Lorsque l'utilisateur clique sur le bouton retour alors :
  stopButton.addEventListener("click", () => {
    // On réinitialise le compteur de questions ainsi que le score
    currentQuestionIndex = 0;
    score = 0;

    // On remet à zéro le contenu du conteneur questions/réponses
    dataContainer.innerHTML = "";

    // On affiche à nouveau tous les élements de style de la page originale
    themeSelector.style.display = "flex";
    titre.style.display = "block";
    stopButton.style.display = "none";
    picture.style.display = "flex";
  });

  // On défini la fonction fetchTheme avec comme paramètre le numéro du thème 1, 2 ou 3
  function fetchTheme(theme) {
    /* On récupère le chemin du thème avec le paramètre theme récupéré plus haut, si ce paramètre est 1 alors 
      le chemin devient theme1.json */
    fetch(`public/theme${theme}.json`)
      // Récupère la réponse du serveur et la transforme en json
      .then((response) => response.json())
      /* Récupère le contenu de la réponse, ensuite appelle la fonction displayQuestions en lui 
        donnant comme paramètre le contenu du thème (themeData) */
      .then((themeData) => {
        displayQuestions(themeData);
      })
      // Si il y a une erreur lors de l'opération alors on affiche un message d'erreur
      .catch((error) => {
        console.error("Erreur lors de la récupération de données :", error);
      });
  }

  // Fonction permettant d'afficher les questions et réponses avec comme paramètre le contenu du theme.
  function displayQuestions(themeData) {
    // On stock le premier objet (0) du themeData dans une variable theme
    const theme = themeData[0];
    // On stock le contenu du tableau de questions dans la variable questions
    const questions = theme.questions;
    /* Ensuite on stock dans currentQuestion le contenu d'une seule question qui est 
        définie par le currentQuestionIndex */
    const currentQuestion = questions[currentQuestionIndex];
    // On initialise une variable nommée html dans laquelle on rajoutera du contenu par la suite
    let html = "";
    // On applique du style pour faire disparaître les boutons de thèmes, titre et logo
    themeSelector.style.display = "none";
    titre.style.display = "none";
    picture.style.display = "none";
    // On fait apparaître le bouton de retour précédemment invisible
    stopButton.style.display = "flex";

    // On affiche le contenu d'une question et son image sous format HTML
    html = `
          <div class="question-container">
            <p>Question ${currentQuestionIndex + 1}: ${
      currentQuestion.question
    }</p>
            <img src="${currentQuestion.image}" alt="Question image">
          </div>
          <div class="answers">`;

    // On sépare les quatres en deux groupes qu'on stock dans deux variable : groupe 1 / groupe 2
    const firstGroupAnswers = currentQuestion.answers.slice(0, 2);
    const secondGroupAnswers = currentQuestion.answers.slice(2);

    // Affiche les réponses au sein du groupe 1 pour chacun réponse dans le groupe (c'est à dire 2)
    html += `<div class="first-group">`;
    firstGroupAnswers.forEach((answer, answerIndex) => {
      html += `<p><button class="answer-button" data-answer-index="${answerIndex}">${answer}</button></p>`;
    });
    html += `</div>`;

    // Affiche les réponses au sein du groupe 2 pour chacun réponse dans le groupe (c'est à dire 2)
    html += `<div class="second-group">`;
    secondGroupAnswers.forEach((answer, answerIndex) => {
      html += `<p><button class="answer-button" data-answer-index="${
        answerIndex + 2
      }">${answer}</button></p>`;
    });
    html += `</div>`;

    // On ferme la div answers
    html += `</div>`;

    // Affichage du score de manière dynamique
    html += `<p>Score: ${score}</p>`;

    // Insère tout le contenu de la variable "html" dans data-container que l'on retrouve ensuite dans l'index.html
    dataContainer.innerHTML = html;

    // Selectionne tous les boutons de réponses et les stock dans la variable answerButtons
    const answerButtons = document.querySelectorAll(".answer-button");
    // Pour chaque bouton de réponses qui reçoit un clic
    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        /* Extrait dans la variable selectAnswerIndex la valeur de l'index du bouton donné 
            en string et le converti en integer */
        const selectedAnswerIndex = parseInt(button.dataset.answerIndex);
        const correctIndex = currentQuestion.correctIndex;

        /* Si l'utilisateur a selectionné la réponse correspondant à la bonne réponse alors on affiche un message
            et on incrémente le score */
        if (selectedAnswerIndex === correctIndex) {
          dataContainer.innerHTML = "<p>Bonne réponse, bien joué !</p>";
          score++; // Increase score for correct answer
          stopButton.style.display = "none";
          // Sinon, on affiche un autre message et le score n'est pas incrémenté
        } else {
          dataContainer.innerHTML = "<p>Mauvaise réponse, dommage...</p>";
          stopButton.style.display = "none";
        }

        // Ajout d'un délai avant d'afficher la prochaine question
        setTimeout(() => {
          currentQuestionIndex++;
          // Si la current question est inférieur au nombre de questions totales alors on continue d'afficher
          if (currentQuestionIndex < questions.length) {
            displayQuestions(themeData);
          } else {
            // Sinon le quizz est terminé et le score est affiché
            dataContainer.innerHTML = `<p>Quizz fini. Votre score est de ${score}/${questions.length}</p>`;
            stopButton.style.display = "flex";
          }
        }, 1000); // Délai de 1 seconde (1000 millisecondes)
      });
    });
  }
});
