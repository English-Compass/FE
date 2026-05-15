import React from "react";

export function ProgressSteps({ step, total = 2, labels = [] }) {
  const nums = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <>
      <div className="progress__track">
        {nums.map((num) => (
          <div key={num} className="progress__steps">
            <div className={`progress__dot ${step >= num ? "is-active" : ""}`}>{num}</div>
            {num < total && <div className={`progress__bar ${step > num ? "is-filled" : ""}`} />}
          </div>
        ))}
      </div>
      <div className="progress__labels">
        {labels.map((label, i) => (
          <span key={label} className={`progress__label ${step >= i + 1 ? "is-active" : ""}`}>
            {label}
          </span>
        ))}
      </div>
    </>
  );
}
