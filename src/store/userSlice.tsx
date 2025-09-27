import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  isNew?: boolean;
}

interface UserState {
  list: User[];
}

const initialState: UserState = {
  list: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.unshift({ ...action.payload, isNew: true });
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload, isNew: false };
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
