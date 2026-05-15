"use client";
import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "../../styles/ui/_tabs.scss";

function Tabs({ className = "", ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={`tabs-root ${className}`}
      {...props}
    />
  );
}

function TabsList({ className = "", ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={`tabs-list ${className}`}
      {...props}
    />
  );
}

function TabsTrigger({ className = "", ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={`tabs-trigger ${className}`}
      {...props}
    />
  );
}

function TabsContent({ className = "", ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={`tabs-content ${className}`}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };