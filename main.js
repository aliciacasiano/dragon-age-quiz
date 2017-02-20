function generateQuestions() {
  var questionsAndAnswers = [
    { question: "What class is Aveline?",
      answer: [ "warrior", "rogue", "darkspawn", "mage" ],
      rightAnswer: 0 },

    { question: "In which Dragon Age novel did Cole appear before he became a companion in Dragon Age: Inquisition?",
      answer: [ "<i>Last Flight</i>", "<i>The Stolen Throne</i>", "<i>The Calling</i>", "<i>Asunder</i>" ],
      rightAnswer: 3 },

    { question: "What is the name of the guild of assassins that Zevran Aranai worked for in Dragon Age: Origins?",
      answer: [ "The Orlesian Fins", "The Ferelden Hounds", "The Antivan Crows", "The Free Marchers" ],
      rightAnswer: 2 },

    { question: "What is the capital of Ferelden?",
      answer: [ "Ostagar", "Jaundice", "Honnleath", "Denerim", "Gwaren" ],
      rightAnswer: 3 },

    { question: "Put these royal Ferelden ranks in order from most to least powerful:",
      answer: [ "arl, teyrn, bann", "teyrn, arl, bann", "teyrn, bann, arl", "bann, teyrn, arl" ],
      rightAnswer: 1 },

    { question: "What are Hawke's siblings' names?",
      answer: [ "Alistair and Isabela", "Bethany and Carver", "Samson and Sera", "Bethany and Alistair" ],
      rightAnswer: 1 },

    { question: "What is Bianca?",
      answer: [ "a dwarven woman", "a crossbow", "a ship", "A and C", "A and B" ],
      rightAnswer: 4 },

    { question: "What term is used to denote mages who have had their magical abilities severed?",
      answer: [ "abominations", "tranquil", "eluvian", "orzammars" ],
      rightAnswer: 1 },

    { question: "The magical ritual that recruits must undergo in order to become members of the legendary group of heroes known as the Grey Wardens is called:",
      answer: [ "Val Royeaux", "the Harrowing", "Tal-Vashoth", "the Joining" ],
      rightAnswer: 3 },

    { question: "Morrigan is the daughter of ___________, a powerful, ancient witch.",
      answer: [ "Merrill", "Flemeth", "Vivienne", "Solas" ],
      rightAnswer: 1 } ];

  return questionsAndAnswers;
}


function initializeAnswers(numberOfQuestions) {
  // initializes the array of user's answers to 'unanswered'
  // over the course of the quiz, each question will be set to 'correct' or 'incorrect' depending on the answer
  var usersAnswers = [];

  for (var i = 0; i < numberOfQuestions; i++) {
    usersAnswers.push('unanswered');
  }
  return usersAnswers;
}


function displayQuestion(currentQuestion, questionsAndAnswers) {
  // generating the question text
  var labelText = (currentQuestion+1) + ' of 10';
  var mainText = questionsAndAnswers[currentQuestion].question;
  var answerText = '<form>';

  for (var i = 0; i < questionsAndAnswers[currentQuestion].answer.length; i++)
  {
    answerText += '<p class="answer' + i + '"><input type="radio" name="answerChoice" id="answer' + i +
      '"> ' + questionsAndAnswers[currentQuestion].answer[i] + '</p>';
  }

  answerText += '</form>';

  $('.questionLabel').html(labelText);
  $('h2').html(mainText);
  $('.checkboxChoices').html(answerText);
}


function displayAnswers(usersAnswers) {
  // generates the footer based on an array of strings designating whether the user got the question right or not
  var footerText = '';

  $('footer').removeClass("no-response");

  for (var i = 0; i < usersAnswers.length; i++) {
    if (usersAnswers[i] === 'unanswered')
      footerText += '<span class="unanswered">&#8226;</span> '; // gray bullet
    else if (usersAnswers[i] === 'correct')
      footerText += '<span class="correct">&#10004;</span> '; // green check
    else if (usersAnswers[i] === 'incorrect')
      footerText += '<span class="incorrect">&#10008;</span> '; // red x
  }
  $('footer').html(footerText);
}


function catchAnswer(currentQuestion, questionsAndAnswers, usersAnswers, usersChoice) {
  // determines whether or not the user got the question right and returns an updated array of the user's correct/incorrect responses
  var currentAnswer;

  if (questionsAndAnswers[currentQuestion].rightAnswer === usersChoice)
  {
    // the answer is right
    $('.answerBlurb').addClass("right");
    $('.answerBlurb').html('You are correct!');
    usersAnswers[currentQuestion] = "correct";
  }
  else
  {
    // the answer is wrong
    $('.answerBlurb').addClass("wrong");
    currentAnswer = questionsAndAnswers[currentQuestion].answer[questionsAndAnswers[currentQuestion].rightAnswer];
    $('.answerBlurb').html('You are incorrect! ' + currentAnswer + ' is the correct answer.');
    usersAnswers[currentQuestion] = "incorrect";
  }
  return usersAnswers;
}


function startTheQuiz () {
  // boolean to indicate the quiz has begun used for initialization purposes
  var quizBegun = false;

  // a messy way to get the quiz to pause on the answer screen to show the user the correct answer when they
  // get the question wrong
  var answerPause = false;

  // an integer indicating the index of the current question; initially set to 0 to show the quiz has yet to begin
  var questionNumber = 0;

  // an array of objects storing the quiz questions and answers
  var questionsAndAnswers = generateQuestions();

  // an array of booleans that will keep track of which questions the user answered correctly
  var usersAnswers = initializeAnswers(questionsAndAnswers.length);

  $('.main').on('click', '.answerButton', function(event) {
    event.preventDefault();

    if (!quizBegun)
    {
      // the button click signifies the quiz is beginning and it should only display the first question, not check for an answer
      $('h1').html("Dragon Age Quiz");
      $('.checkboxChoices').html('');
      displayQuestion(questionNumber, questionsAndAnswers);
      displayAnswers(usersAnswers);
      quizBegun = true;
    }
    else if ((questionNumber < questionsAndAnswers.length) && (!answerPause))
    {
      // the quiz is in progress
      // a button click should check to make sure an answer has been chosen, then compare it to the correct answer and
      // update the array that keeps track of correct/incorrect answers

      var currentCheckbox = '';
      var currentAnswer = -1;

      for (var i = 0; i < questionsAndAnswers[questionNumber].answer.length; i++)
      {
        currentCheckbox = '#answer' + i;

        if ($(currentCheckbox).is(':checked'))
        {
          currentAnswer = i;

          // break out of for loop
          i = questionsAndAnswers[questionNumber].answer.length;
        }
      }

      if (currentAnswer === -1)
      {
        // the user didn't click a radio button
        $('footer').addClass("no-response");
        $('footer').html("Please enter a response to this question in order to continue.");
      }
      else
      {
        // find out if the answer the user gave is correct
        usersAnswers = catchAnswer(questionNumber, questionsAndAnswers, usersAnswers, currentAnswer);
        $('footer').removeClass("no-response");
        $('footer').html("");

        // set a boolean to pause until another button click so the user can see if their answer
        // was correct
        answerPause = true;
      }
    }

    else if ((questionNumber < questionsAndAnswers.length) && answerPause)
    {
      // move on to the next question after click so the user can see the answers
      questionNumber++;
      if (questionNumber < questionsAndAnswers.length)
      {
        displayQuestion(questionNumber, questionsAndAnswers);
        displayAnswers(usersAnswers);
      }
      $('.answerBlurb').removeClass("right");
      $('.answerBlurb').removeClass("wrong");
      $('.answerBlurb').html("");
      answerPause = false;

      if (questionNumber === questionsAndAnswers.length)
      {
        // the user has answered all questions and will be given their score and the option to restart
        var numberRight = 0;

        for (var i = 0; i < usersAnswers.length; i++)
        {
          if (usersAnswers[i] === 'correct')
          {
            numberRight++;
          }
        }

        // display your score
        $('h1').html('Congratulations!');
        $('.questionLabel').html('');
        $('h2').html('You answered ' + numberRight + ' out of 10 correctly!');

        if ((numberRight >= 1) && (numberRight <= 3))
          $('.checkboxChoices').html('1 to 3');
        else if ((numberRight >= 4) && (numberRight <= 6))
          $('.checkboxChoices').html('4 to 6');
        else if ((numberRight === 7) || (numberRight ===8))
          $('.checkboxChoices').html('7 or 8');
        else
          $('.checkboxChoices').html('9 or 10');

        $('.answerButton').html('Play Again!');

        quizBegun = false;
        questionNumber = 0;
        usersAnswers = initializeAnswers(questionsAndAnswers.length);
      }
    }
  });
}


$(startTheQuiz);