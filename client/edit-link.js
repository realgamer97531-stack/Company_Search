const token =
localStorage.getItem('token');

const role =
localStorage.getItem('role');


if(role !== 'admin'){

    alert('Admins Only');

    window.location.href = '/';

}


// GET ID
const params =
new URLSearchParams(
window.location.search
);

const id =
params.get('id');


// INPUTS
const titleInput =
document.getElementById('title');

const descriptionInput =
document.getElementById('description');

const urlInput =
document.getElementById('url');

const typeInput =
document.getElementById('type');

const tagsInput =
document.getElementById('tags');

const previewImage =
document.getElementById('previewImage');


// LOAD DATA
async function loadLink(){

    const response =
    await fetch(

    '/api/links',

    {

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    const link =
    data.find(item => item.id == id);

    if(!link){

        alert('Link Not Found');
        return;

    }

    titleInput.value =
    link.title;

    descriptionInput.value =
    link.description;

    urlInput.value =
    link.url;

    typeInput.value =
    link.type;

    tagsInput.value =
    link.tags;

    previewImage.src =
    link.thumbnail;

}


loadLink();


// UPDATE
const form =
document.getElementById('editForm');

form.addEventListener(
'submit',

async function(e){

    e.preventDefault();

    const response =
    await fetch(

    `/api/links/${id}`,

    {

        method:'PUT',

        headers:{

            'Content-Type':
            'application/json',

            Authorization:token

        },

        body:JSON.stringify({

            title:titleInput.value,

            description:
            descriptionInput.value,

            url:urlInput.value,

            type:typeInput.value,

            tags:tagsInput.value

        })

    });

    const data =
    await response.json();

    alert(data.message);

    window.location.href = '/';

});
