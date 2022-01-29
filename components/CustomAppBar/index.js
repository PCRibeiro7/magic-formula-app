import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import styles from "../../styles/CustomAppBar.module.css";
import { Menu, MenuItem, Typography } from "@mui/material";
import CustomLink from "../CustomLink";

export default function CustomAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <CustomLink
            path={""}
            key={`link-app-bar-${""}`}
            styles={styles}
            label={"Home"}
          />
          <Typography
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            mr={3}
          >
            Carteiras
          </Typography>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <CustomLink
                path={"magic_formula"}
                key={`link-app-bar-${"magic_formula"}`}
                styles={styles}
                label={"Fórmula Mágica"}
              />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <CustomLink
                path={"graham_wallet"}
                key={`link-app-bar-${"graham_wallet"}`}
                styles={styles}
                label={"Graham"}
              />
            </MenuItem>
          </Menu>
          <CustomLink
            path={"about"}
            key={`link-app-bar-${"about"}`}
            styles={styles}
            label={"About"}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
