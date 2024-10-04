import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import config from "./config";

const ManagerLogin = ({ navigation }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleLogin = async () => {
    if (emailInput && passwordInput) {
      try {
        const response = await fetch(`${config.backendUrl}/manager-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
          }),
        });

        // Log the response
        const data = await response.json();
        console.log("Response Data:", data); // Log the response for debugging

        if (response.ok) {
          Alert.alert("Login Successful", data.message);
          navigation.replace("ManagerDashboard");
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error("Login Error:", error); // Log error to console
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter both email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={emailInput}
        onChangeText={setEmailInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={passwordInput}
        onChangeText={setPasswordInput}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Button title="Login" onPress={handleLogin} color="#f4511e" />

      <Text style={styles.footerText}>
        Please enter your credentials to continue.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4511e",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
  },
});

export default ManagerLogin;
