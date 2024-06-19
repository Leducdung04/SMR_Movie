import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import Navigation from "./src/Navigation/Navigation";
import { NavigationContainer } from "@react-navigation/native";
export default function App() {
  return (
      <Navigation />
  );
}
