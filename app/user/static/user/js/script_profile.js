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





notificButton = document.querySelector('.nav-item_notifications');
nav = document.querySelector('.nav');
borderButton = document.querySelector('.nav-close-notifications');
notifications = document.querySelector('.nav-notifications');

friendsButton = document.querySelector('.nav-item_friends');
friends = document.querySelector('.nav-friends');


notificButton.addEventListener('click', (event)=>{
    nav.classList.add('visible');
    borderButton.classList.add('visible');
    notifications.classList.add('visible');
});

friendsButton.addEventListener('click', event =>{
    nav.classList.add('visible');
    borderButton.classList.add('visible');
    friends.classList.add('visible');
});

borderButton.addEventListener('click', event =>{
    nav.classList.remove('visible');
    borderButton.classList.remove('visible');
    notifications.classList.remove('visible');
});


document.addEventListener('click', event => {
    if(event.target.closest('.nav')!=nav){
        nav.classList.remove('visible');
        borderButton.classList.remove('visible');
        notifications.classList.remove('visible');
        friends.classList.remove('visible');
    }
});


let navFriends = document.querySelector('.nav-friends');
let chat = document.querySelector('.nav-friends-chat');
let chatCloseButton = document.querySelector('.nav-friend-chat-close');

navFriends.addEventListener('click', event =>{
    if((event.target.closest('.nav-friends-item'))){
        chat.classList.add('opened');
    }
});

document.addEventListener('click', event =>{
    if(event.target.closest('.nav-friend-chat-close') || event.target.closest('.nav-friends')!=navFriends){
        chat.classList.remove('opened');
    }
});


let messageArea = document.querySelector('.nav-friends-chat-field');
let textArea = document.querySelector('.nav-friends-chat-form-text');

textArea.innerHTML = '';

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', () =>{
        socket.send('im connected');
    });
    textArea.addEventListener('keydown', event =>{
    let tags = /<(.*?)>/g;
    let data = textArea.innerHTML;
    if(event.code == 'Enter' && data.replace(tags, '')){
        textArea.innerHTML = '';
        setTimeout(()=>{
            if(textArea.querySelectorAll('div')[1]){
                let div = textArea.querySelectorAll('div')[0];
                div.remove();
            }
        }, 0)

        socket.send(`${data.replace(tags, '')}`);
    }
    });

    socket.on('message', data => {
        let message = document.createElement('div');
        message.classList.add('nav-friends-chat-field-item');
        message.innerHTML = `${data}`;
        messageArea.append(message);
        message.scrollIntoView(top = false,{
            behavior: 'smooth',
            block: 'start'
        });
    });


});

