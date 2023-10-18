"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface Vendor {
  _id: string;
  vendorName: string;
}

interface Product {
  _id: string;
  product: string;
}

type Inputs = {
  date: string;
  userId: string;
  vendorId: string;
  items: Item[];
};

export default function PurchaseEntry() {
  const router = useRouter();
  const { data: session } = useSession();
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState([0]);

  useEffect(() => {
    if (session?.user.id) {
      const getAllVendorsAndProducts = async () => {
        try {
          const vendors = await axios.post("/api/vendor/list", {
            userId: session?.user.id,
          });
          const products = await axios.post("/api/product/list", {
            userId: session?.user.id,
          });
          setVendorList(vendors.data);
          setProductList(products.data);
        } catch (error) {
          console.log(error);
        }
      };

      getAllVendorsAndProducts();
    }
  }, [session]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      items: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post("/api/purchase", {
        date: data.date,
        userId: session?.user.id,
        vendorId: data.vendorId,
        items: data.items,
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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border p-5 rounded-lg"
      >
        <input
          type="date"
          placeholder="Purchase Date"
          className={
            errors.date
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none text-black"
          }
          {...register("date", { required: true })}
        />
        {errors.date && <span className="text-red-500">Date required</span>}
        <select {...register("vendorId")} className="text-black">
          {vendorList.map((vendor) => (
            <option key={vendor._id} value={vendor._id}>
              {vendor.vendorName}
            </option>
          ))}
        </select>
        {fields.map((item, index) => (
          <div key={item.id}>
            <select
              {...register(`items.${index}.itemId`)}
              className="text-black"
            >
              <option value="">Select</option>
              {productList.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.product}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              className="text-black"
              {...register(`items.${index}.quantity`, { required: true })}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              className="text-black"
              {...register(`items.${index}.price`, { required: true })}
            />
            {index > 0 && <button onClick={() => remove(index)}>Remove</button>}
          </div>
        ))}
        <button onClick={() => append({})}>Add Item</button>
        <input type="submit" />
      </form>
    </div>
  );
}
