import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en">
      
      <div className={inter.className}>{children}</div>
      <Footer />
    </main>
  );
}
