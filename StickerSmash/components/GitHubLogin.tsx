import React from "react";
import { Button, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function GitHubTestLogin() {
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: Platform.OS !== "web",
    pathname: "LoginPage",
  });

  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      redirectUri,
      scopes: ["user"],
      responseType: AuthSession.ResponseType.Code,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    discovery
  );

  const sendCodeToBackend = async (code: string, codeVerifier?: string) => {
    try {
      console.log("Sending code to backend:", code);
      console.log("Using codeVerifier:", codeVerifier);

      const API_BASE =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080'
          : 'https://group8-backend-0037104cd0e1.herokuapp.com';

      const res = await fetch(`${API_BASE}/oauth2/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      
      if (Platform.OS === 'web') {
        localStorage.setItem("jwt", data.token);
      } else {
        await SecureStore.setItemAsync("jwt", data.token);
      }
      
      console.log("Backend response:", data);
      return data;
    } catch (err) {
      console.error("Error sending code to backend:", err);
    }
  };

  React.useEffect(() => {
    if (response?.type === "success" && request) {
      (async () => {
        try {
          console.log("OAuth response:", response);
          const code = response.params.code;
          console.log("Authorization code:", code);

          await sendCodeToBackend(code, request.codeVerifier);
          
          router.replace('/(tabs)');
        } catch (err) {
          console.error("Error handling OAuth response:", err);
        }
      })();
    }
  }, [response, request]);

  return (
    <Button
      title="Sign in with GitHub"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
