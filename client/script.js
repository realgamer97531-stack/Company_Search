const API_URL =
'/api/links';
const typeColors = {};
const colors = [

'#ef4444',
'#3b82f6',
'#22c55e',
'#a855f7',
'#f97316',
'#14b8a6',
'#eab308',
'#ec4899',
'#06b6d4',
'#8b5cf6',
'#84cc16',
'#f43f5e',
'#6366f1',
'#10b981',
'#f59e0b',
'#0ea5e9'

];
const token =
localStorage.getItem('token');
const username =
localStorage.getItem('username');
const filtersContainer =
document.getElementById(
'filtersContainer'
);
const role =
localStorage.getItem('role');
const addBtn =
document.getElementById(
'addBtn'
);
const sortSelect =
document.getElementById(
'sortSelect'
);
const statsBtn =
document.getElementById(
'statsBtn'
);

const usersBtn =
document.getElementById(
'usersBtn'
);

sortSelect.addEventListener(

'change',

function(){

    sortLinks(
    this.value
    );

});

const tagFilter =
document.getElementById(
'tagFilter'
);

tagFilter.addEventListener(

'input',

function(){

    multiFilter();

});


// VIEWER
if(role === 'viewer'){

    addBtn.style.display =
    'none';

    statsBtn.style.display =
    'none';

    usersBtn.style.display =
    'none';

}


// EDITOR
if(role === 'editor'){

    usersBtn.style.display =
    'none';
    statsBtn.style.display =
    'none';

}
let allLinks = [];
const toast =
document.getElementById('toast');

document.getElementById(
'welcomeText'
).innerHTML =

`Welcome ${username} (${role})`;
const linksContainer =
document.getElementById('linksContainer');

const searchInput =
document.getElementById('searchInput');

function getTypeColor(type){

    type = type.toLowerCase();

    // لو النوع متسجل
    if(typeColors[type]){

        return typeColors[type];

    }

    // الألوان المستخدمة
    const usedColors =
    Object.values(typeColors);

    // أول لون غير مستخدم
    const availableColor =
    colors.find(color =>

        !usedColors.includes(color)

    );

    // لو الألوان خلصت
    const finalColor =
    availableColor ||

    colors[
    Object.keys(typeColors).length
    % colors.length
    ];

    // حفظ اللون
    typeColors[type] =
    finalColor;

    return finalColor;

}
async function getLinks(){

    try{
    const response = await fetch(API_URL,{

        headers:{
            Authorization:token
        }

    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    if(!Array.isArray(data)){
        throw new Error('Invalid links response');
    }

    allLinks = data;
    generateFilters(data);
    displayLinks(data);
    }catch(error){
        linksContainer.innerHTML =
        `<p style="color:red;">Error loading links: ${error.message}</p>`;

        filtersContainer.innerHTML = '';

        console.error('Load links error:', error);
    }

}


function displayLinks(links){

    if(!Array.isArray(links)){
        links = [];
    }

    linksContainer.innerHTML = '';

    links.forEach(link => {

        const tags =
        link.tags.split(',');
        const typeColor =
getTypeColor(link.type);
        const card = `

        <div class="card">

            ${
link.thumbnail

?

`<img src="${link.thumbnail}">`

:

`

<div

style="

height:180px;

background:${typeColor};

display:flex;

justify-content:center;

align-items:center;

font-size:40px;

font-weight:bold;

text-transform:uppercase;

"

>

${link.type}

</div>

`

}

            <div class="card-content">

                <h2>${link.title}</h2>

                <p>${link.description}</p>
                <p class="meta">

Uploaded By:
${link.username}

</p>

<p class="meta">

${new Date(
link.created_at
).toLocaleDateString()}

</p>
                <div class="tags">

                    ${tags.map(tag =>

                    `<span class="tag">
                        ${tag}
                    </span>`

                    ).join('')}

                </div>

                <div class="buttons">

                    <button
                    class="btn copy-btn"

                    onclick="copyLink(
                    '${link.url}'
                    )">

                    Copy

                    </button>
                    <button

class="btn"

style="
background:#111827;
color:white;
"

onclick="
showQR('${link.url}')
">

QR

</button>
                    <button
                    class="btn open-btn"

                    onclick="openLink(
                    '${link.url}'
                    )">

                    Open

                    </button>
                    ${role === 'admin' ?

`
<button
class="btn"

style="background:red;color:white"

onclick="deleteLink(${link.id})">

Delete

</button>

<button
class="btn"

style="background:orange;color:white"

onclick="
window.location.href=
'/edit-link.html?id=${link.id}'
"">

Edit

</button>
`


:

''

}
                </div>

            </div>

        </div>

        `;

        linksContainer.innerHTML += card;

    });

}


function copyLink(url){

    navigator.clipboard.writeText(url);

    alert('Link Copied');

}


function openLink(url){

    window.open(url,'_blank');

}


searchInput.addEventListener(
'keyup',

async function(){

    const value =
    this.value;

    // لو فاضي
    if(value.trim() == ''){

        getLinks();
        return;

    }

    const response =
    await fetch(

    `/api/links/search/${value}`,

    {

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    displayLinks(data);

});

if(!token){

    window.location.href =
    '/login.html';

}

getLinks();
function logout(){

    localStorage.clear();

    window.location.href =
    '/login.html';

}


function goToAdd(){

    window.location.href =
    '/add-link.html';

}
async function deleteLink(id){

    const confirmDelete =
    confirm('Delete This Link?');

    if(!confirmDelete) return;

    const response =
    await fetch(

    `/api/links/${id}`,

    {

        method:'DELETE',

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    showToast(data.message);

    getLinks();

}

async function editLink(id){

    const title =
    prompt('New Title');

    if(!title) return;

    const description =
    prompt('New Description');

    const url =
    prompt('New URL');

    const type =
    prompt('New Type');

    const tags =
    prompt('New Tags');


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

            title,
            description,
            url,
            type,
            tags

        })

    });

    const data =
    await response.json();

    alert(data.message);

    getLinks();

}

function showToast(message){

    toast.innerText =
    message;

    toast.style.opacity = '1';

    setTimeout(()=>{

        toast.style.opacity = '0';

    },2000);

}

function filterType(type){

    if(type === 'all'){

        displayLinks(allLinks);
        return;

    }

    const filtered =
    allLinks.filter(link =>

        link.type
        .toLowerCase()
        .includes(type)

    );

    displayLinks(filtered);

}

function generateFilters(links){
    if(!Array.isArray(links)){
        links = [];
    }

    // استخراج الأنواع بدون تكرار
    const types = [
        ...new Set(

            links.map(link =>

                link.type.toLowerCase()

            )

        )
    ];

    filtersContainer.innerHTML = '';

    // زرار All
    filtersContainer.innerHTML += `

    <button onclick="
    filterType('all')
    ">

    All

    </button>

    `;

    // الأنواع
    types.forEach(type => {

        filtersContainer.innerHTML += `

        <button onclick="
        filterType('${type}')
        ">

        ${type}

        </button>

        `;

    });

}

function sortLinks(type){

    let sorted =
    [...allLinks];

    if(type === 'newest'){

        sorted.sort((a,b)=>

            new Date(b.created_at)

            -

            new Date(a.created_at)

        );

    }

    else{

        sorted.sort((a,b)=>

            new Date(a.created_at)

            -

            new Date(b.created_at)

        );

    }

    displayLinks(sorted);

}

function multiFilter(){

    const tag =
    tagFilter.value
    .toLowerCase();

    const filtered =
    allLinks.filter(link =>

        link.tags
        .toLowerCase()
        .includes(tag)

    );

    displayLinks(filtered);

}

function showQR(url){

    const qrWindow =
    window.open('','_blank');

    qrWindow.document.write(`

    <html>

    <head>

    <title>QR Code</title>

    <style>

    body{

        display:flex;

        justify-content:center;

        align-items:center;

        height:100vh;

        background:#0f172a;

    }

    canvas{

        background:white;

        padding:20px;

        border-radius:20px;

    }

    </style>

    </head>

    <body>

    <canvas id="qr"></canvas>

    <script src=
    "https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js">

    <\/script>

    <script>

    QRCode.toCanvas(

        document.getElementById('qr'),

        '${url}'

    );

    <\/script>

    </body>

    </html>

    `);

}
