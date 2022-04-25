const API = 'https://utube-back-end.herokuapp.com';

const videosList = document.querySelector('.videos-list');

videoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(videoForm);

    formData.append('videoTitle', videoForm.videoInput.value);
    formData.append('video', videoForm.uploadInput.files[0]);

    let size = (videoForm.uploadInput.files[0].size / 1024 / 1024).toFixed(2);

    if (size > 50) {
        errorMessage.textContent = 'Video size must be less than 50MB';
        videoForm.videoInput.value = '';
        videoForm.uploadInput.value = '';
    }

    videoForm.videoInput.value = '';
    videoForm.uploadInput.value = '';

    let response = await fetch(`${API}/videos`, {
        method: 'POST',
        headers: {
            'token': token
        },
        body: formData
    });

    let data = await response.json();

    if (data.status == 201) {
        window.location = '/admin';
    }

    if(data.status == 403) {
        window.localStorage.removeItem('userImg');
        window.localStorage.removeItem('token');
        window.location = '/login';
    } 

    if(data.status == 404) {
        errorMessage.textContent = data.message;
    }

    if(data.status == 400) {
        errorMessage.textContent = data.message;
    }
});

async function createVideo () {
    const userId = window.localStorage.getItem('userId');

    const videos = await fetch(`${API}/videos/private?userId=${userId}`, {
        method: 'GET',
        headers: {
            'token': token
        }
    });
    
    const data = await videos.json();

    if (data.status == 200) {

        videosList.innerHTML = '';

        data.data.forEach(video => {
            let li = document.createElement('li');
            li.className = 'video-item';

            let videoo = document.createElement('video');
            videoo.src = `${API}/videos/${video.videoUrl}`;
            videoo.controls = true;

            let p = document.createElement('p');
            p.className = 'content';
            p.setAttribute('data-id', video.videoId);
            p.setAttribute('contenteditable', 'true');
            p.textContent = video.videoTitle;

            let img = document.createElement('img');
            img.src = "./img/delete.png";
            img.setAttribute('width', '35px');
            img.alt = 'upload';
            img.className = 'delete-icon';
            img.setAttribute('data-id', video.videoId);

            li.append(videoo, p, img);

            videosList.append(li);

            img.addEventListener('click', async function(e) {
                const videoId = e.target.getAttribute('data-id');

                let formData = new FormData();

                formData.append('videoId', videoId);

                const response = await fetch(`${API}/videos/${videoId}`, {
                    method: 'DELETE',
                    headers: {
                        'token': token
                    },
                    body: formData
                });

                const data = await response.json();

                if (data.status == 200) {
                    createVideo();
                }

                if(data.status == 403) {
                    window.localStorage.removeItem('userImg');
                    window.localStorage.removeItem('token');
                    window.location = '/login';
                }

            });

            p.addEventListener('keydown', async function(e) {
                if (e.keyCode == 13) {

                    e.preventDefault();

                    let title = e.target.textContent.trim();

                    if(!title) return

                    if(title.length < 3 || title.length > 20) {
                        errorMessage.textContent = 'Video title must be between 3 and 20 characters';
                        return createVideo();
                    }
                    
                    let formData = new FormData();
                    const date = new Date();

                    const uploadedData = date.toISOString().slice(0, 10) + ' | ' + date.toLocaleTimeString([], { hourCycle: 'h23', hour: '2-digit', minute:'2-digit'})

                    formData.append('videoId', video.videoId);
                    formData.append('videoTitle', title);
                    formData.append('uploadedData', uploadedData);

                    const response = await fetch(`${API}/videos`, {
                        method: 'PUT',
                        headers: {
                            'token': token
                        },
                        body: formData
                    });

                    const data = await response.json();

                    if (data.status == 200) {
                        errorMessage.textContent = '';
                        createVideo();
                    }

                    if(data.status == 403) {
                        window.localStorage.removeItem('userImg');
                        window.localStorage.removeItem('token');
                        window.location = '/login';
                    }

                    return false;
                }
            });
        });

    } else {
        console.log(data.message);
    }

}

createVideo();

logoutBtn.addEventListener('click', function() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userImg');
    window.location = '/';
});