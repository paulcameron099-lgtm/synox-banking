import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// define the state
interface CounterState {
  value: number;
}

// set the initial state
const initialState: CounterState = {
  value: 0,
};

// create the slice
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1; // increased value by one
    },
    decrement: (state) => {
      state.value -= 1; // decreased value by one
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload; // increased by any given number
    },
    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.value -= action.payload // decreased by any given number
    }
  },
});

// export the action

export const { increment, decrement, incrementByAmount, decrementByAmount } = counterSlice.actions;

// export the reducer(IMPORT for the store setup)

export default counterSlice.reducer;
