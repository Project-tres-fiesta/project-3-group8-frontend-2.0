import React from "react";
import { Button, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

// Required for web
WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function GoogleLoginWeb() {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Platform.OS !== "web",
    pathname: "LoginPage",
  });

  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      redirectUri,
      scopes: ["openid", "email", "profile"],
      responseType: "code",
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    discovery
  );



  const sendCodeToBackend = async (code: string, codeVerifier?: string) => {
    try {
      console.log("Sending code to backend:", code);
      console.log("Using codeVerifier:", codeVerifier);

      const res = await fetch("http://localhost:8080/oauth2/callback", {
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


const testBackend = async () => {
  const token = localStorage.getItem("jwt"); // localStorage.getItem is synchronous
  console.log("Token sent to backend:", token);

  try {
    const res = await fetch("http://localhost:8080/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    console.log("User profile:", data);
    return data;
  } catch (err) {
    console.error("Error testing backend:", err);
  }
};

  React.useEffect(() => {
    if (response?.type === "success" && request) {
      (async () => {
        try {
          console.log("OAuth response:", response);
          const code = response.params.code;
          console.log("Authorization code:", code);

          // Send code + PKCE verifier to backend
          await sendCodeToBackend(code, request.codeVerifier);

          // Optional: test backend
          await testBackend();
        } catch (err) {
          console.error("Error handling OAuth response:", err);
        }
      })();
    }
  }, [response, request]);

  return (
    <Button
      title="Sign in with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
