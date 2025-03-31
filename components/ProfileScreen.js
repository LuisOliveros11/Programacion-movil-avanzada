import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { LoginContext } from "./LoginContext";

const ProfileScreen = ({ navigation }) => {
  const { token, logout } = useContext(LoginContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil del Usuario</Text>
      <Text style={styles.token}>Token: {token}</Text>
      <Button title="Volver a Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Cerrar Sesión" onPress={() => { logout(); navigation.replace("Login"); }} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, marginBottom: 20 },
  token: { marginBottom: 20 },
});
