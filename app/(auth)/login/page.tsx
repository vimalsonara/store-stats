"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";

type Inputs = {
  email: string
  password: string
}

export default function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    await signIn("credentials", { ...data, redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border p-5 rounded-lg"
      >
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

        <input type="submit" className="bg-blue-500 rounded-md py-1" />
      </form>
    </div>
  );
}
