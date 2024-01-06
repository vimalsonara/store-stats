"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Item {
  itemName: string;
  quantity: number;
  price: number;
}

interface Vendor {
  id: number;
  vendorName: string;
}

interface Product {
  id: string;
  product: string;
}

type Inputs = {
  date: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  items: Item[];
};

export default function PurchaseEntry() {
  const router = useRouter();
  const { data: session } = useSession();
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

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

  const handleQuantityChange = (index: number, value: number) => {
    const updatedFields = [...fields];
    updatedFields[index].quantity = value || 0;
    fields[index] = updatedFields[index];

    const newTotalAmount = updatedFields.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    setTotalAmount(newTotalAmount);
  };

  const handlePriceChange = (index: number, value: number) => {
    const updatedFields = [...fields];
    updatedFields[index].price = value || 0;
    fields[index] = updatedFields[index];

    const newTotalAmount = updatedFields.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    setTotalAmount(newTotalAmount);
  };
  console.log(totalAmount);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const itemsWithProductId = data.items.map((item) => {
        const selectedProduct = productList.find(
          (product) => product.product === item.itemName
        );
        const productId = selectedProduct?.id;
        return {
          ...item,
          productId: productId,
        };
      });

      const response = await axios.post("/api/purchase", {
        date: data.date,
        userId: session?.user.id,
        vendorId: data.vendorId,
        vendorName: selectedVendorName,
        totalAmount,
        items: itemsWithProductId,
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
              : "rounded p-1 outline-none "
          }
          {...register("date", { required: true })}
        />
        {errors.date && <span className="text-red-500">Date required</span>}
        <select
          {...register("vendorId", { required: true })}
          className={
            errors.vendorId
              ? "border-2 border-red-500 rounded p-1 outline-none"
              : "rounded p-1 outline-none "
          }
          onChange={(e) => {
            const selectedVendorId = e.target.value;
            const selectedVendor = vendorList.find(
              (vendor) => vendor.id === parseInt(selectedVendorId)
            );
            setSelectedVendorName(selectedVendor?.vendorName || "");
          }}
        >
          <option value="">Select</option>
          {vendorList.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.vendorName}
            </option>
          ))}
        </select>
        {errors.vendorId && (
          <span className="text-red-500">Vendor required</span>
        )}

        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-2 flex-wrap">
            <select
              {...register(`items.${index}.itemName`)}
              className={"rounded p-1 outline-none "}
            >
              <option value="">Select</option>
              {productList.map((product) => (
                <option key={product.id} value={product.product}>
                  {product.product}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              step="1"
              min="1"
              className={"rounded p-1 outline-none "}
              {...register(`items.${index}.quantity`, { required: true })}
              onChange={(e) =>
                handleQuantityChange(index, parseInt(e.target.value))
              }
            />
            <input
              type="number"
              step="1"
              min="1"
              placeholder="Price"
              className={"rounded p-1 outline-none"}
              {...register(`items.${index}.price`, { required: true })}
              onChange={(e) =>
                handlePriceChange(index, parseInt(e.target.value))
              }
            />
            {index > 0 && (
              <button
                className="bg-red-500  p-1 rounded-md"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center items-center gap-2">
          {totalAmount.toString()}
          <button
            className="bg-blue-500 p-1 rounded-md"
            onClick={() => append({ itemName: "", quantity: 0, price: 0 })}
          >
            Add Item
          </button>
          <input className="bg-green-500 p-1 rounded-md" type="submit" />
        </div>
      </form>
    </div>
  );
}
