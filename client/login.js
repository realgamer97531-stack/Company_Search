const form =
document.getElementById('loginForm');

form.addEventListener(
'submit',

async function(e){

    e.preventDefault();

    const username =
    document.getElementById(
    'username'
    ).value;

    const password =
    document.getElementById(
    'password'
    ).value;


    const response = await fetch(

    'https://company-search-production.up.railway.app/api/auth/login',

    {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({

            username,
            password

        })

    });

    const data =
    await response.json();

    if(data.token){

        // SAVE TOKEN
        localStorage.setItem(
            'token',
            data.token
        );

        localStorage.setItem(
            'role',
            data.role
        );

        localStorage.setItem(
            'username',
            data.username
        );

        window.location.href =
        '/';

    }else{

        alert(data.message);

    }

});