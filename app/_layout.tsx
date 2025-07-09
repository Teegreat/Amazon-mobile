import { Stack } from "expo-router";
import {ThemeProvider, DarkTheme, DefaultTheme} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import "./global.css";
import { StyledStack } from "@/components/navigation/stack";

const InitialLayout = () => {
  return (
    <StyledStack contentClassName="bg-gray-100 dark:bg-dark" headerClassName="bg-dark text-white">
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
    </StyledStack>

  )
}

const  RootLayout =() => {
  const colorScheme = useColorScheme() 
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <InitialLayout />
    </ThemeProvider>
  );
}

export default RootLayout;