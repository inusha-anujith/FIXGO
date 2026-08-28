import { forwardRef, useState } from "react";
import { TextInput, View, Text, type TextInputProps } from "react-native";
import { cn } from "../../lib/cn";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, containerClassName, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View className={cn("gap-2", containerClassName)}>
        {label ? <Text className="font-body-medium text-sm text-ink/70">{label}</Text> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#9CA3AF"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "h-14 rounded-2xl border bg-surface-muted px-4 font-body text-base text-ink",
            focused ? "border-ink" : "border-transparent",
            error ? "border-red-500" : "",
            className
          )}
          {...props}
        />
        {error ? <Text className="font-body text-xs text-red-500">{error}</Text> : null}
      </View>
    );
  }
);
Input.displayName = "Input";
