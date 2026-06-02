const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');


// ADMIN ONLY
// if(role !== 'admin'){

//     alert('Admins Only');

//     window.location.href = '/';

// }


const usersContainer =
document.getElementById(
'usersContainer'
);


// LOAD USERS
async function loadUsers(){

    try{
        const response =
        await fetch(

        'https://company-search-production-74f6.up.railway.app/api/auth/users',

        {

            headers:{
                Authorization:token
            }

        });

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

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
    }catch(error){
        usersContainer.innerHTML = '<p style="color:red;">Error loading users: ' + error.message + '</p>';
        console.error('Load users error:', error);
    }

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
    ).value.trim();

    const password =
    document.getElementById(
    'password'
    ).value.trim();

    const role =
    document.getElementById(
    'role'
    ).value;

    // Validation
    if(!username || !password){
        alert('Username and password are required');
        return;
    }

    try{
        const response =
        await fetch(

        'https://company-search-production-74f6.up.railway.app/api/auth/add-user',

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

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        const data =
        await response.json();

        alert(data.message);

        form.reset();

        loadUsers();
    }catch(error){
        alert('Error adding user: ' + error.message);
        console.error('Add user error:', error);
    }

});