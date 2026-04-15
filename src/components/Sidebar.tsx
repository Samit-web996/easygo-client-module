import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "next/link";

type DrawerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type MenuItem = {
  text: string;
  icon: React.ReactNode;
  path: string;
};

const menuItems: MenuItem[] = [
  { text: "Car Rental", icon: <DirectionsCarIcon />, path: "/car-rental" },
  { text: "My Trips", icon: <TravelExploreIcon />, path: "/my-trips" },
  { text: "Favourite Cars", icon: <FavoriteIcon />, path: "/favourites" },
  { text: "EasyGo Host", icon: <StorefrontIcon />, path: "/easygo-host" },
];

const TemporaryDrawer: React.FC<DrawerProps> = ({ open, setOpen }) => {
  
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Drawer
      open={open}
      onClose={toggleDrawer(false)}
      transitionDuration={400}
      PaperProps={{
        sx: {
          width: 260,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
        }}
      >
        {/* Top Logo */}
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <h2 style={{ color: "#f97316", fontWeight: "bold" }}>EasyGo</h2>
        </Box>

        {/* 🔥 Menu */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Link href={item.path} style={{ width: "100%", textDecoration: "none", color: "inherit" }}>
              <ListItemButton
               onClick={() => setOpen(false)}
                sx={{
                  mx: 1,
                  borderRadius: "10px",
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "#fff7ed",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#f97316", minWidth: 35 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box  sx={{ p: 2, borderTop: "1px solid #eee", mt: "auto" }}>
          <p style={{ fontSize: "12px", color: "#999" }}>
            © 2026 EasyGo
          </p>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer; 