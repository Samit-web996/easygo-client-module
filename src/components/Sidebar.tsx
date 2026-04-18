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
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

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
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true); // Confirmation box dikhao
  };

  // 3. Asli Logout function (Confirm hone par)
  const confirmLogout = () => {
    localStorage.clear();
    setLogoutDialogOpen(false);
    setOpen(false); // Sidebar band
    window.location.reload(); // Page refresh
  };

  return (
    <>
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
              <Link
                href={item.path}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
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

        <Box sx={{ p: 1, borderTop: "1px solid #eee" }}>
          <ListItemButton
            onClick={handleLogoutClick} // 👈 Dialog open karega
            sx={{
              mx: 1,
              borderRadius: "10px",
              color: "#ef4444",
              "&:hover": { backgroundColor: "#fef2f2" },
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: 35 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "14px", fontWeight: 600 }}
            />
          </ListItemButton>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: "1px solid #eee", mt: "auto" }}>
          <p style={{ fontSize: "12px", color: "#999" }}>© 2026 EasyGo</p>
        </Box>
      </Box>
    </Drawer>

    <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ fontWeight: "bold" }}>
          Ready to leave?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Don&apos;t worry, we&apos;ll keep your car ready for next time!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setLogoutDialogOpen(false)} 
            sx={{ color: "#666", fontWeight: "600" }}
          >
            Stay
          </Button>
          <Button 
            onClick={confirmLogout} 
            variant="contained" 
            sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, borderRadius: "8px", px: 3 }}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

export default TemporaryDrawer;
