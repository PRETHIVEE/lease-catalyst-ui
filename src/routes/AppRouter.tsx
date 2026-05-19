import Dashboard from "@/apps/dashboard/Dashboard";
import MainLayout from "@/layout/main-layout/MainLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
