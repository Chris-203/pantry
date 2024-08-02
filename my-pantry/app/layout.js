/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";


const inter = Inter({ subsets: ["latin"] });





export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || router.pathname !== "/auth") {
        // Redirect to sign-in page if not authenticated and not already on auth page
        router.push("/auth");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
