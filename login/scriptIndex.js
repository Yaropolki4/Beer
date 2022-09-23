let login = document.querySelector('.login-swich-login');
let regist = document.querySelector('.login-swich-registration');

let loginForm = document.querySelector('.login-form');
let registForm = document.querySelector('.regist-form');

login.addEventListener('click', (event) => {
    registForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

regist.addEventListener('click', (event) => {
    registForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

let underLineArr = document.querySelectorAll('.underline');

document.addEventListener('click', event => {
    for (let underLine of underLineArr){
        console.log(event.target.closest('.underline'));
        if(event.target.closest('.underline') == underLine) underLine.classList.add('active');
        if(!event.target.closest('.underline')) underLine.classList.remove('active');
    }
});