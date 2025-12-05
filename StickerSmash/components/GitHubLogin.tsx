import React, { useEffect } from "react";
import { Button, Platform, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Required for web
WebBrowser.maybeCompleteAuthSession();

// GitHub OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

let CLIENT_ID: string | undefined;
// Use different client IDs for web and mobile
if (Platform.OS === "web") {
  console.log("Running on web");
  CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_WEB;
} else {
  console.log("Running on mobile");
  CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_MOBILE;
}

// Base URL for backend (Heroku in production, localhost in dev)
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

console.log("GitHub Client ID:", CLIENT_ID);

export default function GitHubTestLogin() {
  const sendCodeToBackend = async (code: string, codeVerifier?: string) => {
    try {
      console.log("Sending code to backend:", code);
      console.log("Using codeVerifier:", codeVerifier);

      const res = await fetch(`${API_BASE}/oauth2/callbackGithub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      //await SecureStore.setItemAsync("jwt", data.token)
      await localStorage.setItem("jwt", data.token);
      console.log("Backend response:", data);

      return data;
    } catch (err) {
      console.error("Error sending code to backend:", err);
    }
  };

  // Generate the redirect URI with your Expo scheme
  let redirectUri: string | undefined;
  if (Platform.OS === "web") {
    redirectUri = AuthSession.makeRedirectUri({
      path: "HomePage", // The path to redirect to after login on web
    });
  } else {
    redirectUri = AuthSession.makeRedirectUri({
      scheme: "eventlink", // For android/iOS standalone apps, set your own scheme
    });
  }

  console.log("Redirect URI (copy this to GitHub):", redirectUri);
  console.log("GitHub Client ID:", CLIENT_ID);

  // Create the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID!,
      scopes: ["read:user", "user:email"],
      redirectUri,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success" && request) {
      (async () => {
        try {
          console.log("OAuth response:", response);
          const code = response.params.code;
          console.log("Authorization code:", code);

          // Send code + PKCE verifier to backend
          await sendCodeToBackend(code, request.codeVerifier);
        } catch (err) {
          console.error("Error handling OAuth response:", err);
        }
      })();
    }
  }, [response, request]);

  return (
    <Button
      title="Sign in with GitHub"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}