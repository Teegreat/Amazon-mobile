import { StyledStack } from "@/components/navigation/stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import { passkeys } from "@clerk/clerk-expo/passkeys";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import {
  LogBox,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import "./global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY"
  );
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

const InitialLayout = () => {
  const router = useRouter();
  return (
    <StyledStack
      contentClassName="bg-gray-100 dark:bg-dark"
      headerClassName="bg-dark text-white"
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="signIn"
        options={{
          title: "Amazon",
          presentation: "fullScreenModal",
          headerLeft: () => {
            if (Platform.OS === "ios") {
              return (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Text className="text-white text-lg">Cancel</Text>
                </TouchableOpacity>
              );
            }
            // For Android (and others), use default headerLeft
            return undefined;
          },
        }}
      />
      <Stack.Screen
        name="(modal)/rufus"
        options={{
          title: "Rufus",
          headerTintColor: "#000",
          ...(Platform.OS === "ios"
            ? {
                presentation: "formSheet",
                sheetAllowedDetents: [0.45, 0.95],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
                headerStyle: {
                  backgroundColor: "#fff",
                },
              }
            : {
                headerStyle: {
                  backgroundColor: "#fff",
                },
              }),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </StyledStack>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      __experimental_passkeys={passkeys}
    >
      <ThemeProvider value={theme}>
        <InitialLayout />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
