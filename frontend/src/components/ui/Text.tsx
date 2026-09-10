import { Text as RNText, type TextProps } from "react-native";
import { cn } from "../../lib/cn";

export interface TypographyProps extends TextProps {
  className?: string;
}

export function Heading({ className, ...props }: TypographyProps) {
  return <RNText className={cn("font-heading text-3xl tracking-tight text-ink", className)} {...props} />;
}

export function SubHeading({ className, ...props }: TypographyProps) {
  return <RNText className={cn("font-heading-medium text-lg text-ink", className)} {...props} />;
}

export function Body({ className, ...props }: TypographyProps) {
  return <RNText className={cn("font-body text-base text-ink/70", className)} {...props} />;
}

export function Muted({ className, ...props }: TypographyProps) {
  return <RNText className={cn("font-body text-sm text-ink/50", className)} {...props} />;
}
