import { View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";

export interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-[28px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5",
        className
      )}
      {...props}
    />
  );
}
