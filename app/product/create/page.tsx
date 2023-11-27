"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto max-w-md space-y-6 mt-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border p-5 rounded-lg"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">New Product</h1>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="vendor-name"
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
          </div>
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
      <Toaster />
    </div>
  );
}
