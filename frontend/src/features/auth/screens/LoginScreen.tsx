import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Heading, Body, Muted } from "../../../components/ui/Text";
import type { AuthStackParamList } from "../../../navigation/types";
import { ROLE_LABEL } from "../types/role";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Login">;
type Rt = RouteProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-8">
        <View className="gap-2">
          <Heading className="text-3xl">Welcome back</Heading>
          <Body>Sign in as a {ROLE_LABEL[params.role]}.</Body>
        </View>

        <View className="gap-4">
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Body className="text-right text-sm text-ink/50">Forgot password?</Body>
        </View>

        <View className="gap-4">
          <Button label="Sign In" size="lg" />
          <View className="flex-row justify-center gap-1">
            <Muted>Don&apos;t have an account?</Muted>
            <Muted
              className="text-ink"
              onPress={() => navigation.navigate("Register", { role: params.role })}
            >
              Sign up
            </Muted>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
