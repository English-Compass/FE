"use client";

import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import "./_select.scss";

function Select({ ...props }) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className = "",
  size = "default",
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={`select-trigger select-trigger--${size} ${className}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="select-trigger__icon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className = "",
  children,
  position = "popper",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={`select-content ${position === "popper" ? "select-content--popper" : ""} ${className}`}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={`select-viewport ${position === "popper" ? "select-viewport--popper" : ""}`}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className = "", ...props }) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={`select-label ${className}`}
      {...props}
    />
  );
}

function SelectItem({ className = "", children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={`select-item ${className}`}
      {...props}
    >
      <span className="select-item__indicator">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="select-item__check" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className = "", ...props }) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={`select-separator ${className}`}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className = "", ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={`select-scroll-button select-scroll-button--up ${className}`}
      {...props}
    >
      <ChevronUpIcon className="select-scroll-button__icon" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className = "", ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={`select-scroll-button select-scroll-button--down ${className}`}
      {...props}
    >
      <ChevronDownIcon className="select-scroll-button__icon" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};