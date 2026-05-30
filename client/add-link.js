const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');

if(
    role !== 'admin' &&
    role !== 'editor'
){

    alert('Access Denied');

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
    ).value;

    const description =
    document.getElementById(
    'description'
    ).value;

    const url =
    document.getElementById(
    'url'
    ).value;

    const thumbnail_url =
    document.getElementById(
    'thumbnail'
    ).value;

    const type =
    document.getElementById(
    'type'
    ).value;

    const tags =
    document.getElementById(
    'tags'
    ).value;

    const response =
    await fetch(

    'https://company-search-production-74f6.up.railway.app//api/links/add',

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

    alert(data.message);

    window.location.href='/';

});