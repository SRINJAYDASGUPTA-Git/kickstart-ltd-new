import type { Metadata } from "next";
import { Inter, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable:'--font-inter' });
const montserrat_alternates = Montserrat_Alternates({ subsets: ["latin"], weight: ["400", "700"], variable:'--font-montserrat-alternates'});
export const metadata: Metadata = {
  title: "KickStart",
  description: "Connect. Create. Conquer.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        
        layout: {
          socialButtonsVariant: "iconButton",
        },
        variables:{
          colorPrimary:'#2A86FF',
          colorInputBackground:'#f5f5f5',
          colorInputText:'#191616',
          
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${montserrat_alternates.variable} text-[#f5f5f5]`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
