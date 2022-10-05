let login = document.querySelector('.login-swich-login');
let regist = document.querySelector('.login-swich-registration');

let warning = document.querySelector('.warning');

let loginForm = document.querySelector('.login-form');
let registForm = document.querySelector('.regist-form');

login.addEventListener('click', (event) => {
    registForm.classList.add('hidden');
    loginForm.classList.remove('hidden');

    warning.classList.add('hidden');
});

regist.addEventListener('click', (event) => {
    registForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

let underLineArr = document.querySelectorAll('.underline');

document.addEventListener('click', event => {
    for (let underLine of underLineArr){
        if(event.target.closest('.underline') == underLine) underLine.classList.add('active');
        if(!event.target.closest('.underline')) underLine.classList.remove('active');
    }
});



let Regform = document.forms.registration;
let regSubmit = Regform['registration-submit'];


//ОТПРАВКА ФОРМЫ РЕГИСТРАЦИИ

Regform.addEventListener('submit', event => {
    event.preventDefault();
    let Email = Regform['email'];
    let userName = Regform['name'];
    let password = Regform['password'];
    let repPassword = Regform['repeat-password'];
    let flag = false;
    console.log(userName.value.match(/[A-z0-9]+/i)[0] == userName.value);

    if(/[a-z]/.test(password.value)==false || /[0-9]/.test(password.value)==false){
        warning.classList.remove('hidden');
        warning.innerHTML = 'Пароль слишком простой';
        flag = true;
    }
    else if(flag == false){
        warning.classList.add('hidden');
    }

    if(password.value != repPassword.value){
        warning.classList.remove('hidden');
        warning.innerHTML = 'Пароли не совпадают';
        flag = true;
    }
    else if(flag == false){
        warning.classList.add('hidden');
    }

    if(userName.value.length<=4 || userName.value.match(/[A-z0-9]+/i)[0] != userName.value){
        warning.classList.remove('hidden');
        warning.innerHTML = 'Логин не подходит';
        flag = true;
    }
    else if(flag == false){
        warning.classList.add('hidden');
    }   
    if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(Email.value)==false){
        warning.classList.remove('hidden');
        warning.innerHTML = 'E-mail не подходит';
        flag = true;
    }
    else if(flag == false){
        warning.classList.add('hidden');
    }
    async function sendData(){
        let response = await fetch('http://192.168.137.128:4567/login', {
            method: 'POST',
            body: new FormData(Regform)
          });
      
          let result = await response.json();
      
          console.log(result);
    }
    if(!flag) sendData();
});

//ОТПРАВКА ФОРМЫ ЛОГИНА

let loginform = document.forms.login;

loginform.addEventListener('submit', (event)=>{
    event.preventDefault();

    async function sendDataLogin(){
        let response = await fetch('/login', {
            method: 'POST',
            body: new FormData(loginform),
        });

        if(response.url){
            window.location.href = response.url;
        }
        
        else{
            let result = await response.json();
            warning.innerHTML = `${result.error[0]}`;
            warning.classList.remove('hidden');
        }
        }
        sendDataLogin();
    sendDataLogin();
});


