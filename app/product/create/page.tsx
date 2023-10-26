"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Inputs = {
  product: string;
};

export default function CreateProduct() {
  const router = useRouter();

  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post("/api/product", {
        product: data.product,
        userId: session?.user.id,
      });
      if (response.status === 201) {
        toast.success("Product created successfully.");
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border p-5 rounded-lg"
      >
        <input
          type="text"
          placeholder="Product Name"
          className={
            errors.product
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
          {...register("product", { required: true })}
        />
        {errors.product && (
          <span className="text-red-500">Product name required</span>
        )}
        <input type="submit" />
      </form>
      <Toaster />
    </div>
  );
}
