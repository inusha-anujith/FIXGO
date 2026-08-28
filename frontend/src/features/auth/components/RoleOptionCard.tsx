import { Pressable, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { SubHeading, Body } from "../../../components/ui/Text";
import { cn } from "../../../lib/cn";

export interface RoleOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onPress?: () => void;
}

export function RoleOptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onPress,
}: RoleOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-4 rounded-[28px] border p-5",
        selected ? "border-ink bg-ink" : "border-black/5 bg-surface-muted"
      )}
    >
      <View
        className={cn(
          "h-12 w-12 items-center justify-center rounded-full",
          selected ? "bg-white/10" : "bg-white"
        )}
      >
        <Icon size={22} color={selected ? "#FFFFFF" : "#0A0A0A"} />
      </View>
      <View className="flex-1 gap-1">
        <SubHeading className={selected ? "text-white" : "text-ink"}>{title}</SubHeading>
        <Body className={selected ? "text-sm text-white/70" : "text-sm text-ink/60"}>
          {description}
        </Body>
      </View>
    </Pressable>
  );
}
