const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');

if(
    role !== 'admin' &&
    role !== 'editor'
){

    alert('Access Denied - Only admins and editors can add links');

    window.location.href='/';

}

const form =
document.getElementById('linkForm');

form.addEventListener(
'submit',

async function(e){

    e.preventDefault();

    const title =
    document.getElementById(
    'title'
    ).value.trim();

    const description =
    document.getElementById(
    'description'
    ).value.trim();

    const url =
    document.getElementById(
    'url'
    ).value.trim();

    const thumbnail_url =
    document.getElementById(
    'thumbnail'
    ).value.trim();

    const type =
    document.getElementById(
    'type'
    ).value.trim();

    const tags =
    document.getElementById(
    'tags'
    ).value.trim();

    // Validation
    if(!title){
        alert('Title is required');
        return;
    }

    if(title.length < 3){
        alert('Title must be at least 3 characters');
        return;
    }

    if(!url){
        alert('URL is required');
        return;
    }

    if(!url.match(/^https?:\/\/.+/)){
        alert('Please enter a valid URL (starting with http:// or https://)');
        return;
    }

    try{
        const response =
        await fetch(

        '/api/links/add',

        {

            method:'POST',

            headers:{

                'Content-Type':
                'application/json',

                Authorization:
                token

            },

            body:JSON.stringify({

                title,
                description,
                url,
                thumbnail_url,
                type,
                tags

            })

        });

        const data =
        await response.json();

        if(!response.ok){
            alert(data.message || 'Failed to add link');
            return;
        }

        alert(data.message || 'Link added successfully');

        window.location.href='/';
    }catch(error){
        alert('Connection error: ' + error.message);
    }

});
