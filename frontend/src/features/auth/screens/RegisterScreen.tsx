import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Heading, Body, Muted } from "../../../components/ui/Text";
import type { AuthStackParamList } from "../../../navigation/types";
import { ROLE_LABEL } from "../types/role";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Register">;
type Rt = RouteProp<AuthStackParamList, "Register">;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const isProvider = params.role === "PROVIDER";

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-1 justify-between px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Heading className="text-3xl">Create your account</Heading>
          <Body>Signing up as a {ROLE_LABEL[params.role]}.</Body>
        </View>

        <View className="gap-4 py-8">
          <Input label="Full name" placeholder="Kasun Perera" value={fullName} onChangeText={setFullName} />
          {isProvider ? (
            <Input
              label="Garage / business name"
              placeholder="Perera Auto Care"
              value={businessName}
              onChangeText={setBusinessName}
            />
          ) : null}
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Phone number"
            placeholder="07X XXX XXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="gap-4">
          <Button label={isProvider ? "Submit for verification" : "Create account"} size="lg" />
          <View className="flex-row justify-center gap-1">
            <Muted>Already have an account?</Muted>
            <Muted
              className="text-ink"
              onPress={() => navigation.navigate("Login", { role: params.role })}
            >
              Sign in
            </Muted>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
