function LoginPageView() {
    let myLoginPage = null;
    this.init = function (app) {
        myLoginPage = app;
        this.showLoginForm();
    };
    this.showLoginForm = function () {
        myLoginPage.classList.add("page-block-login");
        myLoginPage.innerHTML = ` 
<div class="form-container">
<h1 class="form-title">Welcome!</h1>
<form id="login-form">
    <input type="text" id="fieldUsername" name="username" placeholder="Username" required>
    <input type="password" id="fieldPassword" name="password" placeholder="Password" required>
    <button class="login-btn login-page-btns" id="loginBtn">Login</button>
    <button class="to-main-page-btn-login-page login-page-btns">Home Page</button>
</form>
<div id="error" class="error">
</div>
`;
    }
    this.loginError = function (error) {
        myLoginPage.querySelector("#error").innerHTML = `${error}`;
    };

    this.hideForm = function () {
        this.showLoginForm();
    };
}

//begin model
function LoginPageModel() {
    let myLoginView = null;
    const that = this;
    const storageKey = "userData";
    const storageUserKey = "userKey";
    this.init = function (view) {
        myLoginView = view;
    };
    this.login = function (userEmail, userPass) {
        if (userEmail && userPass) {
            auth
                .signInWithEmailAndPassword(userEmail, userPass)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (user) {
                        that.getUsersList();
                        that.getCurrentUserData(userEmail);
                        window.location.hash = "main";
                    } else {
                        myLoginView.hideForm();
                    }
                })
                .catch(function (error) {
                    console.log("Error: " + error.message);
                    myLoginView.loginError(
                        "Неверный email или пароль. Введите корректные данные."
                    );
                });
        } else {
            myLoginView.loginError(
                "Пустое поле Email или Password. Введите данные в указанные поля."
            );
        }
    };

    this.getUsersList = function () {
        myAppDB
            .ref("users/")
            .once("value")
            .then(function (snapshot) {
            })
            .catch(function (error) {
                console.log("Error: " + error.code);
            });
    };

    this.getCurrentUserData = function (userEmail) {
        const that = this;
        myAppDB
            .ref("users/")
            .orderByChild("email") // Поиск пользователя по полю email
            .equalTo(userEmail)    // Сравнение с указанным email
            .once("value")
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    const currentUserData = snapshot.val();
                    const currentUserKey = Object.keys(currentUserData);
                    that.saveCurrentUserDataToLocalStorage(currentUserData, currentUserKey);
                } else {
                    console.log("Пользователь с email " + userEmail + " не найден.");
                }
            })
            .catch(function (error) {
                console.log("Ошибка при получении данных пользователя: " + error.code);
            });
    };

    this.saveCurrentUserDataToLocalStorage = function (currentUserData, currentUserKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(currentUserData));
        window.localStorage.setItem(storageUserKey, JSON.stringify(currentUserKey));
    }

    this.goToHomePage = function () {
        window.location.hash = "main";
        window.location.reload();
    }
}

//begin controller
function LoginPageController() {
    let myLoginModel = null;
    let myloginBlock = null;

    this.init = function (block, model) {
        myLoginModel = model;
        myloginBlock = block;
        this.addEventListeners();
    };
    this.addEventListeners = function () {
        myloginBlock.addEventListener("click", function (event) {
            if (event.target && event.target.id === "loginBtn") {
                event.preventDefault();
                event.stopPropagation();
                const currentLogin = myloginBlock.querySelector("#fieldUsername").value;
                const currentPassword = myloginBlock.querySelector("#fieldPassword").value;
                myLoginModel.login(currentLogin, currentPassword);
            }

            if (event.target.classList.contains("to-main-page-btn-login-page")) {
                myLoginModel.goToHomePage();
            }
        });
    };
}