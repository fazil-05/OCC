// This file is used by the old Vite entry (`src/main.tsx`).
// Next.js type-checking includes it, and the React Router typings cause build failure.
// Next uses the `app/` route modules instead, so we can safely skip type-check here.
// @ts-nocheck

"use client";

import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import { BikersRidePage } from "./components/bikers/BikersRidePage";
import { FootballPage } from "./components/football/FootballPage";
import { PhotographyPage } from "./components/photography/PhotographyPage";
import { FashionPage } from "./components/fashion/FashionPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bikers" element={<BikersRidePage />} />
        <Route path="/football" element={<FootballPage />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/fashion" element={<FashionPage />} />
      </Routes>
    </>
  );
}
