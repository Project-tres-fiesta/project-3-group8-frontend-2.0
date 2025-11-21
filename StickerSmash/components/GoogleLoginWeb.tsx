import React from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // Required for web

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function GoogleLoginWeb() {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Platform.OS !== "web",
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      redirectUri,
      scopes: ["openid", "email", "profile"],
      responseType: "code",
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      console.log("Success:", response.params.code);
      console.log("Full response:", response);
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
