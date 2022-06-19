/** 
 * Helper function to call web API endpoint
 * using the authorization bearer token scheme
*/
function callApiWithToken(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    const res  = { query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Bug' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"};
    const options = {
        method: "GET",
        headers: headers,
    };
    logMessage('Calling web API...');
    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => {
            logMessage('Web API responds:');
            logMessage(response);
            console.log(response);
        }).catch(error => {
            console.error(error);
        });
}
