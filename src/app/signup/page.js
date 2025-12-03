"use client";

import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";

const Home = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address (m@example.com)")
      .required("Required"),
    password: Yup.string()
      .min(8, "it must be above 8 characters")
      .matches(/[a-zA-Z]/, "it must contain letters")
      .matches(/[0-9]/, "it must contain numbers")
      .matches(/[^a-zA-Z0-9]/, "it must contain symbols")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const createUser = async (email, password) => {
    try {
      const responce = await axios.post(
        "http://localhost:999/authentication/signup",
        { email: "test", password: "123" }
      );
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finished");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values, "values");
      await createUser();
      //   router.push("/login");
    },
  });
  function next() {
    setStep(step + 1);
  }
  function back() {
    setStep(step - 1);
  }
  return (
    <div>
      {step === 1 && <Step1 next={next} formik={formik} />}
      {step === 2 && <Step2 next={next} back={back} formik={formik} />}
    </div>
  );
};
export default Home;
