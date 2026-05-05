import React, { ReactNode } from 'react'

interface ModalProp {
    isOpen: boolean; // explicits type for isOpen (boolean);
    Close: () => void; // function type for close handler
    children: ReactNode; // accepts any valid jsx as children
}

export default function Modal({isOpen, Close, children}: ModalProp) {
    if(!isOpen) return null; //don't render if modal is close

  return (
    <div className='bg-white w-1/2 p-4 shadow-lg rounded-lg'>
      <button onClick={Close} className='text-[20px]'>x</button>
      {children}
    </div>
  )
}
