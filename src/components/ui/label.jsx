import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "../../styles/ui/_label.scss";

function Label({ className, ...props }) {
  // className 조합 함수
  const combineClasses = (baseClass, additionalClass) => {
    if (!additionalClass) return baseClass;
    return `${baseClass} ${additionalClass}`;
  };

  return React.createElement(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: combineClasses("label", className),
      ...props
    }
  );
}

export { Label };