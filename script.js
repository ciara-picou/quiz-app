let questionCount = 0;
let score = 0;
let ans;
let timedOut = 0;
let rand;
let record = [];
let status = 0;

function $(id) {
  return document.getElementById(id);
}
let quiz = $("quiz");
let quizSet = $("quizSet");
let resultBox = $("resultBox");
let question = $("question");
let option1 = $("option1");
let option2 = $("option2");
let option3 = $("option3");
let option4 = $("option4");
let submit = $("submit");
let progress = $("progress");
let result = $("result");
let retake = $("retake");
let button1 = $("btn1");
let button2 = $("btn2");
let button3 = $("btn3");
let button4 = $("btn4");

var tracker;
var countDown;
var secsInput = 5;
var seconds = secsInput;
var t;

//load the question into the app

//set the question
function setQuestion(qCount, rand) {
  let ques = questions[rand];
  question.textContent = qCount + 1 + ". " + ques.question;
  option1.textContent = ques.option1;
  option2.textContent = ques.option2;
  option3.textContent = ques.option3;
  option4.textContent = ques.option4;
}

//adjust the progress bar
function changeProgressBar(qCount) {
  progress.textContent = `Question ${qCount + 1} of 10 `;
  tracker = $("no" + (qCount + 1));
  tracker.style.backgroundColor = "#a06cd5";
}

//reset the option button's text and background to the original color scheme

function defaultOptionColors() {
  button1.style.backgroundColor = "#e0aaff";
  button2.style.backgroundColor = "#e0aaff";
  button3.style.backgroundColor = "#e0aaff";
  button4.style.backgroundColor = "#e0aaff";
  option1.style.color = "#3c096c";
  option2.style.color = "#3c096c";
  option3.style.color = "#3c096c";
  option4.style.color = "#3c096c";
}

function getQuestion(qCount, rand) {
  if (qCount == 9) {
    submit.textContent = "Submit Quiz";
  }
  if (qCount > 9) {
    return;
  }
  setQuestion(qCount, rand);
  changeProgressBar(qCount);
  defaultOptionColors();

  startTimer(seconds, "timer");
}

//change the tracker's color in response to correct / incorrect answers
function setCorrect() {
  score++;
  tracker.style.backgroundColor = "#9bfb92";
}

function setWrong() {
  tracker.style.backgroundColor = "#d61415";
}

function finalScore() {
  if (score > 7) {
    result.textContent = ` 🎉 You scored ${score * 10}% 🎉 `;
  } else if (score > 5) {
    result.textContent = `You scored ${score * 10}%`;
  } else {
    result.textContent = `🤓 Practice makes perfect. Try again 🤓`;
  }
}

function setResultPage() {
  quizSet.style.display = "none";
  resultBox.style.display = "block";
  progress.textContent = "Quiz Completed";
  timer.textContent = "00:00";
  finalScore();
}

//select a quiz question at random
function randomGenerator() {
  while (status === 0) {
    rand = Math.round(Math.random() * questions.length);
    if (rand !== questions.length) {
      for (let j = 0; j < record.length; j++) {
        if (rand === record[j]) {
          break;
        } else if (j === record.length - 1) {
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
    clearTimeout(countDown);
    //call the next question or set the result page

    //no option selected - wrong

    //button1.style.backgroundColor will return an rgb value even if you set it with a hexadecimal value in the css file
    //when comparing be sure to use an rgb value or you could get a false return value when you are expecting true
    if (
      button1.style.backgroundColor !== "rgb(155, 251, 146)" &&
      button2.style.backgroundColor !== "rgb(155, 251, 146)" &&
      button3.style.backgroundColor !== "rgb(155, 251, 146)" &&
      button4.style.backgroundColor !== "rgb(155, 251, 146)"
    ) {
      //if we are at the last question
      if (questionCount == 9) {
        setWrong();
        setResultPage();
        return;
      }
      setWrong();
      secs = secsInput;
      getQuestion(++questionCount, randomGenerator());
    } else {
      //They've selected an option
      if (questionCount == 9) {
        if (ans === questions[rand].answer) {
          setCorrect();
        } else {
          setWrong();
        }
        setResultPage();
        return;
      }

      if (ans == questions[rand].answer) {
        setCorrect();
        secs = secsInput;
        getQuestion(++questionCount, randomGenerator());
      } else {
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
//make the option selection work
option1.addEventListener("click", optionSelect);
option2.addEventListener("click", optionSelect);
option3.addEventListener("click", optionSelect);
option4.addEventListener("click", optionSelect);

function optionSelect(e) {
  //get parent element and change bakgroun color
  var parentEl = e.target.parentElement;
  parentEl.style.backgroundColor = "#9bfb92";

  //switch statement => reset other buttons to their default colors
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
    case "option4 ":
      button1.style.backgroundColor = "#e0aaff";
      button2.style.backgroundColor = "#e0aaff";
      button3.style.backgroundColor = "#e0aaff";
      break;
  }
  //set the ans value based on the option selected
  ans = parseInt(e.target.id("option", ""), 10);
}
startTimer(4, "timer");
// button1.style.backgroundColor = "#9bfb92";
// button2.style.backgroundColor = "#d61415";
