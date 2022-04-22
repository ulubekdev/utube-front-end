const API = 'http://localhost:5000';

let token = window.localStorage.getItem('token');
let userPic = window.localStorage.getItem('userImg');

const usersList = document.querySelector('.navbar-list');
const userImg = document.querySelector('.avatar-img');
const videoList = document.querySelector('.iframes-list');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-input');
const microPhone = document.querySelector('.web-speech');
const makeAdmin = document.querySelector('.makeAdmin');

userImg.src = API + '/images/' + userPic;
userImg.alt = 'channel-icon'
userImg.setAttribute('width', '35px');
userImg.setAttribute('height', '35px');

if(token) {
    makeAdmin.setAttribute('href', '/admin');
} else {
    makeAdmin.setAttribute('href', '/register');
}

async function renderUsers() {
    let users = await fetch(`${API}/users`);
    let data = await users.json();

    data.data.forEach(user => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let img = document.createElement('img');
        let span = document.createElement('span');

        li.className = 'channel';
        li.setAttribute('data-id', user.id);

        img.src = API + '/images/' + user.userImg;
        img.alt = 'channel-icon'
        img.setAttribute('width', '35px');
        img.setAttribute('height', '35px');

        span.textContent = user.username;

        a.append(img, span);
        li.append(a);

        usersList.append(li);

        if(!token) {
            userImg.src = './img/avatar.jpg';
        }

        a.onclick = () => {
            searchByQuery(`userId=${user.id}`);
        }
    });
}

async function getVideo () {
    let videos = await fetch(`${API}/videos`);

    let data = await videos.json();

    renderVideos(data.data);
}

async function searchByQuery(query) {
    let videos = await fetch(`${API}/videos?${query}`);

    let data = await videos.json();

    renderVideos(data.data);
}

searchBox.addEventListener('submit', async (e) => {
    e.preventDefault();

    let query = searchInput.value;

    searchByQuery(`title=${query}`);
});

async function renderVideos(data) {
    videoList.innerHTML = '';

    data.forEach(video => {    
        let iframe = document.createElement('li');
        let videoo = document.createElement('video');
        let iframeFooter = document.createElement('div');
        let image = document.createElement('img');
        let iframeFooterText = document.createElement('div');
        let userName = document.createElement('h2');
        let iframeTitle = document.createElement('h3');
        let time = document.createElement('time');
        let download = document.createElement('a');
        let size = document.createElement('span');
        let downloadImg = document.createElement('img');

        iframe.className = 'iframe';
        videoo.src = API + '/videos/' + video.videoUrl;
        videoo.controls = true;

        iframeFooter.className = 'iframe-footer';
        image.src = API + '/images/' + video.user.userImg;
        image.alt = 'channel-icon'

        iframeFooterText.className = 'iframe-footer-text';
        userName.className = 'channel-name';
        iframeTitle.className = 'iframe-title';

        time.className = 'uploaded-time';
        download.className = 'download';
        download.href = API + '/videos/download/' + video.videoUrl;
        downloadImg.src = './img/download.png';

        userName.textContent = video.user.username;
        iframeTitle.textContent = video.videoTitle;
        time.textContent = video.uploadedData;
        size.textContent = video.videoSize;

        download.append(size, downloadImg);
        iframeFooterText.append(userName, iframeTitle, time, download);
        iframeFooter.append(image, iframeFooterText);
        iframe.append(videoo, iframeFooter);

        videoList.append(iframe);
    });
}

async function suggestions() {
    let response = await fetch(`${API}/videos`);

    let data = await response.json();

    data.data.forEach(video => {
        let option = document.createElement('option');
        option.value = video.videoTitle;
        datalist.append(option);
    });
}
renderUsers();

getVideo();

suggestions();


microPhone.addEventListener('click', () => {
    let recognition = new webkitSpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.start();

    recognition.onresult = (e) => {
        let result = e.results[0][0].transcript;
        searchInput.value = result;
        searchByQuery(`title=${result}`);
    }
});