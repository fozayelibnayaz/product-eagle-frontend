import React, { useEffect, useMemo, useState } from "react";
import useRequireAuth from "../pages/hooks/useRequireAuth";
import { db } from "../lib/firebaseClient";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import ProductModal, { Product } from "../components/ProductModal";
import { useRouter } from "next/router";
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";

type Row = Product & { id: string };

export default function ProductsPage() {
  useRequireAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Row[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);

  useEffect(() => {
    const colRef = collection(db, "products");
    const unsub = onSnapshot(colRef, snapshot => {
      const list: Row[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setProducts(list);
    }, err => {
      console.error("Snapshot error:", err);
    });

    return () => unsub();
  }, []);

  async function handleSave(data: Product) {
    if (editing) {
      const dRef = doc(db, "products", editing.id);
      await updateDoc(dRef, { ...data, updatedAt: serverTimestamp() });
      setEditing(null);
      setIsModalOpen(false);
      return;
    }
    await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
  }

  async function changeStatus(id: string, status: "active" | "inactive") {
    await updateDoc(doc(db, "products", id), { status });
  }

  const data = useMemo(() => products, [products]);

  const columns = useMemo<ColumnDef<Row, any>[]>(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "price", header: "Price", cell: info => `$${info.getValue()}` },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "description", header: "Description" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(rowData); setIsModalOpen(true); }} className="px-2 py-1 border rounded">Edit</button>
            <button onClick={() => handleDelete(rowData.id)} className="px-2 py-1 border rounded">Delete</button>
            <button onClick={() => changeStatus(rowData.id, rowData.status === "active" ? "inactive" : "active")} className="px-2 py-1 border rounded">
              {rowData.status === "active" ? "Make Inactive" : "Make Active"}
            </button>
          </div>
        );
      }
    }
  ], [products]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Products</h1>
          <div>
            <button onClick={() => { setEditing(null); setIsModalOpen(true); }} className="px-3 py-2 bg-blue-600 text-white rounded">Add Product</button>
            <button onClick={() => router.push("/analytics")} className="ml-2 px-3 py-2 border rounded">Analytics</button>
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers
    .filter(header => !header.isPlaceholder) // Crucially filter out placeholder headers
    .map(header => (
        <th 
            key={header.id} 
            className="p-3 text-left text-sm font-medium"
        >
            {/* Use header.column.columnDef.header to render the defined content */}
            {header.column.columnDef.header} 
        </th>
    ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 text-sm">
    {cell.column.columnDef.cell && cell.column.columnDef.cell(cell.getContext())}
</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <ProductModal
            initial={editing || undefined}
            onClose={() => { setIsModalOpen(false); setEditing(null); }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
