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
    friends.classList.remove('visible');
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




//////////////////////////////////////////ИСПРАВИТЬ РЕДАКТИРОВАТЬ ПРОФИЛИ КАК ДРУЗЬЯ
    if(document.querySelector('.profile-main-ava-add-button')){
            let nickNameBlock = document.querySelector('.profile-main-ava-nickname-nick');
            let nickName = nickNameBlock.innerHTML;
        addFriend.addEventListener('click', event =>{
            add.classList.add('invis');
            socket.emit('friendship_request',`${nickName}`);
            loading.classList.remove('invis');
            //что-то присылается в ответ
            socket.on('friendship_request_response', data => {
                if(data=='friendship_request'){
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        cancel.classList.remove('invis');
                    }, 500)
                }
            })
        });
        cancelFriend.addEventListener('click', event =>{
            cancel.classList.add('invis');
            socket.emit('cancel_friendship_request',`${nickName}`);
            loading.classList.remove('invis');
            socket.on('friendship_request_response', data => {
                if(data=='cancel_friendship_request'){
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        add.classList.remove('invis');
                    }, 500)
                }
            })
        });
        acceptButton.addEventListener('click', event=>{
            let resp = true
            accept.classList.add('invis');
            loading.classList.remove('invis');
            socket.emit('resp_friendship_request', {name: `${nickName}`,
                                                      resp: resp});
            socket.on('friendship_request_response', data => {
                if(data == 'resp_friendship_request' && resp){
                    setTimeout(()=>{
                    loading.classList.add('invis');
                    remove.classList.remove('invis');
                    }, 500);
                }
            })
        });
        rejectButton.addEventListener('click', event=>{
            let resp = false;
            accept.classList.add('invis');
            loading.classList.remove('invis');
            socket.emit('resp_friendship_request', {name: `${nickName}`,
                                                      resp: resp});
            socket.on('friendship_request_response', data => {
                if(data == 'resp_friendship_request' && !resp)
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        add.classList.remove('invis');
                    }, 500)
            })
        })
        remove.addEventListener('click', event=>{
            remove.classList.add('invis');
            socket.emit('delete_friendship',`${nickName}`);
            loading.classList.remove('invis');
            socket.on('friendship_request_response', data => {
            if(data == 'delete_friendship'){
                setTimeout(()=>{
                    loading.classList.add('invis');
                    add.classList.remove('invis');
                }, 500)
            }
            })
        })
    }


    socket.on('update_friendship_info', data => {
        if(data['info_status'] == 'friend_notification'){
            let notificTemplate = document.querySelector('.nav-notifications-item').cloneNode(true);
            notificTemplate.style.display = 'grid';
            let nickNameField = notificTemplate.querySelector('.nav-notifications-item-nick').querySelector('span');
            nickNameField.innerHTML = `${data.name}`;
            notifications.append(notificTemplate);
            add.classList.add('invis');
            accept.classList.remove('invis');
        }
        else if(data['info_status'] == 'friends'){
            cancel.classList.add('invis');
            remove.classList.remove('invis');
            let notificTemplate = document.querySelector('.nav-notifications-item-friend').cloneNode(true);
            notificTemplate.style.display = 'flex';
            let nickNameField = notificTemplate.querySelector('.nav-notifications-item-friend-online').querySelector('span');
            nickNameField.innerHTML = `${data.name} принял вашу заявку в друзья`;
            notifications.append(notificTemplate);
        }
        else if(data['info_status'] == 'delete'){
            remove.classList.add('invis');
            add.classList.remove('invis');
        }
        else if(data['info_status'] == 'reject'){
            cancel.classList.add('invis');
            add.classList.remove('invis');
        }
    })
});

