// /components/CustomAppBar.js

import React, { useMemo, useState, createContext } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCubesStacked } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { blue, grey } from "@mui/material/colors";
import PropTypes from "prop-types";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#2871a3" },
          divider: blue,
          background: { default: "#ffffff", paper: "#2871a3" },
          text: {
            primary: "#000000",
            secondary: grey[800],
            tertiary: "#b71c1c",
            quaternary: "#ffffff",
          },
        }
      : {
          primary: { main: "#800000" },
          divider: blue,
          background: { default: "darkgrey", paper: "#800000" },
          text: {
            primary: grey[900],
            secondary: "#ffffff",
            tertiary: "#2871a3",
            quaternary: "#ffffff",
          },
        }),
  },
});

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: "flex-start",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
}));

const CustomAppBar = () => {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const router = useRouter();
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
      alert(`Error signing out: ${error.message}`);
    }
  };

  const handleNavigateToScanner = () => {
    router.push("/scanner");
  };
  const handleNavigateToHome = () => {
    router.push("/auth");
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Home", "Scan"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={
                text === "Scan"
                  ? handleNavigateToScanner
                  : text === "Home"
                  ? handleNavigateToHome
                  : undefined
              }
            >
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <FontAwesomeIcon icon={faCubesStacked} />
                ) : (
                  <FontAwesomeIcon icon={faCamera} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <ColorModeContext.Provider value={colorMode}>
        <AppBar position="fixed" style={{ width: "100%" }}>
          <StyledToolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon sx={{ color: theme.palette.text.quaternary }} />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              color="#ffffff"
              margin="3px"
            ></Typography>
            <Box sx={{ flexGrow: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={colorMode.toggleColorMode}
                />
              }
              label={mode === "light" ? "Light Mode" : "Dark Mode"}
              labelPlacement="start"
              sx={{ color: theme.palette.text.quaternary }}
            />
            <IconButton
              color="inherit"
              sx={{ color: theme.palette.text.quaternary }}
            >
              <SearchIcon />
            </IconButton>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: theme.palette.text.quaternary, margin: 0.2 }}
            >
              Log Out
            </Button>
          </StyledToolbar>
        </AppBar>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
};
CustomAppBar.propTypes = {
  user: PropTypes.object.isRequired,
};
export default CustomAppBar;
