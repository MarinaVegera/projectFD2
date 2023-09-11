/* -------- begin view --------- */
function TestPageView() {
    this.audioLoss = new Audio('../sounds/loss.mp3');
    this.audioWin = new Audio('../sounds/win.mp3');
}
TestPageView.prototype.init = function (block) {
    this.myBlock = block;
    this.showTiming();
}

TestPageView.prototype.showTestInfo = function (questionedFlag, shuffledArray) {
    this.myBlock.innerHTML = '';
    this.myBlock.classList.add("test-block");
    this.myBlock.classList.remove("page-block")
    //рисуем флаг
    let correctCountryFlag = questionedFlag;
    const flagBlock = document.createElement('div');
    flagBlock.classList.add('flag-block');
    const flagElement = document.createElement('img');
    flagElement.src = correctCountryFlag;
    flagElement.classList.add('flag-element');
    flagBlock.append(flagElement);
    this.myBlock.append(flagBlock);
    const countriesBlock = document.createElement('div');
    countriesBlock.classList.add("countries-block");
    this.myBlock.append(countriesBlock);
    //рисуем варианты
    let shuffleArrayCountriesName = shuffledArray;
    for (i = 0; i < shuffleArrayCountriesName.length; i++) {
        let nameElement = document.createElement('button');
        nameElement.setAttribute('country-name', shuffleArrayCountriesName[i]);
        nameElement.classList.add("quiz-answer-options-btn");
        nameElement.textContent = shuffleArrayCountriesName[i];
        countriesBlock.append(nameElement);
    }
    //рисуем кнопки перехода
    this.myBlock.innerHTML += `
    <div class="navigation-container-testpage">
    <button class="try-again-btn navigation-btn">Try Again</button>
    <button class="to-main-page-btn-testpage navigation-btn">Home Page</button>
    </div>
    `
}

TestPageView.prototype.showTiming = function () {
    const timeBlock = document.createElement('div');
    timeBlock.classList.add("time-block");
    const timeProgress = document.createElement('div');
    timeProgress.classList.add("time-progress");
    timeBlock.append(timeProgress);
    this.myBlock.before(timeBlock);
    const totalTime = 59;
    let currentTime = totalTime;
    let startTime = null;

    function updateProgressBar(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }
        const elapsedTime = timestamp - startTime;
        currentTime = totalTime - Math.floor(elapsedTime / 1000);
        const progressWidth = (currentTime / totalTime) * 100;
        timeProgress.style.width = `${progressWidth}%`;
        requestAnimationFrame(updateProgressBar);
    }
    requestAnimationFrame(updateProgressBar);
}
TestPageView.prototype.showRightResult = function (answerElement) {
    this.audioWin.play();
    answerElement.classList.add("right-answer-btn");

}

TestPageView.prototype.showWrongResult = function (answerElement, correctButton) {
    answerElement.classList.add("wrong-answer-btn");
    correctButton.classList.add("right-answer-btn");
    this.audioLoss.play();
}

TestPageView.prototype.removeResultStyles = function () {
    Array.from(this.myBlock.querySelectorAll("button")).forEach(button => {
        button.classList.remove('right-answer-btn');
        button.classList.remove('wrong-answer-btn');
    });
}

TestPageView.prototype.clearTestInfo = function () {
    this.myBlock.innerHTML = "";
}

TestPageView.prototype.showGameOver = function (roundScore) {
    // Отображение надписи "Игра окончена"
    this.myBlock.innerHTML = `
    <div class="game-over-message-container">
    <div class="game-over-message">Game Over!</div>
    <div class="score-message">You earned ${roundScore} scores</div>
    </div>`;
    this.myBlock.innerHTML += `
    <div class="navigation-container-testpage">
    <button class="try-again-btn navigation-btn">Try Again</button>
    <button class="to-main-page-btn-testpage navigation-btn">Home Page</button>
    </div>
  `
}
/* -------- end view --------- */

/* ------- begin model ------- */
function TestPageModel() {
    let myView = null;
    this.apiUrl = 'https://restcountries.com/v3.1/all';
    this.correctCountryName = '';
    this.gamePoints = 0;
    this.highScore = 0;
    this.storageKey = "userData";
    this.storageUserKey = "userKey";
    this.userData = {};
}

TestPageModel.prototype.init = function (view) {
    myView = view;
}

//информация для отображения на странице
TestPageModel.prototype.createTestInfo = async function () {
    const countriesData = await this.getCountriesData();
    // Выбираем случайную страну для вопроса
    const randomCountryIndex = Math.floor(Math.random() * countriesData.length);
    const questionCountry = countriesData[randomCountryIndex];
    // Получаем флаг и правильное название страны
    this.correctCountryName = questionCountry.name.common;
    const correctCountryFlag = questionCountry.flags.png;
    // Формируем массив из 4 стран
    let arrayCountriesName = [this.correctCountryName];
    let countriesDataWithoutQuestioned = countriesData.slice(0, randomCountryIndex).concat(countriesData.slice(randomCountryIndex + 1));
    for (let i = 0; i < 3; i++) {
        let otherCountryIndex = Math.floor(Math.random() * countriesDataWithoutQuestioned.length);
        let randomCountry = countriesDataWithoutQuestioned[otherCountryIndex];
        let randomCountryName = randomCountry.name.common;
        arrayCountriesName.push(randomCountryName)
    }
    this.setInfoForRendering(correctCountryFlag, arrayCountriesName);
}

TestPageModel.prototype.setInfoForRendering = function (flag, array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
        [array[i], array[j]] = [array[j], array[i]];
    }
    myView.showTestInfo(flag, array);
    //return array
}

// получаем данные о странах из API
TestPageModel.prototype.getCountriesData = async function () {
    try {
        const response = await fetch(this.apiUrl);
        const countriesData = await response.json();
        return countriesData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

TestPageModel.prototype.checkAnswer = function (answerElement, myBlock) {
    const isCorrect = this.correctCountryName === answerElement.textContent;
    const correctButton = Array.from(myBlock.querySelectorAll('button')).find(button => button.textContent === this.correctCountryName);
    myView.removeResultStyles();
    if (isCorrect) {
        myView.showRightResult(answerElement);
        this.countWithRightAnswers();
    } else {
        myView.showWrongResult(answerElement, correctButton);
        this.countWithWrongAnswers();
    }
}

TestPageModel.prototype.clearTestInfo = function () {
    myView.clearTestInfo();
}

TestPageModel.prototype.countWithRightAnswers = function () {
    this.gamePoints += 1;
}

TestPageModel.prototype.countWithWrongAnswers = function () {
    this.gamePoints -= 1;
}

TestPageModel.prototype.showGameOver = function () {
    myView.showGameOver(this.gamePoints);
}

TestPageModel.prototype.updateTotalScoreLocalStorage = function () {
    this.userData = this.getlocalStorageUserData();
    if (this.userData) {
        const userDataToUpdate = this.userData[this.userKey];

        let totalScore = userDataToUpdate.totalScore + this.gamePoints;
        this.userData[this.userKey].totalScore = totalScore;
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
        this.updateTotalScoreFirebase(totalScore, this.userKey);
    }
}

TestPageModel.prototype.updateTotalScoreFirebase = function (totalScore, userKey) {
    const userFirebase = myAppDB.ref("users/" + userKey);
    userFirebase.update({
        totalScore: totalScore
    });
}

TestPageModel.prototype.getlocalStorageUserData = function () {
    const resultUser = window.localStorage.getItem(this.storageKey);
    this.userData = JSON.parse(resultUser);
    const resultKey = window.localStorage.getItem(this.storageUserKey);
    this.userKey = JSON.parse(resultKey);
    return this.userData;
}

TestPageModel.prototype.getHighestScore = function () {
    const currentHighScore = this.getCurrentHighScore();
    if (currentHighScore < this.gamePoints) {
        this.updateHighScoreLocalStorage(this.gamePoints);
    }
}

TestPageModel.prototype.getCurrentHighScore = function () {
    this.getlocalStorageUserData();
    const currentHighScore = this.userData[this.userKey].highScore;
    return currentHighScore;
}

TestPageModel.prototype.updateHighScoreLocalStorage = function (newHighScore) {
    this.userData = this.getlocalStorageUserData();
    const userDataToUpdate = this.userData[this.userKey];
    if (this.userData) {
        userDataToUpdate.highScore = newHighScore;
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
        this.updateHighScoreFirebase(newHighScore, this.userKey);
    }
}

TestPageModel.prototype.updateHighScoreFirebase = function (newHighScore, userKey) {
    const userFirebase = myAppDB.ref("users/" + userKey);
    userFirebase.update({
        highScore: newHighScore
    });
}

TestPageModel.prototype.goToHomePage = function () {
    window.location.hash = "main";
    window.location.reload();
}

TestPageModel.prototype.tryAgain = function () {
    window.location.reload();
}

/* ------- end model ------- */

/* ----- begin controller ---- */
function TestPageController() {
    let myTestPageBlock = null;
    let myModel = null;
    let timer;
    this.gameActive = true;
    this.gameTime = 60000;
}
TestPageController.prototype.init = function (model, block) {
    myTestPageBlock = block;
    myModel = model;
    this.createTestInfo();
    this.addEventListeners();
    this.startTimer();
};

TestPageController.prototype.startTimer = function () {
    timer = setTimeout(() => {
        this.endGame();
    }, this.gameTime);
};

TestPageController.prototype.endGame = function () {
    this.gameActive = false;
    myModel.clearTestInfo();
    myModel.showGameOver();
    myModel.updateTotalScoreLocalStorage();
    myModel.getHighestScore();
};

TestPageController.prototype.createTestInfo = function () {
    if (this.gameActive) {
        myModel.createTestInfo();
    }
}
TestPageController.prototype.addEventListeners = function () {
    const that = this;
    myTestPageBlock.addEventListener("click", function (event) {
        if (!that.gameActive) {
            return; // Если игра завершена, игнорируем клик
        }
        const selectedAnswerElement = event.target;
        if (selectedAnswerElement.getAttribute('country-name')) {
            myModel.checkAnswer(selectedAnswerElement, myTestPageBlock);
            setTimeout(() => {
                myModel.clearTestInfo();
                myModel.createTestInfo();
            }, 500);
        }

    });
    myTestPageBlock.addEventListener("click", function (event) {
        const selectedBtn = event.target;
        if (selectedBtn.classList.contains("try-again-btn")) {
            myModel.tryAgain();
        }
        if (selectedBtn.classList.contains("to-main-page-btn-testpage")) {
            myModel.goToHomePage();
        }
    });
    document.addEventListener("keydown", function (event) {
        //Esc (код 27)
        if (event.keyCode === 27) {
            myModel.goToHomePage();
        }
    });
}