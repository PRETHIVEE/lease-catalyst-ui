import CommingSoon from "@/apps/comming-soon/CommingSoon";
import Dashboard from "@/apps/dashboard/Dashboard";
import MainLayout from "@/layout/main-layout/MainLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/apps/auth/login/Login";
import DataCategory from "@/apps/data-category/DataCategory";
import Test from "@/apps/TestPage/Test";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth layout - no sidebar */}
        {/* <Route element={<AuthLayout />}> */}
        <Route path="/login" element={<Login />} />
        {/* </Route> */}
        {/* <Route element={<MainLayout />}> */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-category" element={<DataCategory />} />
          <Route path="/integrations" element={<CommingSoon />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
