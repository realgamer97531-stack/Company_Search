const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');


// ADMIN ONLY
if(role !== 'admin'){

    alert('Admins Only');

    window.location.href = '/';

}


const usersContainer =
document.getElementById(
'usersContainer'
);


// LOAD USERS
async function loadUsers(){

    const response =
    await fetch(

    'http://localhost:3000/api/auth/users',

    {

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    usersContainer.innerHTML = '';

    data.forEach(user => {

        usersContainer.innerHTML += `

        <div class="card">

            <div class="card-content">

                <h2>

                ${user.username}

                </h2>

                <p>

                Role:
                ${user.role}

                </p>

            </div>

        </div>

        `;

    });

}


loadUsers();


// ADD USER
const form =
document.getElementById('userForm');

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

    const role =
    document.getElementById(
    'role'
    ).value;


    const response =
    await fetch(

    'http://localhost:3000/api/auth/add-user',

    {

        method:'POST',

        headers:{

            'Content-Type':
            'application/json',

            Authorization:token

        },

        body:JSON.stringify({

            username,
            password,
            role

        })

    });

    const data =
    await response.json();

    alert(data.message);

    form.reset();

    loadUsers();

});