import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import styles from "@/styles/CustomAppBar.module.css";
import { Menu, MenuItem, Typography } from "@mui/material";
import CustomLink from "@/components/CustomLink";
import pages from '../../utils/pages'

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
            {pages.map(page =>
              <MenuItem
                onClick={handleClose}
                key={`menu-item-app-bar-${page.pagePath}`}
              >
                <CustomLink
                  path={page.pagePath}
                  key={`link-app-bar-${page.pagePath}`}
                  styles={styles}
                  label={page.title}
                />
              </MenuItem>
            )}
          </Menu>
          <CustomLink
            path={"favorites"}
            key={`link-app-bar-${"favorites"}`}
            styles={styles}
            label={"Meus Favoritos"}
          />
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