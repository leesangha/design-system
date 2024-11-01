import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./styles.module.css";
import clsx from "clsx";
export function MyTitle({ primary = false, title, ...props }) {
    const style = clsx(styles.title, {
        [styles["title--primary"]]: primary,
    });
    return (_jsx("h1", { className: style, ...props, children: title }));
}
