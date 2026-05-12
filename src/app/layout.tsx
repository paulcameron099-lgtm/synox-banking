import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from "@/redux/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synox",
  description: "Online Banking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} >
        <ThemeProvider>
          <SidebarProvider>
            <Providers>{children}</Providers>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
