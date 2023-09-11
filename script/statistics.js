/* ------- begin view ------- */
function StatisticsPageView() {
    let myBlock = null;
}
StatisticsPageView.prototype.init = function (block) {
    myBlock = block;
}

StatisticsPageView.prototype.showUserInfo = function (userData) {
    myBlock.innerHTML = ` 
    <div class="user-data-container">
    <div class="navigation-container">
    <button class="to-main-page-btn rank-statistic-btn">Home Page</button>
    <div class="wraper">
    <button class="log-out-btn rank-statistic-btn">Log out</button>
    <button class="delete-btn rank-statistic-btn">Delete your data</button>
    </div>
    </div>
    <div class="flex-grow"></div>
    <h1 class="profile-title flex-grow">Hello, ${userData.name}!</h1>
       <div class="user-results-table-container">
        <table class="user-result-table">
        <caption>Your results</caption>
            <thead>
                <tr>
                    <th>Total Score</th>
                    <th>High Score</th>
                </tr> 
            </thead>
            <tbody>
                <tr>
                    <td>${userData.totalScore}</td>
                    <td>${userData.highScore}</td>
                </tr>
            </tbody>
        </table>  
        </div>
        <div class="notice-form">
        <button class="add-notice-btn rank-statistic-btn">Notice</button>
        <input type="text" class="notice-input" id="notice-input" placeholder="Add notice">
        </div>
        <div class="flex-grow"></div> 
    </div>
    `;
}
StatisticsPageView.prototype.showWarning = function () {
    myBlock.innerHTML = `
    <div class="navigation-container">
    <button class="to-main-page-btn rank-statistic-btn">Home Page</button>
    <button class="sign-in-btn rank-statistic-btn">Sign In</button>
    </div>
    <div class="flex-grow"></div>
    <div class="warning-block"> Please sign in to your account</div>
    <div class="flex-grow"></div>
    `
}
/*-------- end view---------*/
/* ------- begin model ------- */
function StatisticsPageModel() {
    let myView = null;
    this.storageKey = "userData";
    this.storageUserKey = "userKey";
    this.userData = {};
    this.userKey = "";
}

StatisticsPageModel.prototype.init = function (view) {
    myView = view;
    this.userData = this.getlocalStorageUserData();
    if (this.userData) {
        const userDataForView = this.userData[this.userKey];
        myView.showUserInfo(userDataForView);
    }
    else {
        myView.showWarning();
    }
}

StatisticsPageModel.prototype.getlocalStorageUserData = function () {
    const resultUser = window.localStorage.getItem(this.storageKey);
    this.userData = JSON.parse(resultUser);
    const resultKey = window.localStorage.getItem(this.storageUserKey);
    this.userKey = JSON.parse(resultKey);
    return this.userData;
}

StatisticsPageModel.prototype.logOut = function () {
    firebase.auth().signOut().then(() => {
        this.clearLocalStorageUserData();
        window.location.hash = "signin";
    });

}
StatisticsPageModel.prototype.clearLocalStorageUserData = function () {
    window.localStorage.removeItem(this.storageKey);
    window.localStorage.removeItem(this.storageUserKey);
}
StatisticsPageModel.prototype.goToHomePage = function () {
    window.location.hash = "main";
}

StatisticsPageModel.prototype.deleteAccount = function () {
    const that = this;
    myAppDB
        .ref("users/" + this.userKey)
        .remove()
        .then(function () {
            console.info("Пользователь удален из коллеции users");
            that.clearLocalStorageUserData();
        })
        .catch(function (error) {
            console.error("Ошибка удаления пользователя: ", error);
        });
};

StatisticsPageModel.prototype.addNotice = function (noticeValue) {
    const userFirebase = myAppDB.ref("users/" + this.userKey);
    userFirebase.update({
        notice: noticeValue
    });
}
/* -------- end model -------- */

/* ----- begin controller ---- */
function StatisticsPageController() {
    let myStatisticsPageBlock = null;
    let myModel = null;
}

StatisticsPageController.prototype.init = function (model, block) {
    myStatisticsPageBlock = block;
    myModel = model;
    this.addEventListeners();
};

StatisticsPageModel.prototype.signIn = function () {
    window.location.hash = "signin";
}

StatisticsPageController.prototype.addEventListeners = function () {
    myStatisticsPageBlock.addEventListener("click", function (event) {
        const selectedBtn = event.target;
        if (selectedBtn.classList.contains("log-out-btn")) {
            myModel.logOut();
        }
        if (selectedBtn.classList.contains("to-main-page-btn")) {
            myModel.goToHomePage();
        }
        if (selectedBtn.classList.contains("sign-in-btn")) {
            myModel.signIn();
        }
        if (selectedBtn.classList.contains("delete-btn")) {
            myModel.deleteAccount();
        }
        if (selectedBtn.classList.contains("add-notice-btn")) {
            const notice = myStatisticsPageBlock.querySelector("#notice-input");
            myModel.addNotice(notice.value);
        }
    })
    document.addEventListener("keydown", function (event) {
        //Esc (код 27)
        if (event.keyCode === 27) {
            myModel.goToHomePage();
        }
    });
};