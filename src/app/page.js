"use client";
import Image from "next/image";
import { useState } from "react";
import Step1 from "./signup/Step1";
import Step2 from "./signup/Step2";

export default function Home() {
  const [step, setStep] = useState(1);
  function next() {
    setStep(step + 1);
  }
  function back() {
    setStep(step - 1);
  }
  return <div>Home</div>;
}
