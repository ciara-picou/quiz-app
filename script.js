//Set and initialize variables

var questionCount = 0;
var score = 0;
var ans;
var timedOut = 0;
var rand;
var record = [];
var status = 0;

function $(id) {
  return document.getElementById(id);
}

var quiz = $("quiz");
var quizSet = $("quizSet");
var resultBox = $("resultBox");
var question = $("question");
var option1 = $("option1");
var option2 = $("option2");
var option3 = $("option3");
var option4 = $("option4");
var submit = $("submit");
var progress = $("progress");
var result = $("result");
var retake = $("retake");
var button1 = $("btn1");
var button2 = $("btn2");
var button3 = $("btn3");
var button4 = $("btn4");

var tracker;
var countDown;
var secsInput = 60;
var seconds = secsInput;
var t;

// Load current question into the app
//Set the question
function setQuestion(qCount, rand) {
  var ques = questions[rand];
  question.textContent = qCount + 1 + ". " + ques.question;
  option1.textContent = ques.option1;
  option2.textContent = ques.option2;
  option3.textContent = ques.option3;
  option4.textContent = ques.option4;
}

function changeProgressBar(qCount) {
  progress.innerHTML = "Question " + (qCount + 1) + " of 10";
  tracker = $("no" + (qCount + 1));
  tracker.style.backgroundColor = "#8900f2";
}

function defaultOptionColors() {
  button1.style.backgroundColor = "#e0aaff";
  button2.style.backgroundColor = "#e0aaff";
  button3.style.backgroundColor = "#e0aaff";
  button4.style.backgroundColor = "#e0aaff";
}

function getQuestion(qCount, rand) {
  if (qCount == 9) {
    //final question edge case
    submit.innerHTML = "Submit Test";
    submit.style.backgroundColor = "#00b300";
  }

  if (qCount > 9) {
    return;
  }

  setQuestion(qCount, rand);
  changeProgressBar(qCount);
  defaultOptionColors();

  startTimer(seconds, "timer");
}

//set result
function setCorrect() {
  score++;
  tracker.style.backgroundColor = "#009900";
}

function setWrong() {
  tracker.style.backgroundColor = "#ce2d4f";
}
//display final score
function finalScore() {
  if (score > 7) {
    result.innerHTML = ` 🎉 You scored ${score * 10}% 🎉 `;
  } else if (score > 5) {
    result.innerHTML = `You scored ${score * 10}%`;
  } else {
    result.innerHTML = `🤓 Practice makes perfect. Please try again 🤓`;
  }
}
//when the quiz is completed
function setResultPage() {
  quizSet.style.display = "none";
  resultBox.style.display = "block";
  progress.innerHTML = "Quiz Completed";
  timer.textContent = "00:00";
  finalScore();
}

//Generate random unused index
function randomGenerator() {
  while (status == 0) {
    rand = Math.round(Math.random() * questions.length);
    if (rand !== questions.length) {
      //run through record array to find if its unique
      for (var j = 0; j < record.length; j++) {
        if (rand === record[j]) {
          break;
        } else if (j == record.length - 1) {
          record[questionCount] = rand;
          status = 1;
        }
      }
    }
  }
  status = 0;

  return rand;
}

//Timer function
function startTimer(secs, elem) {
  t = $(elem);
  t.innerHTML = "00:" + secs;

  if (secs < 0) {
    //The clearTimeout() method clears a timer set with the setTimeout() method.
    clearTimeout(countDown);
    //call the next question or set the result page
    //no option selected
    if (
      //button1.style.backgroundColor will return an rgb value even if you set it with a hexadecimal value in the css file
      //when comparing be sure to use an rgb value or you could get a false return value when you are expecting true
      button1.style.backgroundColor !== "rgb(26, 255, 26)" &&
      button2.style.backgroundColor !== "rgb(26, 255, 26)" &&
      button3.style.backgroundColor !== "rgb(26, 255, 26)" &&
      button4.style.backgroundColor !== "rgb(26, 255, 26)"
    ) {
      //final question edge case
      if (questionCount == 9) {
        setWrong();
        setResultPage();
        return;
      }
      setWrong();
      secs = secsInput;
      getQuestion(++questionCount, randomGenerator());
    } else {
      //an option has been selected
      //final question edge case
      if (questionCount == 9) {
        if (ans === questions[rand].answer) {
          // the selected option is correct
          setCorrect();
        } else {
          //the selected option is incorrect
          setWrong();
        }
        setResultPage();
        return;
      }
      //an option has been selected
      //there are still more questions ahead
      if (ans == questions[rand].answer) {
        // the selected option is correct
        setCorrect();
        secs = secsInput;
        getQuestion(++questionCount, randomGenerator());
      } else {
        //the selected option is incorrect
        setWrong();
        secs = secsInput;
        getQuestion(++questionCount, randomGenerator());
      }
    }
    return;
  }

  secs--;
  //recurring function
  countDown = setTimeout("startTimer(" + secs + ',"' + elem + '")', 1000);
}

//option selection functionality
option1.addEventListener("click", optionSelect);
option2.addEventListener("click", optionSelect);
option3.addEventListener("click", optionSelect);
option4.addEventListener("click", optionSelect);

function optionSelect(e) {
  //get parent element and change background color
  var parentEl = e.target.parentElement;
  parentEl.style.backgroundColor = "#1aff1a";

  //switch statement => resets the selected button's color from green back to its default color
  switch (e.target.id) {
    case "option1":
      button2.style.backgroundColor = "#e0aaff";
      button3.style.backgroundColor = "#e0aaff";
      button4.style.backgroundColor = "#e0aaff";
      break;
    case "option2":
      button1.style.backgroundColor = "#e0aaff";
      button3.style.backgroundColor = "#e0aaff";
      button4.style.backgroundColor = "#e0aaff";
      break;
    case "option3":
      button1.style.backgroundColor = "#e0aaff";
      button2.style.backgroundColor = "#e0aaff";
      button4.style.backgroundColor = "#e0aaff";
      break;
    case "option4":
      button1.style.backgroundColor = "#e0aaff";
      button2.style.backgroundColor = "#e0aaff";
      button3.style.backgroundColor = "#e0aaff";
      break;
  }

  //set ans value based on the option selected
  ans = parseInt(e.target.id.replace("option", ""), 10);
}

//Load the next question once the next question button is clicked
submit.addEventListener("click", nextQuestion);

function nextQuestion() {
  //no option selected edge case
  if (
    button1.style.backgroundColor !== "rgb(26, 255, 26)" &&
    button2.style.backgroundColor !== "rgb(26, 255, 26)" &&
    button3.style.backgroundColor !== "rgb(26, 255, 26)" &&
    button4.style.backgroundColor !== "rgb(26, 255, 26)"
  ) {
    alert("Please select an option");
    return;
  } else {
    clearTimeout(countDown);
    secs = secsInput;

    //final question edge case - load result page
    if (questionCount == 9 && questionCount != 10) {
      if (ans == questions[rand].answer) {
        setCorrect();
      } else {
        setWrong();
      }
      setResultPage();
      return;
    }

    if (ans == questions[rand].answer) {
      setCorrect();
      getQuestion(++questionCount, randomGenerator());
    } else {
      setWrong();
      getQuestion(++questionCount, randomGenerator());
    }
  }
}

//Retake button
retake.addEventListener("click", retakeTest);

function retakeTest() {
  //The reload() method is used to reload the current document.
  //The reload() method does the same as the reload button in your browser.
  window.location.reload();
}

//Initial setup
//get the first random question to kick the quiz off
rand = Math.round(Math.random() * questions.length);
//edge case when rand equals questions.length
//given that indices begin at 0 we will only have questions.length - 1 indices to choose from
//if rand == questions.length questions[rand] will be undefined
while (rand == questions.length) {
  rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

//onload function
//onload ...when the window is loaded
//The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets
// and images. This is in contrast to DOMContentLoaded, which is fired as soon as the
//page DOM has been loaded, without waiting for resources to finish loading.
window.onload = getQuestion(questionCount, rand);
