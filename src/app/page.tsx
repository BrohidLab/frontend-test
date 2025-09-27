"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addUser, setUsers, updateUser } from "../store/userSlice";
import UserCard from "@/components/useCard";
import AddUserForm from "@/components/addUserForm";
import Modal from "@/components/ModalUser";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const limit = 12;
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.users);

  useEffect(() => {
    fetch(`https://dummyjson.com/users?limit=${limit}&skip=${page * limit}`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total);
        dispatch(setUsers(data.users));
      });
  }, [page]);

  const filtered = list.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form: any) => {
    if (editingUser) {
      dispatch(updateUser({ ...editingUser, ...form }));
    } else {
      dispatch(
        addUser({
          id: Date.now(),
          ...form,
          image: "https://via.placeholder.com/100",
        })
      );
    }
    setOpenModal(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-2xl font-bold">User Manager</h1>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
        <input
          className="input w-full px-4 py-2"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setOpenModal(true)}
          className="px-2 py-2 bg-blue-400 text-white shadow hover:brightness-95 w-40"
        >
          + Add User
        </button>
      </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={(u) => {
                setEditingUser(u);
                setOpenModal(true);
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() =>
              setPage((p) => (p + 1 < total / limit ? p + 1 : p))
            }
            disabled={page + 1 >= total / limit}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <Modal open={openModal} onClose={() => setOpenModal(false)} title="Add New User">
          <AddUserForm 
            initialData={editingUser || undefined}
            onSave={handleSave}
          />
        </Modal>
      </main>
    </div>
  );
}
