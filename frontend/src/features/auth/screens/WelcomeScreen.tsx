import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowRight } from "lucide-react-native";
import { Button } from "../../../components/ui/Button";
import { Heading, Body } from "../../../components/ui/Text";
import type { AuthStackParamList } from "../../../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Welcome">;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-8">
        <View className="items-end">
          <Body className="text-sm text-ink/40" onPress={() => navigation.navigate("RoleSelect")}>
            Skip
          </Body>
        </View>

        <View className="gap-6">
          <View className="h-72 items-center justify-center rounded-[32px] bg-surface-muted">
            <Body className="text-ink/30">Illustration</Body>
          </View>

          <View className="gap-3">
            <Heading className="text-4xl leading-[44px]">
              Roadside help,{"\n"}anytime, anywhere.
            </Heading>
            <Body>
              Request a mechanic, towing or fuel service and get matched with the nearest
              verified provider in minutes.
            </Body>
          </View>
        </View>

        <Button
          label="Get Started"
          size="lg"
          onPress={() => navigation.navigate("RoleSelect")}
          trailingIcon={
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <ArrowRight size={18} color="#0A0A0A" />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
