import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from './clientLayout';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevStyle - Code Your Look",
  description: "DevStyle.com - Code Your Look",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
        <Navbar />
        {children}
        <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
