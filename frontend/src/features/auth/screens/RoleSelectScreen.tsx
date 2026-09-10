import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User, Wrench } from "lucide-react-native";
import { Button } from "../../../components/ui/Button";
import { Heading, Body } from "../../../components/ui/Text";
import { RoleOptionCard } from "../components/RoleOptionCard";
import type { AuthStackParamList } from "../../../navigation/types";
import type { UserRole } from "../types/role";

type Nav = NativeStackNavigationProp<AuthStackParamList, "RoleSelect">;

export function RoleSelectScreen() {
  const navigation = useNavigation<Nav>();
  const [role, setRole] = useState<UserRole>("CUSTOMER");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-8">
        <View className="gap-2">
          <Heading className="text-3xl">How will you use FIXGO?</Heading>
          <Body>You can switch later — this just sets up your first account.</Body>
        </View>

        <View className="gap-4">
          <RoleOptionCard
            icon={User}
            title="I need roadside help"
            description="Request mechanics, towing, fuel or battery assistance."
            selected={role === "CUSTOMER"}
            onPress={() => setRole("CUSTOMER")}
          />
          <RoleOptionCard
            icon={Wrench}
            title="I'm a garage or provider"
            description="Receive nearby job requests and grow your business."
            selected={role === "PROVIDER"}
            onPress={() => setRole("PROVIDER")}
          />
        </View>

        <View className="gap-3">
          <Button label="Continue" size="lg" onPress={() => navigation.navigate("Register", { role })} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => navigation.navigate("Login", { role })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
