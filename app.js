var token;
var myArray = [];                //AD
var url_ = 'https://app.vssps.visualstudio.com/oauth2/authorize?client_id=C19D0D5F-1A6C-40B4-A435-8A7DC23EAA1D&response_type=Assertion&state=User1&scope=vso.work_full&redirect_uri=https://adpidmjjdmpdlakpcnklklapnppdcdic.chromiumapp.org/';
function run(){
  chrome.identity.launchWebAuthFlow({
    url: url_,
    interactive: true,
  }, function(redirectURL) {
    var url = new URL(redirectURL);
    var code = new URLSearchParams(url.search).get('code');
    console.log(code);
    getAuthToken(code);                 //get a code here and using this code get an access token 
  });
};
//window.onload = run();
function getAuthToken(code_get) {                     //function to get access token
  console.log(code_get);                 
  var data = {
    grant_type: "authorization_code",
    clientid : "cd893e7a-6b16-4ea8-be19-2915831372bc",
    scope: ["openid"],
    code: code_get,
    redirect_uri: "https://adpidmjjdmpdlakpcnklklapnppdcdic.chromiumapp.org/",
    client_secret: "4369fed0-7d3e-4c35-9d9d-1415caaedc88"

  };
  var client_secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiJjMTlkMGQ1Zi0xYTZjLTQwYjQtYTQzNS04YTdkYzIzZWFhMWQiLCJjc2kiOiJiNGE1YzM0Yi01ZWI2LTQ4ZmQtOTUyMC00NTFhMzRkNzBkYWEiLCJuYW1laWQiOiJmMDU1ZGU1OC0yZjQyLTZiMDktODI4ZS0yNzAzZWQxOTU3NWQiLCJpc3MiOiJhcHAudnN0b2tlbi52aXN1YWxzdHVkaW8uY29tIiwiYXVkIjoiYXBwLnZzdG9rZW4udmlzdWFsc3R1ZGlvLmNvbSIsIm5iZiI6MTYyNjM2MDIwMSwiZXhwIjoxNzg0MTI2NjAxfQ.qUq4vuC2aRjuU7OH_te2F2BZ9spO1I5XRIWdSzczd7xeHDcN6I1K62rmrSQdCUrLA6-MnuP_Ud9cGic9M0SevR6G50w14Y753Gd-0RGlTLASMEV9QvSVkDnz8M6dZEs1qURuxNlK3pt8mJTIYZ7h2c_d7MSk-tFrjN-HVv1pi-RVwBzqEX8wooKMnd4XCdL4Wowv4Cre4utE_zDtr2_NdZ_Gs0rzibPl9HDmF_4V6c0YsQr8_eDWN9V95Juy-djvMBnweQ8yc9khB4IqvdufXWciLhD6r6_VvQMb540FiuNTvl8rC4lZKIeIuyZNFJbP6LnI4bFOZeMG0TW578RAjw"
  fetch('https://app.vssps.visualstudio.com/oauth2/token', {
  method: "POST",
  body: "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion="+client_secret+"&grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion="+code_get+"&redirect_uri=https://adpidmjjdmpdlakpcnklklapnppdcdic.chromiumapp.org/",
  headers: {"Content-type": "application/x-www-form-urlencoded","Origin": "https://adpidmjjdmpdlakpcnklklapnppdcdic.chromiumapp.org/","Content-Length": "1322"}})
.then(response => response.json()) 
.then(json => {
  console.log(json);
   token = json.access_token;
   console.log("This is token");
   console.log(token);
  switchPage(1);
  //fetch_data(token);
})
.catch(err => console.log(err));

};
function fetch_data(token,orgName,projName) {
  const apiConfig = {
    endpoint: "https://dev.azure.com/"+orgName+"/"+projName+"/_apis/wit/wiql?api-version=6.0",
    scopes: ["499b84ac-1321-427f-aa17-267ca6975798/.default"] // do not change this value
};
  const headers_ = new Headers();
  const bearer = `Bearer ${token}`;
  headers_.append("Authorization", bearer);
  var newheader = {"Content-Type":"application/json","Authorization": "Bearer "+token, "Accept": "*/*" }
  
  const options = {
      method: 'POST',
      headers: newheader,
      body: JSON.stringify({
        query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.AssignedTo] = 'ADITYA GORAIN' && [System.WorkItemType] = 'Task' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
      }),
  };
  //logMessage('Calling web API...');
                                      
  fetch(apiConfig.endpoint, options)
  .then((response) => response.json())
  .then((responseJSON) => {
     // do stuff with responseJSON here...
     var array = responseJSON.workItems;
     array.forEach(item => {
       var ID = item.id;
       getName(ID,orgName,projName,token);
     });
  }).catch(error => {
          console.log(error);
      });

}

//New Function to fetch the task Name/ BUG Name assigned 

function getName(ID , orgName , projName , token){
  const endpoint = "https://dev.azure.com/"+orgName+"/"+projName+"/_apis/wit/workitems?ids=" + ID + "&api-version=6.0";
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  fetch(endpoint, options)
      .then(response => response.json())
      .then(response => {
          var title = response.value[0].fields["System.Title"];
          var Project = response.value[0].fields["System.TeamProject"];
          
          const data  = {
            id: ID,
            bug: title,
            proj: Project
          };
          myArray.push(data);
          buildTable(myArray);
          console.log(myArray);
      }).catch(error => {
          console.error(error);
      });
  //Fetching data here

}

//event listener for sign in
var signIn =  document.getElementById('signIn');
if(signIn){
  signIn.addEventListener('click',run);
}

function switchPage(x){                                                         //*
  const show = (selector) => {
      document.querySelector(selector).style.display = 'block';
    };
    
    // Hide an element
    const hide = (selector) => {
      document.querySelector(selector).style.display = 'none';                 //*
    };
  
    if (x==1) {//add condition for token here, doubt: how to use class name as parameter
      hide('.initial');
      show('.selectProject');
    }
    else if (x==2){
        hide('.selectProject');
        show('.displayTasks');
    }
    else if (x==3){
      hide('.displayTasks');
      show('.selectProject');
    }
    else{
      hide('.displayTasks');
      show('.initial');
    }
}

var addProj =  document.getElementById('addProj');
if(addProj){
  addProj.addEventListener('click',addProject);
}

function addProject(){                                             
  const tbodyEl = document.querySelector('tbody');
  var org = document.getElementById('org').value;
  var proj = document.getElementById('proj').value;

  let template = `
                <tr>
                    <td>${org}</td>
                    <td>${proj}</td>
                    <td><button class='callAPI'>Call API</button> <br> <button class='deleteProj'>Delete</button></td>
                </tr>`;

  tbodyEl.innerHTML += template ;                               //*

  chrome.storage.sync.set({'myTable': tableEL.innerHTML});
}

const tableEL = document.querySelector('table');
if(tableEL){
  tableEL.addEventListener('click',tableClick);
}


function tableClick(e) {
  if(e.target.classList.contains("callAPI")){                  //*
    var rowIndex = e.path[0].parentNode.parentNode.rowIndex;
    var orgName = tableEL.rows[rowIndex].cells[0].innerHTML        //cell-->col
    var projName = tableEL.rows[rowIndex].cells[1].innerHTML
    console.log(tableEL.rows[rowIndex].cells[0].innerHTML);
    console.log(tableEL.rows[rowIndex].cells[1].innerHTML);
    fetch_data(token,orgName,projName);
    switchPage(2);
  }
  if (e.target.classList.contains("deleteProj")) {
    const btn = e.target;
    btn.closest("tr").remove();
  }

  chrome.storage.sync.set({'myTable': tableEL.innerHTML});
}
                                              
function buildTable(data)
{
  var Table = document.getElementById("myTable");
  for(var i = 0 ; i < data.length ; i++)
  {
    var row = 
                `<tr>
                  <td>${data[i].id}</td>
                  <td>${data[i].bug}</td>
                  <td>${data[i].proj}</td>
                </tr>`
  }
  Table.innerHTML += row;
}

function getTable(){
  chrome.storage.sync.get('myTable',function(data){
    if(data){
      tableEL.innerHTML = data.myTable;
    }
  });
}

document.getElementById('getTable').addEventListener('click',getTable);