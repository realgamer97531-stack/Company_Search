const form =
document.getElementById('loginForm');

// HARDCODED ADMIN CREDENTIALS: admin / admin123
// (Bypasses database check automatically)

form.addEventListener(
'submit',

async function(e){

    e.preventDefault();

    const username =
    document.getElementById(
    'username'
    ).value.trim();

    const password =
    document.getElementById(
    'password'
    ).value.trim();

    // Validation
    if(!username || !password){
        alert('Please enter username and password');
        return;
    }

    try{
        const response = await fetch(

        'https://company-search-production-74f6.up.railway.app/api/auth/login',

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

        if(!response.ok){
            alert(data.message || 'Login failed');
            return;
        }

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

            alert(data.message || 'Login failed');

        }
    }catch(error){
        alert('Connection error: ' + error.message);
    }

});