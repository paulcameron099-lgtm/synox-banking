import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './CounterSlice';
import headerReducer from './HeaderSlice';
// create a type dispatch hook
import { useDispatch } from "react-redux";
// import { Dispatch } from "redux";

// create the redux store

export const store = configureStore({
    reducer: {
        counter: counterReducer, // add the counterslice to the store
        header: headerReducer,
    },
});

// define typescript types

export type RootState = ReturnType<typeof store.getState>; // gets the global state type
export type AppDispatch = typeof store.dispatch; // define the dispatch type
export const useAppDispatch: () => AppDispatch = useDispatch;