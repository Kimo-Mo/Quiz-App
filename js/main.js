// Selection of Elements
const quizApp = document.querySelector(".quiz__app");
const category = document.querySelector(".category span");
const count = document.querySelector(".count span");
const quizArea = document.querySelector(".quiz__area");
const answersArea = document.querySelector(".answer__area");
const submitBtn = document.querySelector(".submit__btn");
const bullets = document.querySelector(".bullets");
const time = document.querySelector(".time");
const result = document.querySelector(".result");
const degree = document.querySelector(".result .degree");
const score = document.querySelector(".result .score");
const current = document.querySelector(".current");

// Setting vars
let countDownInterval;

createStartBtn("html");
// Function to fetch questions and start the quiz
async function getQuestions(lang) {
  const response = await fetch(`json/${lang}_questions.json`);
  clearData();
  if (response.status === 200) {
    let index = 0;
    let rightAnswers = 0;
    let data = await response.json();
    let QCount = data.length;
    if (index < QCount) {
      createBullets(QCount);
      handleBullets(index);
      addQData(data[index], QCount, index);
      countDown(10, QCount, index);
      submitBtn.addEventListener("click", () => {
        let correct = data[index].right_answer;
        index++;
        if (checkAnswer(correct)) {
          rightAnswers++;
        }
        clearData();
        addQData(data[index], QCount, index);
        handleBullets(index);
        clearInterval(countDownInterval);
        countDown(5, QCount, index);
        showResult(QCount, index, rightAnswers);
      });
    }
  }
}
// Function to clear quiz areas
function clearData() {
  quizArea.innerHTML = "";
  answersArea.innerHTML = "";
}

// Function to create start button
function createStartBtn(lang) {
  category.textContent = lang;
  result.style.display = "none";
  current.style.display = "none";
  submitBtn.style.display = "none";
  answersArea.style.display = "flex";
  quizArea.style.display = "block";
  let startBtn = document.createElement("button");
  startBtn.innerHTML = "start";
  startBtn.className = "startBtn";
  answersArea.appendChild(startBtn);
  clearInterval(countDownInterval);
  // Start Quiz App
  startBtn.onclick = () => {
    submitBtn.style.display = "block";
    current.style.display = "flex";
    getQuestions(lang);
  };
}
// Function to create bullets
function createBullets(num) {
  count.textContent = num;
  bullets.innerHTML = "";
  for (let i = 0; i < num; i++) {
    const bulletSpan = document.createElement("span");
    bullets.appendChild(bulletSpan);
    if (i === 0) {
      bulletSpan.classList.add("active");
    }
  }
}
// Function to add question data
function addQData(obj, count, index) {
  if (index < count) {
    const question = document.createElement("h2");
    question.textContent = obj.title;
    quizArea.appendChild(question);
    for (let i = 1; i <= 4; i++) {
      const input = document.createElement("input");
      input.type = "radio";
      input.id = `answer_${i}`;
      input.setAttribute("Name", "question");
      input.dataset.answer = obj[`answer_${i}`];
      answersArea.appendChild(input);
      const answer = document.createElement("label");
      answer.className = "btn";
      answer.setAttribute("for", `answer_${i}`);
      answer.textContent = obj[`answer_${i}`];
      answersArea.appendChild(answer);
    }
  }
}
// Function to check answers
function checkAnswer(right_answer) {
  const answers = document.getElementsByName("question");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  return right_answer === theChosenAnswer;
}
// Function to handle bullets
function handleBullets(index) {
  const bulletSpans = document.querySelectorAll(".bullets span");
  bulletSpans.forEach((span, i) => {
    if (index === i) {
      span.className = "active";
    }
  });
}
// Function to show the result
function showResult(count, index, rAnswer) {
  if (index === count) {
    quizArea.style.display = "none";
    answersArea.style.display = "none";
    submitBtn.style.display = "none";
    current.style.display = "none";
    degree.textContent =
      rAnswer === count ? "perfect" : rAnswer >= count / 2 ? "good" : "bad";
    degree.classList.remove(degree.className);
    degree.classList.add(
      rAnswer === count ? "perfect" : rAnswer >= count / 2 ? "good" : "bad"
    );
    score.textContent = `${rAnswer}/${count}`;
    result.style.display = "block";
    createRestartBtn();
  }
}
function createRestartBtn() {
  answersArea.style.display = "flex";
  let reStartBtn = document.createElement("button");
  reStartBtn.innerHTML = "restart";
  reStartBtn.className = "startBtn";
  answersArea.appendChild(reStartBtn);
  reStartBtn.onclick = () => {
    result.style.display = "none";
    answersArea.style.display = "flex";
    quizArea.style.display = "block";
    submitBtn.style.display = "block";
    current.style.display = "flex";
    getQuestions("html");
  };
}
// Function for countdown timer
function countDown(duration, count, index) {
  if (index < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      time.textContent = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
