import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import styles from "../../styles/CustomAppBar.module.css";

export default function CustomAppBar() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <div>
            <Link href="/">
              <a className={styles.link}>Home</a>
            </Link>
            <Link href="/about" >
              <a className={styles.link}>Sobre</a>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
