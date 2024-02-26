import React from "react";
import styles from "../../styles/styles";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.normalFlex}`}>
      {navItems?.map((nav, i) => (
        <div className="flex"  key={i}>
          <Link
            to={nav.url}
            className={`${
              active === i + 1
                ? "text-blue-600 font-[700] px-6 text-md py-3"
                : "text-black 800px:text-white font-[700] text-md px-6 cursor-pointer hover:text-blue-700 transition-all py-3"
            }`}
          >
            {nav.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
