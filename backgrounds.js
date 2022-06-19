//ob4ganei7br3knkju3b5udrc2nvg6f25eckb6glhyt57lifrlnwq
//http://localhost:8080/

// Show an element


function switchPage(x){
    const show = (selector) => {
        document.querySelector(selector).style.display = 'block';
      };
      
      // Hide an element
      const hide = (selector) => {
        document.querySelector(selector).style.display = 'none';
      };
    
      if (x==1) {//add condition for token here, doubt: how to use class name as parameter
        hide('.content.unauthorized');
        show('.content.authorized');
      }
      else{
          hide('.content.authorized');
          show('.content.unauthorized');
      }
}

async function run(){
    console.log("running...");
    const config = {
        auth: {
            clientId: 'cd893e7a-6b16-4ea8-be19-2915831372bc',
            authority: 'https://login.microsoftonline.com/common/',
            redirectUri: 'http://localhost:8081/'
        },
    };
    var client = new Msal.UserAgentApplication(config);
    var request = {
        scopes: ['user.read']
    };
    let loginResponse = await client.loginPopup(request);
    console.log(loginResponse);
    //switchPage(1);
}
var code = "console.log('This code will execute as a content script');";
//chrome.tabs.executeScript({code: document.getElementById('signIn').addEventListener('click',run)});

//document.getElementById('signIn').addEventListener('click',console.log(signIn));

/*app.signIn();
var el = document.getElementById('signIn');
if(el){
  el.addEventListener('click', app.signIn);
}*/


