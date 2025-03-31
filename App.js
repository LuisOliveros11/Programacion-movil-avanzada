import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginProvider, LoginContext } from "./components/LoginContext";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import TakePic from "./components/TakePic";
import { RealmProvider } from "./components/RealmProvider";
import 'react-native-gesture-handler';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="TakePic" component={TakePic} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { token } = useContext(LoginContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <LoginProvider>
      <RealmProvider>
        <AppNavigator />
      </RealmProvider>
    </LoginProvider>
  );
}
