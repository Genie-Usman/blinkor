import { DM_Serif_Text, Lato  } from "next/font/google";
import ClientLayout from './clientLayout';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spectral = DM_Serif_Text({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-spectral',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lato',
});

export const metadata = {
  title: "Blinkor - Drip. Blink. Style",
  description: "Blinkor - Drip. Blink. Style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spectral.variable} ${lato.variable}`}
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
