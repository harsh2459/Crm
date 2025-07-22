import React from "react";
const Stepper = ({ steps, step }) => (
  <div className="stepper-row">
    {steps.map((s, i) => (
      <div key={i} className={`stepper-step ${step === i ? "active" : step > i ? "done" : ""}`}>
        <span className="stepper-bubble">{i + 1}</span>
        <span className="stepper-label">{s.label}</span>
        {i !== steps.length - 1 && <span className="stepper-line" />}
      </div>
    ))}
  </div>
);
export default Stepper;
