import { forwardRef, type ElementRef, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-full active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-ink",
        secondary: "bg-surface-muted",
        outline: "border border-ink/15 bg-transparent",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-14 px-6",
        sm: "h-10 px-4",
        lg: "h-16 px-8",
        icon: "h-11 w-11 rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("text-center font-heading-medium", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-ink",
      outline: "text-ink",
      ghost: "text-ink",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof buttonVariants> {
  label?: string;
  children?: ReactNode;
  className?: string;
  textClassName?: string;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      className,
      textClassName,
      variant,
      size,
      label,
      children,
      trailingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={cn(
          buttonVariants({ variant, size }),
          disabled && "opacity-40",
          className
        )}
        {...props}
      >
        {label ? (
          <Text className={cn(buttonTextVariants({ variant, size }), textClassName)}>
            {label}
          </Text>
        ) : (
          children
        )}
        {trailingIcon ? <View className="ml-3">{trailingIcon}</View> : null}
      </Pressable>
    );
  }
);
Button.displayName = "Button";
