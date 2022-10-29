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
    if(event.target.closest('.nav')!=nav && !event.target.classList.contains('nav-notifications-item-friend-close-img')){
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




//кнопка закрытия уведомления
notifications.addEventListener('click', event => {
    let target = event.target;
    if(target.classList.contains('nav-notifications-item-friend-close-img')){
        let notification = target.closest('.nav-notifications-item-friend');
        notification.classList.toggle('invis');
        setTimeout(() => {
            notifications.removeChild(notification);
        }, 1000);
    }
})

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

    //обработка уведомления о добавлении в друзья
    let menuAcceptButton = document.querySelector('.nav-notifications-item-accept');
    let menuRejectButton = document.querySelector('.nav-notifications-item-reject');

    notifications.addEventListener('click', event => {
        if(event.target.closest('.nav-notifications-item-accept button')){
            try {
                var validationNick = document.querySelector('.profile-main-ava-nickname-nick').innerHTML;
                console.log(2);
            }
            catch{var validationNick = false;}
            let nickName = event.target.closest('.nav-notifications-item').querySelector('.nav-notifications-item-nick span').innerHTML;
            let resp = true;
            if(nickName == validationNick){
                accept.classList.add('invis');
                loading.classList.remove('invis');
            }
            socket.emit('resp_friendship_request', {name: `${nickName}`,
                                                      resp: resp});
            socket.on('resp_friendship_request', data => {
                console.log(1);
            });
        }
    });

    if(document.querySelector('.profile-main-ava-add-button')){
            let nickNameBlock = document.querySelector('.profile-main-ava-nickname-nick');
            let nickName = nickNameBlock.innerHTML;
        addFriend.addEventListener('click', event =>{
            add.classList.add('invis');
            socket.emit('friendship_request',`${nickName}`);
            loading.classList.remove('invis');
            //что-то присылается в ответ
            socket.on('friendship_request', data => {
            //console.log(data);
                //if(data=='friendship_request'){
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        cancel.classList.remove('invis');
                    }, 500)
                //}
            });
        });
        cancelFriend.addEventListener('click', event =>{
            cancel.classList.add('invis');
            socket.emit('cancel_friendship_request',`${nickName}`);
            loading.classList.remove('invis');
            socket.on('cancel_friendship_request', data => {
            //console.log(data);
                //if(data=='cancel_friendship_request'){
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        add.classList.remove('invis');
                    }, 500)
               // }
            })
        });
        //сервер должен присылать resp
        let a = 0;
        acceptButton.addEventListener('click', event=>{
            let resp = true;
            accept.classList.add('invis');
            loading.classList.remove('invis');
            socket.emit('resp_friendship_request', {name: `${nickName}`,
                                                      resp: resp});
            console.log('accept');
            socket.on('resp_friendship_request', data => {
            console.log(data);
                a++;
                console.log(a);
                if(data){
                    setTimeout(()=>{
                    loading.classList.add('invis');
                    remove.classList.remove('invis');

                    //добавление друга в панель
                    let friendTemplate = document.querySelector('.nav-friends-item').cloneNode(true);
                    let nickNameField = friendTemplate.querySelector('.nav-friends-item-nick').querySelector('span');
                    let nickName = document.querySelector('.profile-main-ava-nickname-nick').innerHTML;
                    nickNameField.innerHTML = nickName;
                    friends.append(friendTemplate);

                    //удаление уведомления о дружбе
                    for(let element of document.querySelectorAll('.nav-notifications-item')){
                        if(element.querySelector('.nav-notifications-item-nick').querySelector('span').innerHTML == nickName){
                            notifications.removeChild(element);
                        }
                    }
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
            socket.on('resp_friendship_request', data => {
                console.log(data);
                if(!data){
                    setTimeout(()=>{
                        loading.classList.add('invis');
                        add.classList.remove('invis');

                        //удаление уведомления о дружбе
                        for(let element of document.querySelectorAll('.nav-notifications-item')){
                            if(element.querySelector('.nav-notifications-item-nick').querySelector('span').innerHTML == nickName){
                                notifications.removeChild(element);
                            }
                        }
                        for(let element of document.querySelectorAll('.nav-notifications-item')){
                            if(element.querySelector('.nav-notifications-item-nick').querySelector('span').innerHTML == nickName){
                                notifications.removeChild(element);
                            }
                        }
                    }, 500);
                }
            })
        })
        remove.addEventListener('click', event=>{
            remove.classList.add('invis');
            socket.emit('delete_friendship',`${nickName}`);
            loading.classList.remove('invis');
            socket.on('delete_friendship', data => {
            //console.log(data);
            //if(data == 'delete_friendship'){
                setTimeout(()=>{
                    loading.classList.add('invis');
                    add.classList.remove('invis');
                    //удаление друга в панели
                        for(let element of document.querySelectorAll('.nav-friends-item')){
                            if(element.querySelector('.nav-friends-item-nick').querySelector('span').innerHTML == nickName){
                                friends.removeChild(element);
                            }
                        }
                }, 500)
            //}
            })
        })
    }

    socket.on('update_friendship_info', data => {
        try {
            var validationNick = document.querySelector('.profile-main-ava-nickname-nick').innerHTML;
            console.log(2);
        }
        catch{var validationNick = false;
        console.log(validationNick)}
        if(data['info_status'] == 'friend_notification'){
            let notificTemplate = document.querySelector('.nav-notifications-item').cloneNode(true);
            notificTemplate.style.display = 'grid';
            let nickNameField = notificTemplate.querySelector('.nav-notifications-item-nick').querySelector('span');
            nickNameField.innerHTML = `${data.name}`;
            notifications.append(notificTemplate);
            if(validationNick == data.name){
                add.classList.add('invis');
                accept.classList.remove('invis');
            }
        }
        else if(data['info_status'] == 'friends'){
            if(validationNick == data.name){
                cancel.classList.add('invis');
                remove.classList.remove('invis');
            }

            //добавление уведомления о принятии друга
            let notificTemplate = document.querySelector('.nav-notifications-item-friend').cloneNode(true);
            notificTemplate.classList.remove('invis');
            let nickNameField = notificTemplate.querySelector('.nav-notifications-item-friend-online').querySelector('span');
            nickNameField.innerHTML = `${data.name} принял вашу заявку в друзья`;
            notificTemplate.style.display = 'flex';
            notifications.append(notificTemplate);

            //добавление друга в панель
            let friendTemplate = document.querySelector('.nav-friends-item').cloneNode(true);
            let nickNameFieldFr = friendTemplate.querySelector('.nav-friends-item-nick').querySelector('span');
            nickNameFieldFr.innerHTML = `${data.name}`;
            friends.append(friendTemplate);
        }
        else if(data['info_status'] == 'delete'){
            if(validationNick == data.name){
                remove.classList.add('invis');
                add.classList.remove('invis');
            }
            //удаление друга в панели
            for(let element of document.querySelectorAll('.nav-friends-item')){
                if(element.querySelector('.nav-friends-item-nick').querySelector('span').innerHTML == data.name){
                    friends.removeChild(element);
                }
            }
        }
        else if(data['info_status'] == 'reject'){
            if(validationNick == data.name){
                cancel.classList.add('invis');
                add.classList.remove('invis');
            }
        }
        else if(data['info_status'] == 'cancel'){
            if(validationNick == data.name){
                accept.classList.add('invis');
                add.classList.remove('invis');
            }
            for(let element of document.querySelectorAll('.nav-notifications-item')){
                if(element.querySelector('.nav-notifications-item-nick').querySelector('span').innerHTML == data.name){
                    notifications.removeChild(element);
                }
            }
        }
    })
});

//должен присылаться resp
//отсылать на сервер действия
//разобраться с проблемой сокетов