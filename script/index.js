const mainPageBlock = document.querySelector('#page-block');
let testPageScriptLoaded = false;
let mainPageScriptLoaded = false;
let loginPageScriptLoaded = false;
let statisticsPageScriptLoaded = false;
let rankPageScriptLoaded = false;

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    switch (hash) {
        case 'quiz':
            loadTestPage();
            break;
        case 'signin':
            loadSignInPage();
            break;
        case 'statistics':
            loadStatisticsPage();
            break;
        case 'rating':
            loadRankPage();
            break;
        default:
            loadMainPage();
    }
});

// Инициализация приложения
function initialize() {
    const initialHash = window.location.hash.slice(1);
    switch (initialHash) {
        case 'quiz':
            loadTestPage();
            break;
        case 'signin':
            loadSignInPage();
            break;
        case 'statistics':
            loadStatisticsPage();
            break;
        case 'rating':
            loadRankPage();
            break;
        case 'main':
            loadMainPage();
            break;
        default:
            loadMainPage();
    }
}

function loadScript(scriptSrc, callback) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.onload = callback;
    document.body.append(script);
}

// Загрузка главной страницы
function loadMainPage() {
    document.body.classList.remove('body-test-page');
    mainPageBlock.classList.remove('test-block');
    mainPageBlock.classList.remove('page-block-login');
    mainPageBlock.innerHTML = '';

    if (!mainPageScriptLoaded) {
        loadScript('script/main_page.js', initializeMainPage);
    } else {
        initializeMainPage();
    }
}

function initializeMainPage() {
    const appMainPageView = new MainPageView();
    const appMainPageModel = new MainPageModel();
    const appMainPageController = new MainPageController();

    //вызвать init-методы...
    appMainPageView.init(mainPageBlock);
    appMainPageModel.init(appMainPageView);
    appMainPageController.init(appMainPageModel, mainPageBlock);
    mainPageScriptLoaded = true; // Помечаем, что скрипт уже загружен
}

// Загрузка квиза
function loadTestPage() {
    document.body.classList.add('body-test-page');
    mainPageBlock.innerHTML = '';
    if (!testPageScriptLoaded) {
        loadScript('script/test_page.js', initializeTestPage);
    } else {
        initializeTestPage();
    }
}

function initializeTestPage() {
    const appTestPageView = new TestPageView();
    const appTestPageModel = new TestPageModel();
    const appTestPageController = new TestPageController();

    //вызвать init-методы...
    const testPageBlock = document.querySelector('#page-block');
    appTestPageView.init(testPageBlock);
    appTestPageModel.init(appTestPageView);
    appTestPageController.init(appTestPageModel, testPageBlock);
    testPageScriptLoaded = true; // Помечаем, что скрипт уже загружен
}

function loadSignInPage() {
    mainPageBlock.innerHTML = '';
    if (!loginPageScriptLoaded) {
        loadScript('script/login.js', initializeLoginPage);
    } else {
        initializeLoginPage();
    }
}

function initializeLoginPage() {
    const appLoginPageView = new LoginPageView();
    const appLoginPageModel = new LoginPageModel();
    const appLoginPageController = new LoginPageController();

    //вызвать init-методы...
    const loginPageBlock = document.querySelector('#page-block');
    appLoginPageView.init(loginPageBlock);
    appLoginPageModel.init(appLoginPageView);
    appLoginPageController.init(loginPageBlock, appLoginPageModel);
    loginPageScriptLoaded = true; // Помечаем, что скрипт уже загружен
}

function loadStatisticsPage() {
    mainPageBlock.innerHTML = '';
    if (!statisticsPageScriptLoaded) {
        loadScript('script/statistics.js', initializeStatisticsPage);
    } else {
        initializeStatisticsPage();
    }
}

function initializeStatisticsPage() {
    const appStatisticsPageView = new StatisticsPageView();
    const appStatisticsPageModel = new StatisticsPageModel();
    const appStatisticsPageController = new StatisticsPageController();

    //вызвать init-методы...
    const statiticsPageBlock = document.querySelector('#page-block');
    appStatisticsPageView.init(statiticsPageBlock);
    appStatisticsPageModel.init(appStatisticsPageView);
    appStatisticsPageController.init(appStatisticsPageModel, statiticsPageBlock);
    statisticsPageScriptLoaded = true; // Помечаем, что скрипт уже загружен
}

function loadRankPage() {
    mainPageBlock.innerHTML = '';
    if (!rankPageScriptLoaded) {
        loadScript('script/ranking.js', initializeRankPage);
    } else {
        initializeRankPage();
    }
}

function initializeRankPage() {
    const appRankPageView = new RankPageView();
    const appRankPageModel = new RankPageModel();
    const appRankPageController = new RankPageController();

    //вызвать init-методы...
    const rankPageBlock = document.querySelector('#page-block');
    appRankPageView.init(rankPageBlock);
    appRankPageModel.init(appRankPageView);
    appRankPageController.init(appRankPageModel, rankPageBlock);
    rankPageScriptLoaded = true; // Помечаем, что скрипт уже загружен
}

initialize();
