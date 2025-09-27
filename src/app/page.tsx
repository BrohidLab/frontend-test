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
        // setUsers(data.users);
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

// "use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../store";
// import { setUsers, addUser, updateUser } from "../store/userSlice";
// import UserCard from "@/components/useCard";
// import AddUserForm from "@/components/addUserForm";

// export default function Page() {
//   const dispatch = useAppDispatch();
//   const { list: users } = useAppSelector((state) => state.users);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [openModal, setOpenModal] = useState(false);
//   const [editingUser, setEditingUser] = useState<any | null>(null);

//   const limit = 12;

//   useEffect(() => {
//     fetch(`https://dummyjson.com/users?limit=${limit}&skip=${page * limit}`)
//       .then((res) => res.json())
//       .then((data) => {
//         dispatch(setUsers(data.users));
//         setTotal(data.total);
//       });
//   }, [page, dispatch]);

//   const filtered = (users || []).filter(
//     (u) =>
//       u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
//       u.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleSave = (form: any) => {
//     if (editingUser) {
//       dispatch(updateUser({ ...editingUser, ...form }));
//     } else {
//       dispatch(
//         addUser({
//           id: Date.now(),
//           ...form,
//           image: "https://via.placeholder.com/100",
//         })
//       );
//     }
//     setOpenModal(false);
//     setEditingUser(null);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">User Manager</h1>
//         <button
//           onClick={() => {
//             setEditingUser(null);
//             setOpenModal(true);
//           }}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           + Add User
//         </button>
//       </header>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by name or email..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       {/* User list */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filtered.map((user) => (
//           <UserCard
//             key={user.id}
//             user={user}
//             onEdit={(u) => {
//               setEditingUser(u);
//               setOpenModal(true);
//             }}
//           />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center gap-2 mt-6">
//         <button
//           disabled={page === 0}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="px-3 py-1">
//           Page {page + 1} / {Math.ceil(total / limit)}
//         </span>
//         <button
//           disabled={(page + 1) * limit >= total}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Modal */}
//       {openModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
//             <button
//               onClick={() => setOpenModal(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-black"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4">
//               {editingUser ? "Edit User" : "Add User"}
//             </h2>
//             <AddUserForm
//               initialData={editingUser || undefined}
//               onSave={handleSave}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
