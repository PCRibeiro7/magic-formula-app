import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import styles from "styles/CustomAppBar.module.css";
import { Menu, MenuItem, Typography } from "@mui/material";
import CustomLink from "components/CustomLink";

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
            sx={{ cursor: "pointer" }}
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
                path={"carteiras/magic_formula"}
                key={`link-app-bar-${"magic_formula"}`}
                styles={styles}
                label={"Fórmula Mágica"}
              />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <CustomLink
                path={"carteiras/graham_wallet"}
                key={`link-app-bar-${"graham_wallet"}`}
                styles={styles}
                label={"Graham"}
              />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <CustomLink
                path={"carteiras/acquirers_multiple"}
                key={`link-app-bar-${"acquirers_multiple"}`}
                styles={styles}
                label={"Acquirers Multiple + Momentum"}
              />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <CustomLink
                path={"carteiras/decio_basin"}
                key={`link-app-bar-${"decio_basin"}`}
                styles={styles}
                label={"Décio Basin"}
              />
            </MenuItem>
          </Menu>
          <CustomLink
            path={"about"}
            key={`link-app-bar-${"about"}`}
            styles={styles}
            label={"Sobre"}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
