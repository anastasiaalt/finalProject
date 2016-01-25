// step 1 Configuring your LinkedIn application
// what's our clientId and clientSecret?

// Can set this up in the terminal by going to subl .bash_profile
// Scroll to bottom and get this
// # ====================================
// # Environmental Variables and API Keys
// # ====================================

var clientId = '778jnepkcnh6i3';
var clientSecret = 'IHh7ZOSu1DWLtGlH';

// restart bash profile after doing this from the terminal
// type reload in console

// what's our callback url?

var callbackUrl = 'http://127.0.0.1:3000/auth/linkedin/callback';

// Step 2 — Request an Authorization Code

// what URL do we have to request
// To request an authorization code, you must direct the user's browser to LinkedIn's OAuth 2.0 authorization endpoint.
var url = 'https://www.linkedin.com/uas/oauth2/authorization'


// what HTTP verb do we need to you?
var verb = GET

// what parameters do we need to pass?

var params = {
  response_type: 'code',
  client_id: clientId,
  redirect_uri: callbackUrl,
  state: 'Donna',
  scope: 'r_basicprofile'
}

// step 3 - Exchange Authorization Code for an Access Token
// what URL do we have to request

// The final step towards obtaining an Access Token is for your application to ask for one using the Authorization Code it just acquired.  This is done by making the following "x-www-form-urlencoded" HTTP POST request:
// Need to close the express server and npm install --save request
// This is where I am requesting the access token and exchanging the code I got in step 2 for the access token

var url = 'https://www.linkedin.com/uas/oauth2/accessToken'

// what HTTP verb do we need to you?
var verb = POST

// what parameters do we need to pass?

var params = {
  grant_type = authorization_code
  code
  redirect_uri
  client_id
  client_secret
}

// This is done by making the following "x-www-form-urlencoded" HTTP POST request:
// request.post(url, {form: params})
// The form: params

// // sample call
// POST /uas/oauth2/accessToken HTTP/1.1
// Host: www.linkedin.com
// Content-Type: application/x-www-form-urlencoded

// grant_type=authorization_code&code=987654321&redirect_uri=https%3A%2F%2Fwww.myapp.com%2Fauth%2Flinkedin&client_id=123456789&client_secret=shhdonottell

