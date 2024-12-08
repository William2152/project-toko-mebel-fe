import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocalStorageState {
  key: string;
  value: string | null;
}

const initialState: LocalStorageState = {
  key: '',
  value: null,
};

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState,
  reducers: {
    setItem: (
      state,
      action: PayloadAction<{ key: string; value: string; ttl: number }>
    ) => {
      const { key, value, ttl } = action.payload;
      const now = new Date();

      const item = {
        value,
        expiry: now.getTime() + ttl, // TTL in milliseconds
      };

      localStorage.setItem(key, JSON.stringify(item));
      state.key = key;
      state.value = value;
    },
    getItem: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const itemStr = localStorage.getItem(key);

      if (!itemStr) {
        state.value = null;
        return;
      }

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        state.value = null;
      } else {
        state.value = item.value;
      }
    },
  },
});

export const { setItem, getItem } = localStorageSlice.actions;

export default localStorageSlice.reducer;
