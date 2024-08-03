"use client";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Button, TextField, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import { firestore, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const checkAuthStatus = async () => {
    const user = auth.currentUser;
    if (user) {
      router.push("/auth"); // Redirect to main page if authenticated
    } else {
      setLoading(false); // Allow user to interact with the authentication page
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/auth");
    } catch (error) {
      console.error("Sign In Error", error);
      alert(`Sign In Error: ${error.message}`);
    }
  };

  // const handleSignUp = async () => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  
  //     // Prompt for the user's full name
  //     const fullName = prompt("Please enter your full name");
  
  //     if (fullName) {
  //       // Update user profile with the full name
  //       await user.updateProfile({ displayName: fullName });
  
  //       // Save user data to Firestore
  //       await setDoc(doc(firestore, `users/${user.uid}`), { name: fullName });
  
  //       router.push("/auth");
  //     } else {
  //       alert("Full name is required!");
  //     }
  //   } catch (error) {
  //     console.error("Sign Up Error:", error);
  //     alert(`Sign Up Error: ${error.message}`);
  //   }
  // };

  const handleSignUpClick = () => {
    setOpenSignUpModal(true);
  };

  const handleSignUpSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Prompt for the user's full name
      const fullName = prompt("Please enter your full name");
  
      if (fullName) {
        // Update user profile with the full name
        await updateProfile(user,{ displayName: fullName });
  
        // Save user data to Firestore
        await setDoc(doc(firestore, `users/${user.uid}`), { name: fullName });
  
        router.push("/auth");
      } else {
        alert("Full name is required!");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      alert(`Sign Up Error: ${error.message}`);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>; // Optional: Display a loading state while checking authentication
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ marginTop: "-50px" }}
      >
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{ height: "30%", width: "20%" }}
        />

        <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
          Sign In
        </Typography>
        <Button variant="contained" onClick={handleGoogleSignIn} sx={{ mb: 2 }}>
          Sign in with Google
        </Button>
        <Typography variant="h6">or</Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" onClick={handleEmailSignIn}>
          Sign In with Email
        </Button>
        <Button
          variant="outlined"
          onClick={handleSignUpClick}
          style={{ marginTop: "16px" }}
        >
          Sign Up
        </Button>

        <Dialog open={openSignUpModal} onClose={() => setOpenSignUpModal(false)}>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSignUpModal(false)}>Cancel</Button>
            <Button onClick={handleSignUpSubmit}>Sign Up</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SnackbarProvider>
  );
};

export default Auth;
