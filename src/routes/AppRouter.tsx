import CommingSoon from "@/apps/comming-soon/CommingSoon";
import Dashboard from "@/apps/dashboard/Dashboard";
import MainLayout from "@/layout/main-layout/MainLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/apps/auth/login/Login";
import AuthLayout from "@/layout/auth-layout/AuthLayout";
import Test from "@/apps/TestPage/Test";
import ProjectsPage from "@/apps/projects/pages/ProjectsPage";
import ProjectDetails from "@/apps/projects/pages/ProjectDetails/ProjectDetails";
import DocumentQC from "@/apps/dqc/DocumentQC";
import ReportingDashboard from "@/apps/reporting-dashboard/ReportingDashboard";
import IntegrationsPage from "@/apps/Integrations/Pages/IntegrationsPage";
import DataCategory from "@/apps/data-category/pages/DataCategory";
import ModifyDataCategory from "@/apps/data-category/pages/ModifyDataCategory";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth layout - no sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
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
          <Route path="/dashboard/document-qc" element={<DocumentQC />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/projects/project-details"
            element={<ProjectDetails />}
          />
          <Route
            path="/projects/project-details/document-qc"
            element={<DocumentQC />}
          />
          <Route path="/reports" element={<ReportingDashboard />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/data-category" element={<DataCategory />} />
          <Route
            path="/data-category/modify"
            element={<ModifyDataCategory />}
          />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<CommingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
