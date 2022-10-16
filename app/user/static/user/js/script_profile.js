let exitButton = document.querySelector('.profile-main-ava-nickname-esc');
let exitWindow = document.querySelector('.profile-main-ava-nickname-escapeWindow-window');
let exitWindowCancel = document.querySelector('.window-buttons-cancel-button');


exitButton.addEventListener('click', event =>{
    setTimeout(()=>{
        exitWindow.classList.add('visible');
    }, 0);
});

exitWindowCancel.addEventListener('click', event=>{
    exitWindow.classList.remove('visible');
});

document.addEventListener('click', event=>{
    if(event.target.closest('.profile-main-ava-nickname-escapeWindow-window')!=exitWindow && exitWindow.classList.contains('visible')){
        exitWindow.classList.remove('visible');
    }
});


let editForm = document.forms.editProfile;

let editWindow = document.querySelector('.profile-main-ava-edit');
let editButton = document.querySelector('.profile-main-ava-edit-button');

let openEdit = true;

document.addEventListener('click', event=>{
    if(!event.target.closest('.profile-main-ava-edit')){
        editWindow.classList.remove('visible');
    }
});

editButton.addEventListener('click', event=>{
    setTimeout(()=>{
        editWindow.classList.add('visible');
    }, 0);
});


let submitBut = document.querySelector('.window-submit-submit')
submitBut.addEventListener('click',event=>{
    event.preventDefault();
    async function sendChanges(){
        let response = await fetch('/edit_profile', {
            method: 'POST',
            method: 'POST',
            body: new FormData(editForm),
        });
        let result = await response.json()
        if(result['url-redirect']){
            window.location.href = result['url-redirect'];
        }
    }
    sendChanges()
});




