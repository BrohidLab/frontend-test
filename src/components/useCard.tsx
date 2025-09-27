import { useAppDispatch } from "../store";
import { deleteUser } from "../store/userSlice";

export default function UserCard({ user, onEdit }: { user: any; onEdit: (u: any) => void }) {
  const dispatch = useAppDispatch();

  return (
    <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between flex-col shadow-sm bg-white">
        <div className="w-full flex flex-row items-center gap-2">
            <img
                src={user.image || "https://via.placeholder.com/100"}
                alt={user.firstName}
                className="w-12 h-12 rounded-full border-gray-300"
            />
            <div>
                <h2 className="font-semibold text-gray-800">
                    {user.firstName} {user.lastName}{" "}
                    {user.isNew && <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded">New</span>}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">{user.phone}</p>
            </div>
        </div>
        <div className="flex mt-4 gap-2">
            <button
                onClick={() => onEdit(user)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit
            </button>
            <button
                onClick={() => dispatch(deleteUser(user.id))}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
                Delete
            </button>
        </div>
    </div>
  );
}
