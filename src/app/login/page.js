"use client";
import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";

export default function Login() {
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/homepage";
  const prefilledEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address (m@example.com)")
      .required("Required"),
    password: Yup.string().required("Required"),
  });

  const loginUser = async (email, password) => {
    try {
      setApiError("");
      const res = await axios.post("http://localhost:999/authentication/login", {
        email,
        password,
      });
      if (typeof window !== "undefined") {
        const dbEmail = res?.data?.user?.email || email;
        window.localStorage.setItem("nomnom_user_email", dbEmail);
        if (res?.data?.user?.address) {
          const currentCheckout = JSON.parse(
            window.localStorage.getItem("nomnom_checkout_info") || "{}"
          );
          window.localStorage.setItem(
            "nomnom_checkout_info",
            JSON.stringify({
              ...currentCheckout,
              email: dbEmail,
              address: res.data.user.address,
            })
          );
        }
      }
      router.push(nextPath);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed. Please check your email and password.";
      setApiError(typeof message === "string" ? message : "Login failed.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: prefilledEmail,
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      await loginUser(email, password);
    },
    enableReinitialize: true,
  });
  const { values, handleChange, handleBlur, errors, touched, handleSubmit } =
    formik;

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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border rounded-md w-full h-9 px-2 ${
                touched.email && errors.email
                  ? "border-red-500"
                  : "border-[#c9c9d3]"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border rounded-md w-full h-9 px-2 ${
                touched.password && errors.password
                  ? "border-red-500"
                  : "border-[#c9c9d3]"
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            {apiError && <p className="text-sm text-red-500">{apiError}</p>}

            <button
              type="submit"
              disabled={
                !values.email ||
                !values.password ||
                Boolean(errors.email) ||
                Boolean(errors.password)
              }
              className={`flex justify-center items-center rounded-md w-full h-9 text-white ${
                !values.email ||
                !values.password ||
                Boolean(errors.email) ||
                Boolean(errors.password)
                  ? "bg-gray-200"
                  : "bg-[#18181B]"
              }`}
            >
              Let&apos;s Go
            </button>
          </form>

          <div className="flex gap-3">
            <p className="text-[#71717A]">Don’t have an account?</p>
            <p
              className="text-[#2563EB]"
              onClick={() => router.push(`/signup?next=${encodeURIComponent(nextPath)}`)}
            >
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
