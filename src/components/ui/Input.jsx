import React from "react";

function Input({ className = "", type = "text", ...props }) {
  const baseClasses = [
    // 기본 스타일
    "file:text-foreground",
    "placeholder:text-muted-foreground", 
    "selection:bg-primary",
    "selection:text-primary-foreground",
    "dark:bg-input/30",
    "border-input",
    "flex",
    "h-9",
    "w-full", 
    "min-w-0",
    "rounded-md",
    "border",
    "px-3",
    "py-1", 
    "text-base",
    "bg-input-background",
    "transition-[color,box-shadow]",
    "outline-none",
    
    // 파일 input 스타일
    "file:inline-flex",
    "file:h-7", 
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    
    // disabled 상태
    "disabled:pointer-events-none",
    "disabled:cursor-not-allowed", 
    "disabled:opacity-50",
    
    // 반응형
    "md:text-sm",
    
    // 포커스 스타일
    "focus-visible:border-ring",
    "focus-visible:ring-ring/50", 
    "focus-visible:ring-[3px]",
    
    // 유효성 검사 스타일
    "aria-invalid:ring-destructive/20",
    "dark:aria-invalid:ring-destructive/40",
    "aria-invalid:border-destructive"
  ];

  // 클래스 합치기 (간단한 방식)
  const combinedClasses = [...baseClasses, className]
    .filter(Boolean) // 빈 문자열 제거
    .join(" ");

  return (
    <input
      type={type}
      data-slot="input"
      className={combinedClasses}
      {...props}
    />
  );
}

export { Input };