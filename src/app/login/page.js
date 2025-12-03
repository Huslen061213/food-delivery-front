"use client";
import { useState } from "react";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleClickSignUpButton = () => {
    router.push("/signup");
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const loginuser = async (email, password) => {
    try {
      await axios.post("http://localhost:999/authentication/login", {
        email: email,
        password: password,
      });
    } catch (err) {
      setError;
    }
  };

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
            <p className="text-2xl font-semibold">Log in </p>
            <p className="text-[#71717A]">
              Log in to enjoy your favorite dishes.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              className={`border rounded-md w-full h-9 px-2 ${
                error ? "border-red-500" : "border-[#c9c9d3]"
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-md w-full h-9 px-2 border-[#c9c9d3]"
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
            <p className="text-[#2563EB]" onClick={handleClickSignUpButton}>
              Sign up
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="bg-[url(/LogInBg.png)] rounded-md w-214 h-226"></div>
      </div>
    </div>
  );
}
