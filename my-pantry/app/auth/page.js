// auth.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Box, Typography } from "@mui/material";
import { auth } from "@/firebase";

const googleProvider = new GoogleAuthProvider();

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.error("Sign In Error",error);
      alert(`Sign In Error: ${error.message}`);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.error("Sign Up Error:", error);
      alert(`Sign Up Error: ${error.message}`);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Button variant="contained" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
      <Typography variant="h6" gutterBottom>
        or
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        // fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        // fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleEmailSignIn}>
        Sign In with Email
      </Button>
      <Button variant="outlined" onClick={handleSignUp} style={{ marginTop: "16px" }}>
        Sign Up
      </Button>
    </Box>
  );
};

export default Auth;