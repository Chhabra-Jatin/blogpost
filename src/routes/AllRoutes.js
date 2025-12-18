import { AnimatePresence } from "framer-motion";

import { Routes, Route, useLocation  } from "react-router-dom";
import { HomePage, CreatePost, PageNotFound } from "../pages";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const AllRoutes = () => {
  const location = useLocation();

  return (
    <main>
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={ <HomePage />} />
                <Route path="create" element={ <ProtectedRoutes><CreatePost /></ProtectedRoutes> } />
                <Route path="*" element={ <PageNotFound /> } />
            </Routes>
        </AnimatePresence>
    </main>
  );
}
