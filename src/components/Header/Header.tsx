import React from "react";
import styles from "./Header.module.css";
import LogoSvg from "../../../public/logo.svg";

const Header = () => {
  return (
    <div className={styles.Header}>
      <LogoSvg className={styles.logo} />
      <h1>Application Portal</h1>
    </div>
  );
};

export default Header;
