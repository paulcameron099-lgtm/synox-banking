import React from 'react'
import Button from '@/components/ui/button/HeaderButton';
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { RiMenu3Fill } from "react-icons/ri";
import { AppDispatch, RootState } from '@/redux/store';
import { setOpen } from '@/redux/HeaderSlice';
import { useDispatch, useSelector } from "react-redux";

interface Menu {
  id: string;
  label: string;
}

const mobileMenus: Menu[] = [
  { id: "/", label: "Home" },
  { id: "#about", label: "About Us" },
  { id: "#service", label: "Services" },
  { id: "/contact", label: "Contact" },

];

interface Props {
  setOpen: typeof setOpen; // action creator from slice
  dispatch: AppDispatch; //  no need for AnyAction
  variant: "white" | "transparent";
}

export default function MobileMenu({ variant, dispatch}: Props) {
    // const dispatch = useDispatch<AppDispatch>();
    const open = useSelector((state: RootState) => state.header.open)
    
  return (
    <div className="lg:hidden relative z-10 md:mt-0 mt-2">
      {open ? (
        <MdClose
          className={`md:text-[40px] text-[24px] relative z-60 ${
            variant === "white" ? "text-white" : "text-black"
          }`}
          onClick={() => dispatch(setOpen(false))}
        />
      ) : (
        <RiMenu3Fill
          className={`md:text-[40px] text-[24px] relative z-60 ${
            variant === "white" ? "text-white" : "text-black"
          }`}
          onClick={() => dispatch(setOpen(true))}
        />
      )}
      {open && (
        <div
          className="flex justify-start items-start flex-col text-end gap-4 bg-white p-8 
                absolute md:top-10 top-[30px] right-0 mt-4 md:min-w-[400px] z-50 min-w-[300px] rounded-[5px] scale-up-center animate-slide-down"
        >
          {mobileMenus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.id}
              className="font-Euclid font-medium"
            >
              {menu.label}
            </Link>
          ))}
          <Button variant="white" />
        </div>
      )}
    </div>
  );
}
