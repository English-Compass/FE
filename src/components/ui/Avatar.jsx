"use client";

import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// 랜덤 색상 목록
const COLORS = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
];

// 랜덤 색상 선택 함수
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

// 이름으로 이니셜 추출 함수
const getInitial = (name) => {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
};

// Avatar Root
export function Avatar({ className = "", ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={`relative flex size-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  );
}

// Avatar Image
export function AvatarImage({ className = "", ...props }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={`aspect-square size-full ${className}`}
      {...props}
    />
  );
}

// Avatar Fallback
export function AvatarFallback({ name, className = "", ...props }) {
  const [color] = React.useState(getRandomColor()); // 컴포넌트가 마운트될 때 고정
  const initial = getInitial(name);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={`flex size-full items-center justify-center rounded-full text-white font-semibold ${color} ${className}`}
      {...props}
    >
      {initial}
    </AvatarPrimitive.Fallback>
  );
}
