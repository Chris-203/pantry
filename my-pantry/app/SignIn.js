import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app'; // Use compat for FirebaseUI
import 'firebase/compat/auth'; // Ensure compat auth is imported
import firebaseui from 'firebaseui'; // Import FirebaseUI
import 'firebaseui/dist/firebaseui.css';
import { auth } from '@/firebase'; // Adjust the path if needed

const SignIn = () => {
  const uiRef = useRef(null); // Use ref to store the AuthUI instance

  useEffect(() => {
    if (uiRef.current) {
      return; // Avoid re-initializing if an instance already exists
    }

    const uiConfig = {
      signInSuccessUrl: '/', // Redirect URL after successful sign-in
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // Add other providers here
      ],
      tosUrl: '<your-tos-url>', // Terms of service URL
      privacyPolicyUrl: '<your-privacy-policy-url>', // Privacy policy URL
    };

    const ui = new firebaseui.auth.AuthUI(auth);
    uiRef.current = ui; // Store the instance in the ref

    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      if (uiRef.current) {
        uiRef.current.delete(); // Clean up the AuthUI instance
        uiRef.current = null;
      }
    };
  }, []);

  return (
    <div id="firebaseui-auth-container"></div>
  );
};

export default SignIn;
