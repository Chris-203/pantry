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
} from "@mui/material";
import { firestore } from "@/firebase";
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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, deepOrange, grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#8ed4f4",
          },
          divider: amber[200],
          background: {
            default: "#ac9d9d",
            paper: "#ffffff",
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
            tertiary: "#2871a3", // Add button color
            quaternary: "#ffffff", // Add button text color
          },
        }
      : {
          primary: {
            main: "#800000", // Maroon color
          },
          divider: deepOrange[700],
          background: {
            default: "grey.800",
            paper: "grey",
          },
          text: {
            primary: "#ffffff", // Item text color
            secondary: "#ffffff", // Modal text color
            tertiary: "#2871a3", // Add button color
            quaternary: "#ffffff", // Add button text color
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
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

// Define the ColorModeContext
const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function Home() {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [filter, setFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [pressTimer, setPressTimer] = useState(null);
  const [holdingItem, setHoldingItem] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [removeQuantity, setRemoveQuantity] = useState(1);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    setFilteredPantry(
      pantry.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, pantry]);

  const addItem = async (item, qty) => {
    const itemLower = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), itemLower);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + qty });
    } else {
      await setDoc(docRef, { count: qty });
    }
    await updatePantry();
  };

  const removeItem = async (item, qty) => {
    const itemLowerCase = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), itemLowerCase);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count <= qty) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - qty });
      }
    }
    await updatePantry();
  };

  const handleAction = () => {
    if (itemName.trim()) {
      addItem(itemName.trim(), quantity);
      setItemName("");
      setQuantity(1);
      handleClose();
    }
  };

  // const handleRemoveAction = (item) => {
  //   if (removeQuantity > 0) {
  //     removeItem(item, removeQuantity);
  //     setRemoveQuantity(1);
  //   }
  // };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAction();
    }
  };

  const handleMouseDown = (itemName) => {
    setHoldingItem(itemName); // Set holding state
    const timer = setTimeout(() => {
      openInfoModal(itemName);
    }, 500); // Adjust the duration as needed

    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setHoldingItem(null); // Clear holding state
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
      addItem(selectedItem, quantity);
    } else if (action === "remove") {
      removeItem(selectedItem, quantity);
    }
    setQuantity(1);
    setInfoOpen(false);
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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box
          width="100vw"
          height="100vh"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={2}
          bgcolor={theme.palette.background.default}
        >
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={colorMode.toggleColorMode}
              />
            }
            label={mode === "light" ? "Light Mode" : "Dark Mode"}
            labelPlacement="start"
            sx={{ color: theme.palette.text.primary }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                color={theme.palette.text.tertiary}
              >
                Add Item
              </Typography>
              <Stack width="100%" direction={"row"} spacing={2}>
                <TextField
                  id="standard-basic"
                  label="Item"
                  variant="standard"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <TextField
                  id="standard-basic"
                  label="Quantity"
                  variant="standard"
                  type="number"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                />
                <Button variant="outlined" onClick={handleAction}>
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Modal
            open={infoOpen}
            onClose={handleInfoClose}
            aria-labelledby="item-info-modal-title"
            aria-describedby="item-info-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="item-info-modal-title"
                variant="h6"
                component="h2"
                color={theme.palette.text.tertiary}
              >
                Item Info -{" "}
                {selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)}
              </Typography>
              <Stack width="100%" direction={"row"} spacing={2}>
                <TextField
                  id="info-quantity"
                  label="Quantity"
                  variant="standard"
                  type="number"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleInfoAction("add")}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleInfoAction("remove")}
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Modal>

          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              position: "fixed", // Keeps the button in a fixed position
              bottom: 36, // Distance from the bottom of the screen
              right: 40, // Distance from the right of the screen
              borderRadius: "50%", // Makes the button round
              width: 56, // Set a fixed width
              height: 56, // Set a fixed height
              minWidth: 0, // Removes default width
              padding: 0, // Removes default padding
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none", // Optional: remove default shadow
              aspectRatio: "1 / 1", // Ensures the button stays round
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ fontSize: "24px", color: "white" }} // Adjust the icon size and color
            />
          </Button>

          <Box border={`1px solid ${theme.palette.divider}`}>
            <Box
              width="800px"
              height="150px"
              bgcolor={theme.palette.primary.main}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection="column"
            >
              <Typography
                variant={"h2"}
                color={theme.palette.text.primary}
                textAlign={"center"}
              >
                Pantry Items
              </Typography>
              <TextField
                id="filter"
                label="Filter Items"
                variant="standard"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ marginBottom: 2 }} // Add margin for spacing
              />
            </Box>
            <Stack width="800px" height="300px" overflow={"auto"}>
              {filteredPantry.map(({ name, count }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="100px"
                  bgcolor={theme.palette.background.paper}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  paddingX={5}
                  onMouseDown={() => handleMouseDown(name)} // Start timer on mouse down
                  onMouseUp={handleMouseUp} // Clear timer on mouse up
                  sx={{
                    ...(holdingItem === name && glossStyle), // Apply gloss style if holding
                  }}
                >
                  <Typography
                    variant={"h3"}
                    color={theme.palette.text.primary}
                    textAlign={"center"}
                    fontSize="24px"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant={"h3"}
                    fontSize="24px"
                    color={theme.palette.text.primary}
                    textAlign={"center"}
                  >
                    qty: {count}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
