import Link from "next/link";
import { useRouter } from "next/router";
import styles from "styles/CustomAppBar.module.css";

export default function CustomLink({ path, label }) {
  const router = useRouter();

  return (
    <Link href={`/${path}`} key={`link-app-bar-${path}`} legacyBehavior>
      <a
        className={
          router.pathname === `/${path}` ? styles.linkActive : styles.link
        }
      >
        {label}
      </a>
    </Link>
  );
}
