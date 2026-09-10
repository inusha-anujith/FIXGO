import "./global.css";
import { useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { CustomerNavigator } from "./src/navigation/CustomerNavigator";

import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { AuthNavigator } from "./src/navigation/AuthNavigator";
import LeafletMap from "./src/services/location/LeafletMap";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        {/* Chamika's Authentication Flow (Disabled for Dev) */}
        {/* <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer> */}
        
        {/* Your Customer Flow (Active) */}
        <NavigationContainer>
          <CustomerNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
