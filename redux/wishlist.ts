import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// You can use StaticImageData if you use `next/image` with static imports
interface WishListItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  addedDate: Date;
}

interface InitialState {
  WishList: WishListItem[];
}

const initialState: InitialState = {
  WishList: [],
};

export const WishListSlice = createSlice({
  name: "WishList",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const item = state.WishList.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = (item.quantity ?? 0) + 1;
      } else {
        state.WishList.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.WishList = state.WishList.filter(item => item.id !== action.payload);
    },

    deleteItem: (state, action: PayloadAction<number>) => {
      const item = state.WishList.find((p) => p.id === action.payload);
      if (item && (item.quantity ?? 0) > 1) {
        item.quantity = (item.quantity ?? 0) - 1;
      } else if (item && item.quantity === 1) {
        state.WishList = state.WishList.filter((p) => p.id !== action.payload);
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist, deleteItem } = WishListSlice.actions;
export default WishListSlice.reducer;
