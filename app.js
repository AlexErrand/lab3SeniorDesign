//AlexErrand.github.io
import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;

createAuth0Client({
  domain: "dev-a1202082nxliupsb.us.auth0.com",
  clientId: "N9lRZPbuhjbmZUVOQ5X8bNuuqNu5YGWv",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}).then(async (client) => {
  auth0Client = client;

  // Assumes a button with id "login" in the DOM
  const loginButton = document.getElementById("login");

  const login = async () => {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  };

  loginButton.addEventListener("click", async (e) => {
    await login();
  });

  // Assumes a button with id "logout" in the DOM
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  });

  const fetchAuthConfig = () => fetch("/auth_config.json");
  const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0Client = await createAuth0Client({
      domain: config.domain,
      clientId: config.clientId
    });
  };

  window.onload = async () => {
    // .. code omitted for brevity

    updateUI();

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      // show the gated content
      return;
    }

    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      // Process the login state
      await auth0Client.handleRedirectCallback();

      updateUI();

      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");
    }
  };
});

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await auth0Client.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        audience: config.audience   // NEW - add the audience value
      }
    });
  };

const callApi = async () => {
    try {
  
      // Get the access token from the Auth0 client
      const token = await auth0Client.getTokenSilently();
  
      // Make the call to the API, setting the token
      // in the Authorization header
      const response = await fetch("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Fetch the JSON result
      const responseData = await response.json();
  
      // Display the result in the output element
      const responseElement = document.getElementById("api-call-result");
  
      responseElement.innerText = JSON.stringify(responseData, {}, 2);
  
  } catch (e) {
      // Display errors in the console
      console.error(e);
    }
  };