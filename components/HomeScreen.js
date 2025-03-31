import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { LoginContext } from "./LoginContext";

const HomeScreen = ({ navigation }) => {
  const { token, logout } = useContext(LoginContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a Home</Text>
      <Text style={styles.token}>Token: {token}</Text>
      <Button title="Ir a Perfil" onPress={() => navigation.navigate("Profile")} />
      <Button title="Tomar foto" onPress={() => navigation.navigate("TakePic") } />
      <Button title="Cerrar Sesión" onPress={() => { logout(); navigation.replace("Login"); }} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, marginBottom: 20 },
  token: { marginBottom: 20 },
});
