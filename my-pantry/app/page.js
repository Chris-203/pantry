"use client";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import { firestore, auth } from "@/firebase";
import { updateProfile, sendEmailVerification } from "firebase/auth";
import Footer from "@/app/components/Footer";

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
      if (user.emailVerified) {
        router.push("/auth"); // Redirect to main page if authenticated and email is verified
      } else {
        enqueueSnackbar("Please verify your email address.", {
          variant: "info",
        });
      }
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
      enqueueSnackbar("Google sign-in failed. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        router.push("/auth");
      } else {
        enqueueSnackbar("Please verify your email address.", {
          variant: "info",
        });
        await auth.signOut();
      }
    } catch (error) {
      console.error("Sign In Error", error);
      if (error.code.includes("auth/user-not-found")) {
        enqueueSnackbar("Wrong email. Please check your email address.", {
          variant: "error",
        });
      } else if (error.code.includes("auth/wrong-password")) {
        enqueueSnackbar("Wrong password. Please check your password.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Sign-in failed. Please try again.", {
          variant: "error",
        });
      }
    }
  };

  const handleSignUpClick = () => {
    setOpenSignUpModal(true);
  };

  const handleSignUpSubmit = async () => {
    if (!email) {
      enqueueSnackbar("Email is required.", { variant: "warning" });
      return;
    }
    if (!password) {
      enqueueSnackbar("Password is required.", { variant: "warning" });
      return;
    }
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long.", {
        variant: "warning",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      enqueueSnackbar("Invalid email format.", { variant: "warning" });
      return;
    }
    if (!fullName) {
      enqueueSnackbar("Full name is required.", { variant: "warning" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      await setDoc(doc(firestore, `users/${user.uid}`), { name: fullName });

      enqueueSnackbar(
        "A verification email has been sent. Please verify your email address.",
        { variant: "info" }
      );

      await auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Sign Up Error:", error);
      enqueueSnackbar("Sign-up failed. Please try again.", {
        variant: "error",
      });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
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
        style={{
          maxWidth: "80%",
          height: "auto",
          maxHeight: "30vh",
        }}
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
  );
};

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Auth />
      <Footer />
    </SnackbarProvider>
  );
}

export default App;
