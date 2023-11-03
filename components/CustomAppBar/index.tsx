import { MouseEventHandler, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Menu, MenuItem, Typography } from "@mui/material";
import CustomLink from "@/components/CustomLink";
import pages from "../../utils/pages";

export default function CustomAppBar() {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const handleClick: MouseEventHandler = (event) => {
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
                        {pages.map((page) => (
                            <MenuItem
                                onClick={handleClose}
                                key={`menu-item-app-bar-${page.pagePath}`}
                            >
                                <CustomLink
                                    path={page.pagePath}
                                    key={`link-app-bar-${page.pagePath}`}
                                    label={page.title}
                                    fullWidth
                                />
                            </MenuItem>
                        ))}
                    </Menu>
                    <CustomLink
                        path={"favorites"}
                        key={`link-app-bar-${"favorites"}`}
                        label={"Meus Favoritos"}
                    />
                    <CustomLink
                        path={"about"}
                        key={`link-app-bar-${"about"}`}
                        label={"Sobre"}
                    />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
