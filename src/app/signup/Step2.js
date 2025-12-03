"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";
import { useRouter } from "next/navigation";

export default function Step2({ next, back, formik }) {
  return (
    <div className="flex justify-around w-full h-full">
      <div className="flex justify-center items-center w-[416px]">
        <form
          onSubmit={(e) => {
            e.preventDefault(), formik.handleSubmit(formik.values);
          }}
          className="flex flex-col gap-6"
        >
          <span onClick={back} className="w-4 h-4 ">
            <ChevronLeftIcon />
          </span>

          <div>
            <p className="text-2xl font-semibold">Create a strong password</p>
            <p className="text-[#71717A]">
              Create a strong password with letters, numbers.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded-md w-full h-9 px-2 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-[#c9c9d3]"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded-md w-full h-9 px-2 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-[#c9c9d3]"
              }`}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <button
            type="submit"
            className={`flex justify-center items-center rounded-md w-full h-9 text-white ${
              formik.isValid && formik.dirty
                ? "bg-[#18181B]"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            disabled={!formik.isValid}
          >
            Let&apos;s Go
          </button>

          <div className="flex gap-3">
            <p className="text-[#71717A]">Already have an account</p>
            <p className="text-[#2563EB] cursor-pointer">Log in</p>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center">
        <div className="bg-[url(/LogInBg.png)] rounded-md w-214 h-226"></div>
      </div>
    </div>
  );
}
