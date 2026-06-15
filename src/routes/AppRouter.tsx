import MainLayout from "@/layout/main-layout/MainLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/apps/auth/login/Login";
import AuthLayout from "@/layout/auth-layout/AuthLayout";
import TranslationHome from "@/apps/translation/pages/TranslationHome";
import TranslationReview from "@/apps/translation/pages/TranslationReview";
import EventsPage from "@/apps/events/Pages/EventsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lease-translate" replace />} />

        {/* Auth layout - no sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Login />} />
        </Route>
        {/* MAIN Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<Navigate to="/lease-translate" replace />}
          />
          <Route path="/lease-translate" element={<TranslationHome />} />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/lease-translate/review"
            element={<TranslationReview />}
          />
          <Route path="*" element={<TranslationHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
