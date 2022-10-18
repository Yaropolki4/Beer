let addFriend = document.querySelector('.profile-main-ava-add-button');
let cancelFriend = document.querySelector('.profile-main-ava-cancel-button');


let loading = document.querySelector('.profile-main-ava-loading');
let add = document.querySelector('.profile-main-ava-add');
let remove = document.querySelector('.profile-main-ava-remove');
let accept = document.querySelector('.profile-main-ava-accept');
let cancel = document.querySelector('.profile-main-ava-cancel');

console.log(friendStatus)
if(friendStatus == 'friends'){
    remove.classList.remove('invis');
}
else if(friendStatus == 'cansel'){
    cancel.classList.remove('invis');
}
else if(friendStatus == 'add_reject'){
    accept.classList.remove('invis');
}
else if(friendStatus == 'not_friendship'){
    add.classList.remove('invis');
}


