"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Inputs = {
  vendorName: string;
  mobile: string;
};

export default function CreateVendor() {
  const router = useRouter();

  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post("/api/vendor", {
        vendorName: data.vendorName,
        mobile: data.mobile,
        userId: session?.user.id,
      });
      if (response.status === 201) {
        toast.success("Vendor created successfully.");
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
          <h1 className="text-3xl font-bold">Vendor Registration</h1>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="vendor-name">Vendor Name</label>
            <input
              type="text"
              placeholder="Vendor Name"
              className={
                errors.vendorName
                  ? "border-2 border-red-500 rounded p-1 outline-none"
                  : "rounded p-1 outline-none "
              }
              {...register("vendorName", { required: true })}
            />
            {errors.vendorName && (
              <span className="text-red-500">Vendor name required</span>
            )}
          </div>
          <div className="space-y-2 flex flex-col">
            <label htmlFor="vendor-mobile">Mobile Number</label>
            <input
              type="text"
              placeholder="Vendor Mobile"
              className={
                errors.mobile
                  ? "border-2 border-red-500 rounded p-1 outline-none"
                  : "rounded p-1 outline-none "
              }
              {...register("mobile", { required: true })}
            />
            {errors.mobile && (
              <span className="text-red-500">Vendor Mobile required</span>
            )}
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
