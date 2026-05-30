const token =
localStorage.getItem('token');


// LOAD MAIN STATS
async function loadStats(){

    const response =
    await fetch(

    'https://company-search-production-74f6.up.railway.app/api/links/stats/all',

    {

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    document.getElementById(
    'totalLinks'
    ).innerText =

    data.totalLinks;

    document.getElementById(
    'totalTypes'
    ).innerText =

    data.totalTypes;

}


loadStats();


// LOAD TYPES CHART
async function loadChart(){

    const response =
    await fetch(

    'https://company-search-production-74f6.up.railway.app/api/links/stats/types',

    {

        headers:{
            Authorization:token
        }

    });

    const data =
    await response.json();

    const labels =
    data.map(item => item.type);

    const values =
    data.map(item => item.count);

    new Chart(

    document.getElementById(
    'typesChart'
    ),

    {

        type:'bar',

        data:{

            labels:labels,

            datasets:[{

                label:'Links Count',

                data:values

            }]

        }

    });

}


loadChart();