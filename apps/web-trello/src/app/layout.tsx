import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrpcProvider from "@/components/Provider";
import { metaDataConfig } from "../../config/metadat";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";

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

export const metadata: Metadata = {
  title: {
    default: metaDataConfig.name,
    template: `%s | ${metaDataConfig.name}`,
  },
  description: metaDataConfig.description,
  icons: [
    {
      url: "/logo.jpg",
      href: "/logo.jpg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}
      >
        <SessionProvider>
          <TrpcProvider>
            <ToastContainer
              position="bottom-center"
              autoClose={500}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Navbar />
            {children}
          </TrpcProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
