import React, { useEffect } from "react";
import { Button, Platform, View } from "react-native";
import * as AuthSession from "expo-auth-session";

// GitHub OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};
let CLIENT_ID:string | undefined;
// Use different client IDs for web and mobile
if (Platform.OS === 'web') {
  console.log("Running on web");
  CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_WEB;
} else {
  console.log("Running on mobile");
  CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_MOBILE;
}

// const CLIENT_ID_MOBILE = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_MOBILE;
// const CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_MOBILE;

console.log("GitHub Client ID:", CLIENT_ID);
export default function GitHubTestLogin() {
  // Generate the redirect URI with your Expo scheme
  let redirectUri:string | undefined;
  if (Platform.OS === "web") {
    redirectUri = AuthSession.makeRedirectUri({
      path:"HomePage", // The path to redirect to after login on web
    });
  } else {
    redirectUri = AuthSession.makeRedirectUri({
      scheme: "eventlink", // For android/iOS standalone apps, set your own scheme
    });
  }
  // const redirectUri = AuthSession.makeRedirectUri({
  //   scheme: "eventlink", // For android/iOS standalone apps, set your own scheme
  //   //path:"HomePage", // The path to redirect to after login on web
  // });

  console.log("Redirect URI (copy this to GitHub):", redirectUri);
  console.log("GitHub Client ID:", CLIENT_ID);

  // Create the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri,
    },
    discovery
  );

  // Handle response
  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      console.log("GitHub response:", response);
      console.log("GitHub Code:", code);
      alert("GitHub Login Success!\n\nCode:\n" + code);
    }
  }, [response]);

  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Button
        title="Test GitHub Login"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
