/* ------- begin view ------- */
function RankPageView() {
    let myBlock = null;
}
RankPageView.prototype.init = function (block) {
    myBlock = block;
}

RankPageView.prototype.showUserInfo = function (usersData) {
    myBlock.innerHTML = ` 
    <div class="user-data-container">
    <div class="navigation-container">
    <button class="to-main-page-btn-rank-page rank-statistic-btn">Home Page</button>
    </div>
    <div class="flex-grow"></div>
    <h1 class="profile-title flex-grow">Leaderboard</h1>
       <div class="user-results-table-container">
        <table class="user-result-table">
        <caption>Your results</caption>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Player Name</th>
                    <th>High Score</th>
                </tr> 
            </thead>
            <tbody class="table-body"></tbody>
        </table>  
    </div>
    <div class="flex-grow"></div> 
    </div>`;
    const tableBody = document.querySelector(".table-body");
    let position = 0;
    usersData.forEach(function (user) {
        const valueName = user.name;
        const valueHighScore = user.highScore;
        position += 1;

        const row = document.createElement("tr");
        const positionCell = document.createElement("td");
        positionCell.textContent = position;

        const nameCell = document.createElement("td");
        nameCell.textContent = valueName;

        const highScoreCell = document.createElement("td");
        highScoreCell.textContent = valueHighScore;

        row.append(positionCell);
        row.append(nameCell);
        row.append(highScoreCell);

        tableBody.append(row);
    });
}

RankPageView.prototype.showWarning = function () {
    myBlock.innerHTML = ` 
    <div class="navigation-container">
    <button class="to-main-page-btn-rank-page rank-statistic-btn">Home Page</button>
    <button class="sign-in-btn rank-statistic-btn">Sign In</button>
    </div>
    <div class="flex-grow"></div>
    <div class="warning-block"> Please sign in to your account</div>
    <div class="flex-grow"></div>`
}
/*-------- end view---------*/
/* ------- begin model ------- */
function RankPageModel() {
    let myView = null;
    this.storageKey = "userData";
    this.usersData = {};
}

RankPageModel.prototype.init = async function (view) {
    myView = view;
    this.userData = this.getlocalStorageUserData();
    if (this.userData) {
        try {
            const usersData = await this.getUsersList();
            //Сортируем пользователей по highScore
            this.sortUsersByHighScore(usersData);
            if (usersData) {
                myView.showUserInfo(usersData);
            }
        } catch (error) {
            console.error("Error initializing model: " + error.message);
        }
    }
    else {
        myView.showWarning();
    }
}

RankPageModel.prototype.getlocalStorageUserData = function () {
    const resultUser = window.localStorage.getItem(this.storageKey);
    this.userData = JSON.parse(resultUser);
    return this.userData;
}

RankPageModel.prototype.getUsersList = function () {
    return new Promise((resolve, reject) => {
        myAppDB
            .ref("users/")
            .once("value")
            .then(function (snapshot) {
                const userDataArray = [];
                snapshot.forEach(function (userSnapshot) {
                    const userData = userSnapshot.val();
                    userDataArray.push(userData);
                });
                resolve(userDataArray);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

RankPageModel.prototype.sortUsersByHighScore = function (usersData) {
    usersData.sort((a, b) => b.highScore - a.highScore);
    return usersData; // Возвращаем отсортированные данные
};

RankPageModel.prototype.goToHomePage = function () {
    window.location.hash = "main";
}

RankPageModel.prototype.signIn = function () {
    window.location.hash = "signin";
}
/* -------- end model -------- */

/* ----- begin controller ---- */
function RankPageController() {
    let myRankPageBlock = null;
    let myModel = null;
}

RankPageController.prototype.init = function (model, block) {
    myRankPageBlock = block;
    myModel = model;
    this.addEventListeners();
};

RankPageController.prototype.addEventListeners = function () {
    myRankPageBlock.addEventListener("click", function (event) {
        const selectedBtn = event.target;
        if (selectedBtn.classList.contains("to-main-page-btn-rank-page")) {
            myModel.goToHomePage();
        }
        if (selectedBtn.classList.contains("sign-in-btn")) {
            myModel.signIn();
        }
    })
    document.addEventListener("keydown", function (event) {
        //Esc (код 27)
        if (event.keyCode === 27) {
            myModel.goToHomePage();
        }
    });
};
/* ------ end controller ----- */
