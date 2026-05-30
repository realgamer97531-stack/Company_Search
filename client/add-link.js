const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');


// حماية الصفحة
if(
    role !== 'admin' &&
    role !== 'editor'
){

    alert('Access Denied');

    window.location.href = '/';

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

    const thumbnail =
    document.getElementById(
    'thumbnail'
    ).files[0];

    const type =
    document.getElementById(
    'type'
    ).value;

    const tags =
    document.getElementById(
    'tags'
    ).value;


    // FORM DATA
    const formData =
    new FormData();

    formData.append(
    'title',
    title
    );

    formData.append(
    'description',
    description
    );

    formData.append(
    'url',
    url
    );

    formData.append(
    'type',
    type
    );

    formData.append(
    'tags',
    tags
    );

    formData.append(
    'thumbnail',
    thumbnail
    );


    const response = await fetch(

    'http://localhost:3000/api/links/add',

    {

        method:'POST',

        headers:{
            Authorization:token
        },

        body:formData

    });

    const data =
    await response.json();

    alert(data.message);

    window.location.href = '/';

});