notific = document.querySelector('.nav-item_notifications');
nav = document.querySelector('.nav');
borderButton = document.querySelector('.nav-close-notifications');
notifications = document.querySelector('.nav-notifications')

notific.addEventListener('click', (event)=>{
    nav.classList.add('notifications');
    borderButton.classList.add('notifications');
    notifications.classList.add('notifications');
});

borderButton.addEventListener('click', event =>{
    nav.classList.remove('notifications');
    borderButton.classList.remove('notifications');
    notifications.classList.remove('notifications');
});