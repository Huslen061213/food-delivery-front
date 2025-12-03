"use client";
import { useState } from "react";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";

export default function CreateNewPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmail = (value) => {
    setEmail(value);

    if (!value) {
      setError("");
      return;
    }

    if (!emailRegex.test(value)) setError("Invalid email.");
    else setError("");
  };

  return (
    <div className="flex justify-around w-full h-full">
      <div className="flex justify-center items-center w-[416px]">
        <div className="flex flex-col gap-6">
          <ChevronLeftIcon />

          <div>
            <p className="text-2xl font-semibold">Create a strong password</p>
            <p className="text-[#71717A]">
              Create a strong password with letters, numbers.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="string"
              placeholder="Password"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              className={`border rounded-md w-full h-9 px-2 ${
                error ? "border-red-500" : "border-[#c9c9d3]"
              }`}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <input
              type="string"
              placeholder="Confirm"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              className={`border rounded-md w-full h-9 px-2 ${
                error ? "border-red-500" : "border-[#c9c9d3]"
              }`}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <button
            disabled={!email || error}
            className={`flex justify-center items-center rounded-md w-full h-9 text-white ${
              !email || error ? "bg-gray-200" : "bg-[#18181B]"
            }`}
          >
            Let&apos;s Go
          </button>

          <div className="flex gap-3">
            <p className="text-[#71717A]">Already have an account</p>
            <p className="text-[#2563EB]">Log in</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="bg-[url(/LogInBg.png)] rounded-md w-214 h-226"></div>
      </div>
    </div>
  );
}
