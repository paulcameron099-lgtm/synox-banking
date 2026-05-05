import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//define the state
interface HeaderState {
  scrolling: boolean;
  test: boolean;
  open: boolean;
  openScrolledMenu: boolean;
}

//set the initial state
const initialState: HeaderState = {
  scrolling: false,
  test: false,
  open: false,
  openScrolledMenu: false,
};

//create the slice
const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setScrolling: (state, action: PayloadAction<boolean>) => {
      state.scrolling = action.payload;
    },
    setTest: (state, action: PayloadAction<boolean>) => {
      state.test = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setOpenScrolledMenu: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

//export the actions
export const { setScrolling, setOpen, setTest, setOpenScrolledMenu} =
  headerSlice.actions;

//export the reducers
export default headerSlice.reducer