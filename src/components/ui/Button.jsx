import React from "react";
import * as Slot  from "@radix-ui/react-slot";

// Button 컴포넌트
function Button({ 
  className = "", 
  variant = "default", 
  size = "default", 
  asChild = false, 
  ...props 
}) {
  const Comp = asChild ? Slot : "button";

  // 클래스 이름 생성
  const buttonClasses = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Comp
      data-slot="button"
      className={buttonClasses}
      {...props}
    />
  );
}

export { Button };
