
// "use client";
// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, useAppDispatch } from "@/redux/store";
// import {
//   increment,
//   decrement,
//   incrementByAmount,
//   decrementByAmount,
// } from "@/redux/CounterSlice";

// export default function Counter() {
//   const count = useSelector((state: RootState) => state.counter.value);
//   const dispatch = useAppDispatch();

//   return (
//     <div>
//       <h1>Counter: {count}</h1>
//       <div>
//         <button onClick={() => dispatch(increment())}>increment</button>
//         <br />
//         <button onClick={() => dispatch(decrement())}>decrement</button>
//         <br />
//         <button onClick={() => dispatch(incrementByAmount(10))}>
//           incrementByAmount
//         </button>
//         <br />
//         <button onClick={() => dispatch(decrementByAmount(20))}>
//           decrementByAmount
//         </button>
//       </div>
//     </div>
//   );
// }