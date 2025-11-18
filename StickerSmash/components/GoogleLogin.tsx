import React, { useEffect } from "react";
import { Button, View } from "react-native";
import * as AuthSession from "expo-auth-session";

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

// Replace with your Google Web Client ID
const CLIENT_ID = "<YOUR_GOOGLE_CLIENT_ID>";

export default function GoogleTestLogin() {
  // Generate redirect URI using Expo proxy for Expo Go
  const redirectUri = AuthSession.makeRedirectUri({
    // @ts-ignore: useProxy exists at runtime
    useProxy: true,
  });

  console.log(
    "Redirect URI (copy this into Google Cloud Console):",
    redirectUri
  );

  // Create the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["profile", "email"],
      redirectUri,
      responseType: "code",
    },
    discovery
  );

  // Handle response
  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      alert("Google Login Success!\n\nAuthorization Code:\n" + code);
      console.log("Google Authorization Code:", code);
    }
  }, [response]);

  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Button
        title="Test Google Login"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
