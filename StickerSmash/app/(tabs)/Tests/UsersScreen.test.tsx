// // app/(tabs)/Tests/UsersScreen.test.tsx
// import React from "react";
// import { render, waitFor } from "@testing-library/react-native";

// import UsersScreen from "../UserScreen";

// // --- Mocks ---

// // Mock SecureStore so getJwt() inside UsersScreen always has a token
// jest.mock("expo-secure-store", () => ({
//   getItemAsync: jest.fn().mockResolvedValue("test-jwt-token"),
// }));

// describe("UsersScreen", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();

//     // Mock global.fetch for the 2 calls UsersScreen makes:
//     // 1) GET /api/users/profile
//     // 2) GET /api/users
//     (global as any).fetch = jest.fn((url: string) => {
//       if (url.includes("/api/users/profile")) {
//         return Promise.resolve({
//           ok: true,
//           status: 200,
//           json: async () => ({
//             userId: 1,
//             userName: "Me Myself",
//             userEmail: "me@example.com",
//             profilePicture: null,
//           }),
//         });
//       }

//       if (url.includes("/api/users")) {
//         return Promise.resolve({
//           ok: true,
//           status: 200,
//           json: async () => [
//             {
//               userId: 1,
//               userName: "Me Myself",
//               userEmail: "me@example.com",
//               profilePicture: null,
//             },
//             {
//               userId: 2,
//               userName: "Alice",
//               userEmail: "alice@example.com",
//               profilePicture: null,
//             },
//             {
//               userId: 3,
//               userName: "Bob",
//               userEmail: "bob@example.com",
//               profilePicture: null,
//             },
//           ],
//         });
//       }

//       // anything else → 404-ish stub
//       return Promise.resolve({
//         ok: false,
//         status: 404,
//         json: async () => ({}),
//       });
//     });
//   });

//   it("renders other users and excludes the current user", async () => {
//     const { getByText, queryByText } = render(<UsersScreen />);

//     // Wait for one of the other users to appear
//     await waitFor(() => {
//       expect(getByText("Alice")).toBeTruthy();
//     });

//     // Other user is present
//     expect(getByText("Bob")).toBeTruthy();

//     // Current user ("Me Myself") should NOT be in the list
//     expect(queryByText("Me Myself")).toBeNull();
//   });
// });

