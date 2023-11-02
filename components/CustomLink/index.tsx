import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/CustomAppBar.module.css";

export default function CustomLink({
    path,
    label,
    fullWidth,
}: { path?: string; label?: string; fullWidth?: boolean } = {}) {
    const router = useRouter();

    return (
        <Link
            href={`/${path}`}
            key={`link-app-bar-${path}`}
            passHref
            {...(fullWidth ? { style: { width: "100%" } } : {})}
        >
            <p
                className={
                    router.pathname === `/${path}`
                        ? styles.linkActive
                        : styles.link
                }
            >
                {label}
            </p>
        </Link>
    );
}
