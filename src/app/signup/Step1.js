"use client";
import { useState } from "react";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";
import { useRouter } from "next/navigation";
export default function Step1({ next, formik }) {
  return (
    <div className="flex justify-around w-full h-full ">
      <div className="flex justify-center items-center w-[416px]">
        <div className="flex flex-col gap-6">
          <ChevronLeftIcon />

          <div>
            <p className="text-2xl font-semibold">Create your account</p>
            <p className="text-[#71717A]">
              Sign up to explore your favorite dishes.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="Enter your email address"
              value={formik.values.email}
              name="email"
              onChange={formik.handleChange}
              className={`border rounded-md w-full h-9 px-2 ${
                formik.errors.email ? "border-red-500" : "border-[#c9c9d3]"
              }`}
            />

            {formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <button
            onClick={next}
            disabled={!formik.values.email || formik.errors.email}
            className={`flex justify-center items-center rounded-md w-full h-9 text-white ${
              !formik.values.email || formik.errors.email
                ? "bg-gray-200"
                : "bg-[#18181B]"
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
