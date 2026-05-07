import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuProps {
  variant: "white" | "transparent";
}

 interface Menu {
   id: string;
   label: string;
   submenu?: Menu[];
 }

 const menus: Menu[] = [
   { id: "/", label: "Home" },
   { id: "/checking", label: "Checking" },
   { id: "/savings", label: "Savings" },
   { id: "/contact", label: "Contact" },
 ];

export default function Menu({ variant }: MenuProps) {
  const pathname = usePathname();

  return (
    <div className="gap-10 justify-center items-center hidden lg:flex">
      {menus.map((menu) => (
        <div key={menu.label} className="relative group">
          <Link
            href={menu.id}
            className={`font-medium font-Euclid xl:px-3 py-2 ${
              pathname === menu.id
                ? "text-yellow-500"
                : variant === "white"
                ? "text-white"
                : "text-black"
            } hover:text-yellow-500`}
          >
            {menu.label}
          </Link>
          {menu.submenu && (
            <div className="absolute w-[400px] grid grid-cols-3 top-full left-0 mt-7 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
              {menu.submenu.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={subItem.id}
                  className="block px-5 py-2 text-black hover:text-yellow-500 font-Euclid"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
