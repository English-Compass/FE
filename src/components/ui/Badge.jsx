import React from "react";
import * as Slot from "@radix-ui/react-slot";
import "../../styles/ui/_badge.scss"; 

export function Badge({
  className = "",
  variant = "default", // 기본 variant 설정
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";

  // variant에 따라 클래스 추가
  const variantClass = `badge--${variant}`;

  return (
    <Comp
      data-slot="badge"
      className={`badge ${variantClass} ${className}`}
      {...props}
    />
  );
}
