import React, { useEffect, useMemo, useState } from "react";
import useRequireAuth from "../pages/hooks/useRequireAuth";
// NOTE: db, appId, firebaseConfig, and the auth setup are assumed to be handled globally 
// or imported from a shared file like `../lib/firebaseClient`.
// For standalone functionality within the Canvas environment, we must define the initialization.
// Since the original code uses `db` directly, we assume it's imported correctly.
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "../lib/firebaseClient"; // Assuming this path for db import
import { useRouter } from "next/router";
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { LogOut } from 'lucide-react';
import { useLogoutMutation } from "../store/slices/authApi";
import "../pages/products.css"; // The custom CSS for the dark theme

// Placeholder type definitions (assuming Product type is defined elsewhere or locally)
type Product = {
  name: string;
  price: number;
  status: 'active' | 'inactive';
  description: string;
};
type Row = Product & { id: string };

// --- Sub-Components for UI Integrity (replacing forbidden confirm()) ---

interface ModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

const CustomConfirmModal: React.FC<ModalProps> = ({ title, onClose, onConfirm, children }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content glass-box">
                <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
                <p className="text-gray-300 mb-6">{children}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="secondary-btn">Cancel</button>
                    <button onClick={onConfirm} className="primary-btn">Delete</button>
                </div>
            </div>
        </div>
    );
};

interface ProductModalProps {
    initial?: Product & { id?: string };
    onClose: () => void;
    onSave: (data: Product) => Promise<void>;
}

// Minimal ProductModal placeholder to ensure ProductsPage compiles
const ProductModal: React.FC<ProductModalProps> = ({ initial, onClose, onSave }) => {
    const [name, setName] = useState(initial?.name || "");
    const [price, setPrice] = useState(initial?.price || 0);
    const [status, setStatus] = useState(initial?.status || "active");
    const [description, setDescription] = useState(initial?.description || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({ name, price: Number(price), status: status as 'active' | 'inactive', description });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content glass-box max-w-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">{initial ? "Edit Product" : "Add Product"}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        className="login-input" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        className="login-input" 
                        placeholder="Price" 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(Number(e.target.value))} 
                        required 
                    />
                    <select 
                        className="login-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <textarea 
                        className="login-input" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="secondary-btn">Cancel</button>
                        <button type="submit" className="primary-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Products Page Component ---

export default function ProductsPage() {
    useRequireAuth();
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const [products, setProducts] = useState<Row[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Row | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);


    useEffect(() => {
        if (!db) return console.error("Firestore database is not initialized.");
        
        // Define the collection path based on Canvas Security Rules (Private Data)
        // Since `db` is imported, we assume the base configuration (appId/userId) is handled 
        // in the `firebaseClient` or similar setup, and we only need the collection name.
        const colRef = collection(db, "products"); 
        
        const unsub = onSnapshot(colRef, snapshot => {
            const list: Row[] = [];
            snapshot.forEach(docSnap => {
                // Cast to 'any' for data() since we don't strictly control Firestore structure here
                list.push({ id: docSnap.id, ...(docSnap.data() as any) } as Row); 
            });
            setProducts(list);
        }, err => {
            console.error("Firestore Snapshot error:", err);
        });

        return () => unsub();
    }, []); // Removed db dependency assuming it's a stable object

    async function handleSave(data: Product) {
        if (!db) return;
        try {
            if (editing) {
                const dRef = doc(db, "products", editing.id);
                await updateDoc(dRef, { ...data, updatedAt: serverTimestamp() });
                setEditing(null);
            } else {
                await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
            }
        } catch(e) {
            console.error("Error saving product:", e);
        }
        setIsModalOpen(false);
    }

    async function changeStatus(id: string, status: "active" | "inactive") {
        if (!db) return;
        try {
             await updateDoc(doc(db, "products", id), { status });
        } catch (e) {
            console.error("Error changing status:", e);
        }
    }

    // Handlers for the custom confirmation modal
    function handleDeleteRequest(id: string) {
        setProductToDelete(id);
        setIsConfirmModalOpen(true);
    }

    async function handleConfirmDelete() {
        if (productToDelete && db) {
            try {
                await deleteDoc(doc(db, "products", productToDelete));
            } catch(e) {
                 console.error("Error deleting product:", e);
            }
        }
        setIsConfirmModalOpen(false);
        setProductToDelete(null);
    }

    const handleLogout = async () => {
        try {
            await logout();
            // Assuming successful logout, redirect to the entry point
            router.push("/"); 
        } catch (e) {
            console.error("Logout failed:", e);
        }
    }

    const data = useMemo(() => products, [products]);

    const columns = useMemo<ColumnDef<Row, any>[]>(() => [
        { accessorKey: "name", header: "Name", size: 150 },
        { accessorKey: "price", header: "Price", size: 100, cell: info => `$${info.getValue()}` },
        { 
            accessorKey: "status", 
            header: "Status", 
            size: 100,
            cell: info => (
                <span className={`status-badge status-${info.getValue()}`}>{info.getValue()}</span>
            )
        },
        { accessorKey: "description", header: "Description" },
        {
            id: "actions",
            header: "Actions",
            size: 200,
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="flex gap-2">
                        <button onClick={() => { setEditing(rowData); setIsModalOpen(true); }} className="action-btn edit-btn">Edit</button>
                        <button onClick={() => handleDeleteRequest(rowData.id)} className="action-btn delete-btn">Delete</button>
                        <button 
                            onClick={() => changeStatus(rowData.id, rowData.status === "active" ? "inactive" : "active")} 
                            className="action-btn status-toggle-btn"
                        >
                            {rowData.status === "active" ? "Set Inactive" : "Set Active"}
                        </button>
                    </div>
                );
            }
        }
    ], []);

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="products-bg">
            <div className="products-glass-box min-h-full">
                <div className="header-bar">
                    <h1 className="header-title">Product Inventory</h1>
                    <div className="flex items-center gap-3">
                         <button onClick={() => router.push("/analytics")} className="secondary-btn">Analytics</button>
                         <button onClick={() => { setEditing(null); setIsModalOpen(true); }} className="primary-btn">Add Product</button>
                         <button onClick={handleLogout} className="logout-btn" title="Logout">
                            <LogOut className="w-5 h-5" />
                         </button>
                    </div>
                </div>

                <div className="table-container-wrapper">
                    <table className="products-table">
                        <thead className="table-header">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers
                                        .filter(header => !header.isPlaceholder)
                                        .map(header => (
                                            <th 
                                                key={header.id} 
                                                style={{ width: header.getSize() }}
                                                className="table-th"
                                            >
                                                {header.column.columnDef.header}
                                            </th>
                                        ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="table-body">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="table-row">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="table-td">
                                            {cell.column.columnDef.cell && cell.column.columnDef.cell(cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr className="table-row">
                                    <td colSpan={columns.length} className="table-td text-center py-8 text-gray-400">
                                        No products found. Click "Add Product" to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Modals */}
            {isModalOpen && (
                <ProductModal
                    initial={editing || undefined}
                    onClose={() => { setIsModalOpen(false); setEditing(null); }}
                    onSave={handleSave}
                />
            )}
            {isConfirmModalOpen && (
                <CustomConfirmModal
                    title="Confirm Deletion"
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                >
                    Are you sure you want to permanently delete this product? This action cannot be undone.
                </CustomConfirmModal>
            )}
        </div>
    );
}
