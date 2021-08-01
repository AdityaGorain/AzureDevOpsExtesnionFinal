var token;
var myArray = [];
var projects  = [];
var orgArr = [];  
var scope  = ["vso.work_full"];
var UserName;   
var tableRows = [];           //AD
var url_ = 'https://app.vssps.visualstudio.com/oauth2/authorize?client_id=C19D0D5F-1A6C-40B4-A435-8A7DC23EAA1D&response_type=Assertion&state=User1&scope='+scope+'&redirect_uri=https://mimcejpkhoklhbdojjagnigcppffohcd.chromiumapp.org/';
function run(){
  chrome.identity.launchWebAuthFlow({
    url: url_,
    interactive: true,
  }, function(redirectURL) {
    var url = new URL(redirectURL);
    var code = new URLSearchParams(url.search).get('code');
    console.log(code);
    getAuthToken(code);

  });
};
window.onload = run();
function getAuthToken(code_get) {
  console.log(code_get);
  var data = {
    grant_type: "authorization_code",
    clientid : "cd893e7a-6b16-4ea8-be19-2915831372bc",
    scope: ["openid"],
    code: code_get,
    redirect_uri: "https://mimcejpkhoklhbdojjagnigcppffohcd.chromiumapp.org/",
    client_secret: "4369fed0-7d3e-4c35-9d9d-1415caaedc88"

  };
  var client_secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiJjMTlkMGQ1Zi0xYTZjLTQwYjQtYTQzNS04YTdkYzIzZWFhMWQiLCJjc2kiOiJiNGE1YzM0Yi01ZWI2LTQ4ZmQtOTUyMC00NTFhMzRkNzBkYWEiLCJuYW1laWQiOiJmMDU1ZGU1OC0yZjQyLTZiMDktODI4ZS0yNzAzZWQxOTU3NWQiLCJpc3MiOiJhcHAudnN0b2tlbi52aXN1YWxzdHVkaW8uY29tIiwiYXVkIjoiYXBwLnZzdG9rZW4udmlzdWFsc3R1ZGlvLmNvbSIsIm5iZiI6MTYyNjM2MDIwMSwiZXhwIjoxNzg0MTI2NjAxfQ.qUq4vuC2aRjuU7OH_te2F2BZ9spO1I5XRIWdSzczd7xeHDcN6I1K62rmrSQdCUrLA6-MnuP_Ud9cGic9M0SevR6G50w14Y753Gd-0RGlTLASMEV9QvSVkDnz8M6dZEs1qURuxNlK3pt8mJTIYZ7h2c_d7MSk-tFrjN-HVv1pi-RVwBzqEX8wooKMnd4XCdL4Wowv4Cre4utE_zDtr2_NdZ_Gs0rzibPl9HDmF_4V6c0YsQr8_eDWN9V95Juy-djvMBnweQ8yc9khB4IqvdufXWciLhD6r6_VvQMb540FiuNTvl8rC4lZKIeIuyZNFJbP6LnI4bFOZeMG0TW578RAjw"
  fetch('https://app.vssps.visualstudio.com/oauth2/token', {
  method: "POST",
  body: "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion="+client_secret+"&grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion="+code_get+"&redirect_uri=https://mimcejpkhoklhbdojjagnigcppffohcd.chromiumapp.org/",
  headers: {"Content-type": "application/x-www-form-urlencoded","Origin": "https://mimcejpkhoklhbdojjagnigcppffohcd.chromiumapp.org/","Content-Length": "1322"}})
.then(response => response.json()) 
.then(json => {
  console.log(json);
   token = json.access_token;
   console.log("This is token");
   console.log(token);
   getNameandAlias(token);
   console.log("Inside getauthtoken");
})
.catch(err => console.log(err));

};                                              
function buildTable(data, orgName, projName)
{
  var Table = document.getElementById("myTable");
    
      if(document.getElementById('projMenu').value==data.proj){
        var row = 
                `<tr>
                  <td>${data.id}</td>
                  <td>${data.bug}</td>
                  <td><a href='https://dev.azure.com/${orgName}/${projName}/_workitems/edit/${data.id}/'>${data.proj}</td>
                  <td>${data.prio}</td>
                </tr>`
                Table.innerHTML += row;
      }
}

function fillTable(data){
  console.log(data);
  var i ;
  var j ;
  for(i=4;i>0;i--){
    for(j=0;j<data.length;j++){
      console.log(data[j], " this is in fill table");
      if(data[j].prio==i){
        if(document.getElementById('projMenu').value==data[j].proj){
          var row = 
                  `<tr>
                    <td>${data[j].id}</td>
                    <td>${data[j].bug}</td>
                    <td>${data[j].proj}</td>
                    <td>${data[j].prio}</td>
                  </tr>`
                  Table.innerHTML += row;
        }
      }
    }
  }
}
function getTable(){
  chrome.storage.sync.get('myTable',function(data){
    if(data){
      tableEL.innerHTML = data.myTable;
    }
  });
}

function getProj(orgName){
  var url = "https://dev.azure.com/"+orgName+"/_apis/projects?api-version=6.0";
  fetch(url,options)
  .then(response =>response.json())
  .then(response => {
    var arr = response.value;
    arr.forEach(item => {
      projects.push(item.name);
    })
  });

  //add code to append project data to dropdown
}

document.getElementById('orgMenu').addEventListener('change',function(){
  console.log(document.getElementById('orgMenu').value);
  //getProj(document.getElementById('orgMenu').value);
  getProjects(document.getElementById('orgMenu').value,token);
});

document.getElementById('projMenu').addEventListener('change',function(){
  console.log(document.getElementById('projMenu').value);
  //build table again
});

//function for populating orgTable  
function fillorg(item){
  console.log("inside fillorg");
  console.log(item);
  var mySelect = document.getElementById('orgMenu'),
    newOption = document.createElement('option');

newOption.value = item;

// Not all browsers support textContent (W3C-compliant)
// When available, textContent is faster (see http://stackoverflow.com/a/1359822/139010)
if (typeof newOption.textContent === 'undefined')
{
    newOption.innerText = "Hello";
}
else
{
    newOption.textContent = item;
}

mySelect.appendChild(newOption);
}


//for the project 
function fillproj(item){
  var mySelect = document.getElementById('projMenu'),
  newOption = document.createElement('option');

newOption.value = item;

// Not all browsers support textContent (W3C-compliant)
// When available, textContent is faster (see http://stackoverflow.com/a/1359822/139010)
if (typeof newOption.textContent === 'undefined')
{
  newOption.innerText = "Hello";
}
else
{
  newOption.textContent = item;
}

mySelect.appendChild(newOption);
}

function getProjects(orgName , token){
  console.log(orgName + " this is in getprojects");
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  var url = "https://dev.azure.com/"+orgName+"/_apis/projects?api-version=6.0";
  fetch(url,options)
  .then(response =>response.json())
  .then(response => {
    var arr = response.value;
    arr.forEach(item => {
      fillproj(item.name);
      projects.push(item.name);
    })
  });
}

function getOrganization(publicAlias1, token){
  console.log("Getting organization");
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  var urlfororg = "https://app.vssps.visualstudio.com/_apis/accounts?ownerId="+publicAlias1+"&api-version=6.0"
  fetch(urlfororg,options)
  .then(response =>response.json())
  .then(response => {
    console.log(response);
    var arr = response.value;
    arr.forEach(items =>{
      console.log(items);
      console.log("Calling Fill org");
      fillorg(items.accountName);
    })
})
}

function getNameandAlias(token){
  console.log("Hello");
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  var urlforname = "https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0";
  fetch(urlforname,options)
  .then(response =>response.json())
  .then(response => {
    UserName = response.displayName;
    getOrganization(response.publicAlias, token);
  });
}


document.getElementById('refreshButton').addEventListener('click',refresh);


 function refresh(){
  console.log("resfresh is cicked");
  fetchandbuild(token,document.getElementById('orgMenu').value,document.getElementById('projMenu').value,document.getElementById('taskMenu').value);
  //fetchandbuild(token,"prodapttask", "Project1");
}

var data;
function fetchandbuild(token, orgName, projName, taskName){
  console.log(projName + " is called in fetchandbuild");
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
        query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.AssignedTo] = '"+UserName+"' && [System.WorkItemType] = '" +taskName+"' order by [Microsoft.VSTS.Common.Priority] asc"
      }),
  };
  //logMessage('Calling web API...'); 
                                        
  fetch(apiConfig.endpoint, options)
  .then((response) => response.json())
  .then((responseJSON) => {
    console.log(responseJSON);
     // do stuff with responseJSON here...
     var array = responseJSON.workItems;
     document.getElementById("myTable").innerHTML = '';
     array.forEach(item => {
       var ID = item.id;
       console.log('calling getName');
       getName(ID,orgName,projName,token);
     });
  
  }).catch(error => {
          console.log(error);
      });

}

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
        var priority = response.value[0].fields["Microsoft.VSTS.Common.Priority"];
          var title = response.value[0].fields["System.Title"];
          var Project = response.value[0].fields["System.TeamProject"];
          //Add these thing to val table @Amit
          data  = {
            id: ID,
            bug: title,
            proj: Project,
            prio: priority,
          };

          console.log(data);
          myArray.push(data);
          buildTable(data, orgName, projName);
      }).catch(error => {
          console.error(error);
      });
      //fillTable(myArray);
      //buildTable(myArray);
}
