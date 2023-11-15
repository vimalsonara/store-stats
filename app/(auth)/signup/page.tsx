"use client";

import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    if (data.password !== data.confirmPassword) {
      console.log("password not matched");
    }

    try {
      const response = await axios.post("/api/user/signup", {
        data,
      });
      console.log(response);
    } catch (error) {}
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border p-5 rounded-lg"
      >
        <input
          type="text"
          placeholder="name"
          {...register("name", { required: true })}
          className={
            errors.name
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
        />
        {errors.name && <span className="text-red-500">Name required</span>}
        <input
          type="email"
          placeholder="email"
          {...register("email", { required: true })}
          className={
            errors.email
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
        />
        {errors.email && <span className="text-red-500">Email required</span>}
        <input
          type="password"
          placeholder="password"
          {...register("password", { required: true })}
          className={
            errors.password
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
        />
        {errors.password && (
          <span className="text-red-500">Password required</span>
        )}
        <input
          type="password"
          placeholder="confirmPassword"
          {...register("confirmPassword", { required: true })}
          className={
            errors.confirmPassword
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
        />
        {errors.confirmPassword && (
          <span className="text-red-500">Confirm password required</span>
        )}
        <input type="submit" className="bg-blue-500 rounded-md py-1" />
      </form>
    </div>
  );
}
