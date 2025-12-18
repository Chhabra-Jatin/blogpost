import { Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import NotFound from "../assets/images/page-not-found.webp";

import { motion } from "framer-motion";

export const PageNotFound = () => {
  useTitle("Page Not Found");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
        <section className="pageNotFound">
        <img src={NotFound} alt="Page Not Found" />
        <Link to="/">
            <button>Back To Home</button>
        </Link>
        </section>
    </motion.section>
  );
};
