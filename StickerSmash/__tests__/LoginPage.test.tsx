import React from "react";
import { render, screen } from "@testing-library/react-native";

// Mock themed components
jest.mock("../components/themed-view", () => {
  const { View } = require("react-native");
  return { ThemedView: View };
});

jest.mock("../components/themed-text", () => {
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children }: any) => <Text>{children}</Text>,
  };
});

// Mock login components so tests don't trigger OAuth logic
jest.mock("../components/GoogleLoginWeb", () => {
  const { Button } = require("react-native");
  return () => <Button title="Google Login" onPress={() => {}} />;
});

jest.mock("../components/GitHubLogin", () => {
  const { Button } = require("react-native");
  return () => <Button title="GitHub Login" onPress={() => {}} />;
});

// Import the screen being tested
import LoginScreen from "../app/LoginPage";

describe("LoginScreen", () => {
  test("renders branding, subtitle, login buttons, and footer", () => {
    render(<LoginScreen />);

    // Branding title
    expect(screen.getByText("EventLink")).toBeTruthy();

    // Subtitle
    expect(screen.getByText("Sign in to discover events")).toBeTruthy();

    // Google and GitHub login buttons
    expect(screen.getByText("Google Login")).toBeTruthy();
    expect(screen.getByText("GitHub Login")).toBeTruthy();

    // Footer text
    expect(
      screen.getByText("By signing in, you agree to our Terms of Service")
    ).toBeTruthy();
  });
});