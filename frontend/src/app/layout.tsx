import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {Setup} from "@/components/utils";

import "../styles/globals.css";
import CustomProvider from "../../redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <CustomProvider>
          {/*<Setup/>*/}
          <div>{children}</div>
      </CustomProvider>

      </body>
    </html>
  );
}
