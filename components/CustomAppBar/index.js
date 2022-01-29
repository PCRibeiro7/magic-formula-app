import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import styles from "../../styles/CustomAppBar.module.css";
import { useRouter } from "next/router";

const pages = [
  {
    path: "",
    label: "Home",
  },
  {
    path: "magic_formula",
    label: "Fórmula Mágica",
  },
  {
    path: "graham_wallet",
    label: "Graham",
  },
  {
    path: "about",
    label: "Sobre",
  },
];

export default function CustomAppBar() {
  const router = useRouter();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {pages.map((page) => (
            <Link href={`/${page.path}`} key={`link-app-bar-${page.path}`}>
              <a
                className={
                  router.pathname === `/${page.path}`
                    ? styles.linkActive
                    : styles.link
                }
              >
                {page.label}
              </a>
            </Link>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
