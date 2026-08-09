import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

type ToggleGroupType = 'single' | 'multiple';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & { type: ToggleGroupType }
>(({ className, type, children }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    type={type}
    className={cn("flex items-center justify-center gap-1", className)}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, value, children }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    value={value}
    className={cn("", className)}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };