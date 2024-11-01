import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./styles.module.css";
import clsx from "clsx";
export function MyButton({ primary = false, size = "medium", label, ...props }) {
    const style = clsx(styles.button, {
        [styles["button--primary"]]: primary,
        [styles[`button--${size}`]]: size,
    });
    return (_jsx("button", { type: "button", className: style, ...props, children: label }));
}
