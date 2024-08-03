/* eslint-disable react/react-in-jsx-scope */
"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState, useMemo, createContext } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faStar as faStarSolid,
  faStar as faStarOutline,
} from "@fortawesome/free-solid-svg-icons";
import { SnackbarProvider, useSnackbar } from "notistack";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { faCamera, faCubesStacked } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firestore, auth } from "@/firebase";
import Footer from "@/app/components/Footer";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#2871a3", //Toolbar color
          },
          divider: blue,
          background: {
            default: "#ffffff", //Background color
            paper: "#2871a3", //Item background color
          },
          text: {
            primary: "#000000",
            secondary: grey[800],
            tertiary: "#b71c1c",
            quaternary: "#ffffff", //Modal background color
          },
        }
      : {
          primary: {
            main: "#800000", //Toolbar color
          },
          divider: blue,
          background: {
            default: "Darkgrey", //Background color
            paper: "#800000", //Item background color
          },
          text: {
            primary: grey[900],
            secondary: "#000000",
            tertiary: "#2871a3",
            quaternary: "#ffffff", //Modal background color
          },
        }),
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "text.quaternary",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function Home() {
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
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState(null);
  const [openM, setOpenM] = useState(false);
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [pressTimer, setPressTimer] = useState(null);
  const [holdingItem, setHoldingItem] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const updatePantry = async (userId) => {
    if (!userId) return;

    const userPantryRef = collection(firestore, `users/${userId}/pantry`);
    const snapshot = query(userPantryRef);
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });

    // Sort pantryList by favorite status first, then by name
    pantryList.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return a.name.localeCompare(b.name);
    });

    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase();
    const filtered = pantry
      .filter((item) => {
        // If the filter is "favorites", only show favorite items
        if (lowercasedFilter === "favorites") {
          return item.favorite;
        }
        // Otherwise, filter by item name
        return item.name.toLowerCase().includes(lowercasedFilter);
      })
      .sort((a, b) => {
        // Sort by favorite status first (favorites first)
        if (a.favorite === b.favorite) {
          // If favorite status is the same, sort by name
          return a.name.localeCompare(b.name);
        }
        return b.favorite - a.favorite; // Favorites come first
      });

    setFilteredPantry(filtered);
  }, [filter, pantry]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updatePantry(user.uid); // Fetch pantry items for the current user
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const { enqueueSnackbar } = useSnackbar();

  const addItem = async (userId, item, qty) => {
    if (!userId) return;

    const itemLower = item.toLowerCase();
    const userPantryRef = collection(firestore, `users/${userId}/pantry`);
    const docRef = doc(userPantryRef, itemLower);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + qty });
    } else {
      await setDoc(docRef, { count: qty });
    }
    await updatePantry(userId);
    enqueueSnackbar(`Success! Added ${item} x${qty} to the pantry`, {
      variant: "success",
    });
  };

  const removeItem = async (userId, item, qty) => {
    if (!userId) return;

    const itemLowerCase = item.toLowerCase();
    const userPantryRef = collection(firestore, `users/${userId}/pantry`);
    const docRef = doc(userPantryRef, itemLowerCase);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count <= qty) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - qty });
      }
    }
    await updatePantry(userId);
    enqueueSnackbar(`Success! Removed ${item} x${qty} from the pantry`, {
      variant: "success",
    });
  };

  const handleAction = () => {
    if (itemName.trim()) {
      addItem(user.uid, itemName.trim(), quantity);
      setItemName("");
      setQuantity(1);
      handleClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAction();
    }
  };

  const handleMouseDown = (itemName) => {
    setHoldingItem(itemName);
    const timer = setTimeout(() => {
      openInfoModal(itemName);
    }, 500);

    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setHoldingItem(null);
  };

  const openInfoModal = (itemName) => {
    setSelectedItem(itemName);
    setInfoOpen(true);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
  };

  const handleInfoAction = (action) => {
    if (action === "add") {
      addItem(user.uid, selectedItem, quantity);
    } else if (action === "remove") {
      removeItem(user.uid, selectedItem, quantity);
    }
    setQuantity(1);
    setInfoOpen(false);
  };

  const handleFavoriteToggle = async (userId, itemName) => {
    if (!userId || !itemName) {
      console.error("User ID or item name is missing");
      return;
    }

    try {
      const itemLowerCase = itemName.toLowerCase();
      const userPantryRef = collection(firestore, `users/${userId}/pantry`);
      const docRef = doc(userPantryRef, itemLowerCase);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const currentFavorite = currentData.favorite || false;
        console.log(
          `Toggling favorite status for ${itemName} to ${!currentFavorite}`
        );
        await setDoc(
          docRef,
          { ...currentData, favorite: !currentFavorite },
          { merge: true }
        );
        await updatePantry(userId);
      } else {
        console.error(`Document for ${itemName} does not exist`);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const glossStyle = {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    borderRadius: "4px",
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme.palette.background.default]);

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  }));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
      console.alert(`Error signing out: ${error.message}`);
    }
  };
  const handleNavigateToScanner = () => {
    router.push("/scanner");
  };
  const handleNavigateToHome = () => {
    router.push("/auth");
  };
  const toggleDrawer = (newOpen) => () => {
    setOpenM(newOpen);
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
        <AppBar position="static">
          <StyledToolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon sx={{ color: theme.palette.text.quaternary }} />
            </IconButton>
            <Drawer open={openM} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              color="#ffffff"
              margin="3px"
            >
              Welcome {user ? user.displayName : ""}
            </Typography>
            <img
              src="/images/logo.png"
              alt="Logo"
              style={{
                maxWidth: "8%",
                height: "auto",
                maxHeight: "30vh",
              }}
            />
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
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                position: "fixed",
                bottom: 36,
                right: 40,
                borderRadius: "50%",
                width: 56,
                height: 56,
                minWidth: 0,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
                aspectRatio: "1 / 1",
                zIndex: 1200,
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ fontSize: "24px", color: "white" }}
              />
            </Button>

            <TextField
              id="filter"
              label="Filter Items"
              variant="standard"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Stack spacing={2}>
              {filteredPantry.map((item) => (
                <Box
                  key={item.name}
                  width="100%"
                  minHeight="100px"
                  paddingX={5}
                  bgcolor={theme.palette.background.paper}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "4px",
                    boxShadow: 1,
                    cursor: "pointer",
                    ...(holdingItem === item.name && glossStyle), // Apply gradient only when holding item
                  }}
                  onMouseDown={() => handleMouseDown(item.name)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp} // Ensure gradient is removed when mouse leaves item
                  onClick={() => handleFavoriteToggle(item.name)}
                >
                  <Typography
                    variant={"h3"}
                    color={theme.palette.text.quaternary}
                    textAlign={"left"}
                    fontSize="24px"
                    flex="1"
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                  <Typography
                    variant={"h3"}
                    fontSize="24px"
                    color={theme.palette.text.quaternary}
                    textAlign={"center"}
                    flex=".1"
                  >
                    {item.count}
                  </Typography>
                  <IconButton
                    onClick={() => handleFavoriteToggle(user.uid, item.name)}
                  >
                    <FontAwesomeIcon
                      icon={item.favorite ? faStarSolid : faStarOutline}
                      style={{
                        cursor: "pointer",
                        color: item.favorite ? "#FFD700" : "#CCCCCC",
                        fontSize: "24px",
                      }}
                    />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6">Add Item</Typography>
            <TextField
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
            />
            <Button variant="contained" onClick={handleAction}>
              Add
            </Button>
          </Box>
        </Modal>

        <Modal open={infoOpen} onClose={handleInfoClose}>
          <Box sx={style}>
            <Typography variant="h6">Manage Item</Typography>
            <Typography>Item: {selectedItem}</Typography>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
            />
            <Button variant="contained" onClick={() => handleInfoAction("add")}>
              Add Quantity
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleInfoAction("remove")}
              // bgcolor= theme.palette.text.primary,
              sx={{ bgcolor: theme.palette.text.tertiary }}
            >
              Remove Quantity
            </Button>
          </Box>
        </Modal>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Home />
      <Footer />
    </SnackbarProvider>
  );
}

export default App;
