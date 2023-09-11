/* ------- begin view ------- */
function MainPageView() {
    let myBlock = null;
}
MainPageView.prototype.init = function (block) {
    myBlock = block;
}

MainPageView.prototype.showBtns = function (btns) {
    // login btn
    const loginContainerMainPage = document.createElement('div');
    loginContainerMainPage.classList.add("login-container-main-page");
    const loginBtnMainPage = document.createElement('button');
    loginBtnMainPage.textContent = 'Sign in';
    loginBtnMainPage.classList.add("login-btn-main-page");
    loginContainerMainPage.append(loginBtnMainPage);
    myBlock.append(loginContainerMainPage);
    //begin title
    const titleContainer = document.createElement('h1');
    titleContainer.classList.add("title-container");
    const titlePartFun = document.createElement('span');
    titlePartFun.classList.add("title-fun");
    titlePartFun.textContent = "Fun";
    const titlePartWith = document.createElement('span');
    titlePartWith.classList.add("title-with");
    titlePartWith.textContent = "WITH";
    const titlePartFlags = document.createElement('span');
    titlePartFlags.classList.add("title-flags");
    titlePartFlags.textContent = "Flags";
    myBlock.append(titleContainer);
    titleContainer.append(titlePartFun);
    titleContainer.append(titlePartWith);
    titleContainer.append(titlePartFlags);
    //end title
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('button-container-main-page');
    myBlock.append(btnContainer);
    // создание кнопок
    btns.forEach(btn => {
        const btnElement = document.createElement('button');
        btnElement.classList.add('button-main-page');
        btnElement.textContent = btn.name;
        btnElement.classList.add(btn.btnStyle);
        btnElement.addEventListener('click', () => {
            let hash;
            switch (btn.name) {
                case "Cards":
                    hash = "cards";
                    break;
                case "Training":
                    hash = "guess-flag";
                    break;
                /* case "Guess Countries":
                     hash = "guess-country";
                     break;*/
                case "Quiz":
                    hash = "quiz";
                    break;
                case "Account":
                    hash = "statistics";
                    break;
                case "Leaderboard":
                    hash = "rating";
                    break;
                default:
                    hash = "main";
            }
            window.location.hash = hash;
        });
        btnContainer.append(btnElement);
    });
};
/* -------- end view --------- */

/* ------- begin model ------- */
function MainPageModel() {
    let myView = null;
    let btns = [];
}
MainPageModel.prototype.init = function (view) {
    myView = view;
}

MainPageModel.prototype.createBtns = function () {
    this.btns = [
        { name: "Cards", btnStyle: "btn-cards", link: "cards.html" },
        { name: "Training", btnStyle: "btn-training", link: "guess-flag.html" },
        // { name: "Guess Countries", bgBtnColor: "#fff1c2", link: "guess-country.html" },
        { name: "Quiz", btnStyle: "btn-test", link: "quiz.html" },
        { name: "Account", btnStyle: "btn-account", link: "statistics.html" },
        { name: "Leaderboard", btnStyle: "btn-leaderboard", link: "rating.html" }
    ];
}

MainPageModel.prototype.renderBtns = function () {
    myView.showBtns(this.btns);
}

MainPageModel.prototype.signIn = function () {
    window.location.hash = "signin";
}
/* -------- end model -------- */

/* ----- begin controller ---- */
function MainPageController() {
    let myMainPageBlock = null;
    let myModel = null;
}

MainPageController.prototype.init = function (model, block) {
    myMainPageBlock = block;
    myModel = model;
    this.createBtns();
    this.renderBtn();
    this.addEventListeners();
};

MainPageController.prototype.addEventListeners = function () {
    myMainPageBlock.addEventListener("click", function (event) {
        const selectedBtn = event.target;
        if (selectedBtn.classList.contains("login-btn-main-page")) {
            myModel.signIn();
        }
    })
};

MainPageController.prototype.createBtns = function () {
    myModel.createBtns();
}

MainPageController.prototype.renderBtn = function () {
    myModel.renderBtns();
}
/* ------ end controller ----- */