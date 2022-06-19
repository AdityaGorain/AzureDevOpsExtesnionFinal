
var url_ = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=cd893e7a-6b16-4ea8-be19-2915831372bc&response_type=code&redirect_uri=https://lnajkbbebpiplijddkbieoiookeknhje.chromiumapp.org/&response_mode=query&scope=openid&state=12345&code_challenge=ba7_E-fgqBkkwBtm2ohMpMbmn5M2v5SO2ZND-c77dBY&code_challenge_method=S256';
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
  var data = {
    grant_type: "authorization_code",
    clientid : "cd893e7a-6b16-4ea8-be19-2915831372bc",
    scope: "openid",
    code: code_get,
    redirect_uri: "https://lnajkbbebpiplijddkbieoiookeknhje.chromiumapp.org/",
    client_secret: "4369fed0-7d3e-4c35-9d9d-1415caaedc88"

  };
  fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
  method: "POST",
  body: "grant_type=authorization_code&client_id=cd893e7a-6b16-4ea8-be19-2915831372bc&code="+code_get+"&redirect_uri=https://lnajkbbebpiplijddkbieoiookeknhje.chromiumapp.org/&code_verifier=Vpix.k2rM_nOHTdw0oJe9y798o~RZzXa7bekBskoDX3feL9Fl6yf1UZxvBQ1kmAQS3RS2uJYce7z9698kTQKxW0r6WBXNfVb.NxPcAYyXIiXx0nm273pkvq1HzoGQ-Mu",
  headers: {"Content-type": "application/x-www-form-urlencoded","Origin": "https://lnajkbbebpiplijddkbieoiookeknhje.chromiumapp.org/"}
})
.then(response => response.json()) 
.then(json => {
  var token = json.access_token;
  fetch_data(token);
})
.catch(err => console.log(err));

};
function fetch_data(token) {
  const apiConfig = {
    endpoint: "https://dev.azure.com/prodapttask/Project1/_apis/wit/workitems?ids=2&api-version=6.0",
    scopes: ["499b84ac-1321-427f-aa17-267ca6975798/.default"] // do not change this value
};
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  headers.append("Authorization", bearer);
  const res  = { query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Bug' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"};
  const options = {
      method: "GET",
      headers: headers,
  };
  logMessage('Calling web API...');
  fetch(apiConfig.endpoint, options)
      .then(response => response.json())
      .then(response => {
          console.log(response);
      }).catch(error => {
          console.error(error);
      });

}
