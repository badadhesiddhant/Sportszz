// components/ManagerLogin.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const ManagerLogin = ({ navigation }) => {
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password

  const handleLogin = () => {
    // Handle the login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    // You can call your login API or perform validation here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Hides the password input
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default ManagerLogin;
