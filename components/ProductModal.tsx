import React from "react";
import { useForm } from "react-hook-form";

export type Product = {
  id?: string;
  name: string;
  price: number;
  status: "active" | "inactive";
  description?: string;
};

type Props = {
  initial?: Partial<Product>;
  onClose: () => void;
  onSave: (product: Product) => void;
};

export default function ProductModal({ initial = {}, onClose, onSave }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({ defaultValues: {
    name: initial.name || "",
    price: initial.price || 0,
    status: initial.status || "active",
    description: initial.description || ""
  }});

  function submit(data: Product) {
    onSave(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white p-6 rounded shadow-lg z-10 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initial.id ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit(submit)}>
          <label className="block mb-1">Name</label>
          <input {...register("name", { required: true })} className="w-full p-2 border rounded mb-3" />
          {errors.name && <div className="text-red-600">Name is required</div>}

          <label className="block mb-1">Price</label>
          <input {...register("price", { valueAsNumber: true, min: 0 })} type="number" className="w-full p-2 border rounded mb-3" />
          
          <label className="block mb-1">Status</label>
          <select {...register("status")} className="w-full p-2 border rounded mb-3">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>

          <label className="block mb-1">Description</label>
          <textarea {...register("description")} className="w-full p-2 border rounded mb-3" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{initial.id ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
