import React from "react";

function Textarea({ className = "", ...props }) {
  const baseClasses = [
    // 크기 조정 및 레이아웃
    "resize-none",
    "flex",
    "field-sizing-content",
    "min-h-16",
    "w-full",
    
    // 테두리 및 배경
    "border-input",
    "rounded-md",
    "border",
    "bg-input-background",
    "dark:bg-input/30",
    
    // 패딩 및 텍스트
    "px-3",
    "py-2",
    "text-base",
    "md:text-sm",
    
    // 플레이스홀더
    "placeholder:text-muted-foreground",
    
    // 포커스 스타일
    "focus-visible:border-ring",
    "focus-visible:ring-ring/50",
    "focus-visible:ring-[3px]",
    
    // 유효성 검사 스타일
    "aria-invalid:ring-destructive/20",
    "dark:aria-invalid:ring-destructive/40",
    "aria-invalid:border-destructive",
    
    // 전환 효과
    "transition-[color,box-shadow]",
    "outline-none",
    
    // disabled 상태
    "disabled:cursor-not-allowed",
    "disabled:opacity-50"
  ];

  // 클래스 합치기
  const combinedClasses = [...baseClasses, className]
    .filter(Boolean) // 빈 문자열 제거
    .join(" ");

  return (
    <textarea
      data-slot="textarea"
      className={combinedClasses}
      {...props}
    />
  );
}

export { Textarea };