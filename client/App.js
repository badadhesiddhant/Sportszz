import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";

// Import your components
import RegistrationForm from "./components/RegistationForm"; // Ensure correct spelling
import Login from "./components/LoginForm";
import Home from "./components/Home";
import Blog from "./Screens/Blog";
import Club from "./Screens/Club";
import Event from "./Screens/Event";
import Sport from "./Screens/Sport";
import Tournament from "./Screens/Tournment"; // Correct spelling if needed
import ManagerLogin from "./components/ManagerLogin";
import { AuthProvider } from "./Context/authContext";

const Stack = createStackNavigator();

// Linking configuration
const linking = {
  prefixes: ["sportszz://", "exp://192.168.0.104:19000"],
  config: {
    screens: {
      Home: "home",
      Register: "register",
      Login: "login",
      ManagerLogin: "manager-login",
      Blog: "blog",
      Club: "club",
      Event: "event",
      Sport: "sport",
      Tournament: "tournament",
    },
  },
};

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    const handleDeepLink = (url) => {
      console.log("Handling deep link:", url);
      const parsedUrl = new URL(url); // Use URL constructor to parse
      const path = parsedUrl.pathname.replace("/", ""); // Remove leading slash
      const email = parsedUrl.searchParams.get("email");

      if (path === "manager-login") {
        console.log("Navigating to ManagerLogin with email:", email);
        navigationRef.current?.navigate("ManagerLogin", { email });
      } else {
        console.log("Unrecognized path:", path);
      }
    };

    // Initial URL check
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink(url);
      }
    });

    // Adding the listener for deep links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator initialRouteName="Register">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManagerLogin"
            component={ManagerLogin}
            options={{ title: "Manager Login" }}
          />
          <Stack.Screen name="Blog" component={Blog} />
          <Stack.Screen name="Club" component={Club} />
          <Stack.Screen name="Event" component={Event} />
          <Stack.Screen name="Sport" component={Sport} />
          <Stack.Screen name="Tournament" component={Tournament} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
