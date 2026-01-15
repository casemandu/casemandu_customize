import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/utils/Navbar";
import Offers from "@/components/utils/Offers";
import {Poppins} from "next/font/google"
import { CartProvider } from "@/context/cartContext";
import Releasing from "@/components/releasing/Releasing";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const PoppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
  weight: "100 900",
})

export const metadata = {
  title: "Customise - Casemandu",
  description: "Customise your own phone case with Casemandu.",
};

const poppins = Poppins({subsets: ["latin"],  weight: '400',})
const released = true


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CartProvider>

        {released && 

      <body
      className={`${poppins.className}   antialiased`}
        >
        <Toaster position="top-right" richColors />
        <Offers/>
        <Navbar />
        {children}
      </body>
     || <body className={`${PoppinsRegular.className} antialiased`}>
          <Releasing/>
          </body>
     }
        </CartProvider>
    </html>
  );
}
