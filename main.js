// This function is fine as it is. I could easily make it more generic when I learn how to read in
// data from files or databases.

function generateQuestions() {
  var questionsAndAnswers = [
    { question: "What is the capital of Ferelden?",
      answer: [ "Ostagar", "Jaundice", "Honnleath", "Denerim", "Gwaren" ],
      rightAnswer: 3 },

    { question: "Which term is used to refer to mages who have had their magical abilities severed?",
      answer: [ "Abomination", "Tranquil", "Eluvian", "Orzammar" ],
      rightAnswer: 1 },

    { question: "What class is Aveline Vallen, one of Hawke's companions in Dragon Age 2?",
      answer: [ "Warrior", "Rogue", "Darkspawn", "Mage" ],
      rightAnswer: 0 },

    { question: "The magical ritual that recruits must undergo in order to become members of the legendary group of heroes known as the Grey Wardens is called:",
      answer: [ "Val Royeaux", "The Harrowing", "Tal-Vashoth", "The Joining" ],
      rightAnswer: 3 },

    { question: "In which Dragon Age novel did Cole appear before he became a companion in Dragon Age: Inquisition?",
      answer: [ "<i>Last Flight</i>", "<i>The Stolen Throne</i>", "<i>The Calling</i>", "<i>Asunder</i>" ],
      rightAnswer: 3 },

    { question: "What is the name of the guild of assassins that Zevran Aranai worked for in Dragon Age: Origins?",
      answer: [ "The Orlesian Fins", "The Ferelden Hounds", "The Antivan Crows", "The Free Marchers" ],
      rightAnswer: 2 },

    { question: "What is Bianca?",
      answer: [ "A dwarven woman", "A crossbow", "A ship", "A and C", "A and B" ],
      rightAnswer: 4 },

    { question: "What are Hawke's siblings' names?",
      answer: [ "Alistair and Isabela", "Bethany and Carver", "Samson and Sera", "Bethany and Alistair" ],
      rightAnswer: 1 },

    { question: "Morrigan is the daughter of ___________, an ancient, powerful witch.",
      answer: [ "Merrill", "Flemeth", "Vivienne", "Solas" ],
      rightAnswer: 1 },

    { question: "Put these royal Ferelden ranks in order from most to least powerful:",
      answer: [ "Arl, teyrn, bann", "Teyrn, arl, bann", "Teyrn, bann, arl", "Bann, teyrn, arl" ],
      rightAnswer: 1 } ];

  return questionsAndAnswers;
}





// I could have attached the user's right answers to the array of objects that handles the questions,
// but I prefer things this way. Is it less efficient?

function initializeAnswers(numberOfQuestions) {
  // initializes the array of user's answers to 'unanswered'
  var usersAnswers = [];

  for (var i = 0; i < numberOfQuestions; i++) {
    usersAnswers.push('unanswered');
  }
  return usersAnswers;
}





function displayQuestion(currentQuestion, questionsAndAnswers) {
  // prints the current question, its answers, and the question number
  var labelText = 'Question ' + (currentQuestion+1) + ' of 10';
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
  $('.checkboxChoices').removeClass("invisible");
  $('.checkboxChoices').html(answerText);
}





function displayAnswerStreak(usersAnswers) {
  // generates the footer based on an array of strings designating whether the user got the question right or not
  var footerText = '';

  $('footer').removeClass("no-response");

  // Would a .map() or .each() method here be any more economical?
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





function determineRightOrWrong(currentQuestion, questionsAndAnswers, usersAnswers, usersChoice) {
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
    $('.answerBlurb').html('You are incorrect!<br>' + currentAnswer + ' is the correct answer.');
    usersAnswers[currentQuestion] = "incorrect";
  }
  return usersAnswers;
}





// My main problem with my code are all in this function. I wanted to 

function startTheQuiz () {
  // a boolean used to indicate that the quiz has begun; used for initialization purposes
  var quizBegun = false;

  // a boolean used to pause on the answer screen and tell the user if they are right or wrong
  var answerPause = false;

  // an integer indicating the index of the current question
  var questionNumber = 0;

  // an array of objects storing the quiz questions and answers
  var questionsAndAnswers = generateQuestions();

  // an array of booleans used to keep track of which questions the user answered correctly
  var usersAnswers = initializeAnswers(questionsAndAnswers.length);

  $('.checkboxChoices').addClass("invisible");

  $('.main').on('click', '.answerButton', function(event) {
    event.preventDefault();

    if (!quizBegun)
    {
      // this button click signifies that the quiz is beginning anew; it should only display the first question,
      // not check for an answer
      $('h1').html("Dragon Age Quiz");
      displayQuestion(questionNumber, questionsAndAnswers);
      displayAnswerStreak(usersAnswers);
      quizBegun = true;
    }
    else if ((questionNumber < questionsAndAnswers.length) && (!answerPause))
    {
      // the quiz is in progress
      // this button click should check to make sure an answer has been chosen, then compare it to the correct answer and
      // update the array that keeps track of correct/incorrect answers

      var currentCheckbox = '';
      var currentAnswer = null;

      for (var i = 0; i < questionsAndAnswers[questionNumber].answer.length; i++)
      {
        currentCheckbox = '#answer' + i;

        if ($(currentCheckbox).is(':checked'))
        {
          currentAnswer = i;
          break;
        }
      }

      if (currentAnswer === null)
      {
        // the user didn't click a radio button
        $('footer').addClass("no-response");
        $('footer').html("Please enter a response to this question in order to continue.");
      }
      else
      {
        // find out if the answer the user gave is correct
        usersAnswers = determineRightOrWrong(questionNumber, questionsAndAnswers, usersAnswers, currentAnswer);
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
        displayAnswerStreak(usersAnswers);
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
            // determining how many the user got right total
            numberRight++;
          }
        }

        // display your score
        $('h1').html('Congratulations!');
        $('.questionLabel').html('');
        $('h2').html('You answered ' + numberRight + ' out of 10 correctly!');

	if (numberRight === 0)
	  $('.checkboxChoices').html("Dragons? Ages? You don't know. Maybe if you give the quiz another go, you'll begin to understand.");
        else if ((numberRight >= 1) && (numberRight <= 3))
          $('.checkboxChoices').html("You're a really competent guesser!");
        else if ((numberRight >= 4) && (numberRight <= 6))
          $('.checkboxChoices').html("An average showing! You certainly could have done worse, but you might do better if you...");
        else if ((numberRight === 7) || (numberRight ===8))
          $('.checkboxChoices').html("Respectable! You know the world of Dragon Age better than most! There's no shame in stopping here, or you can show everyone what you <i>truly</i> know and...");
        else
          $('.checkboxChoices').html("You are a Dragon Age master!<br><br>From Orlais to the Free Marches, the Tevinter Imperium to the Kokari Wilds, you know it all.");

        $('.answerButton').html('Try Again!');

        quizBegun = false;
        questionNumber = 0;
        usersAnswers = initializeAnswers(questionsAndAnswers.length);
      }
    }
  });
}


$(startTheQuiz);