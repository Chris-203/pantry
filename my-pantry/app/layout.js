/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebaseConfig";

const inter = Inter({ subsets: ["latin"] });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



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
