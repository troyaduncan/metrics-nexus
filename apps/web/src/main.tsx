import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "./components/AppShell";
import { CatalogPage } from "./features/catalog/CatalogPage";
import { PriorityBuilderPage } from "./features/priority-builder/PriorityBuilderPage";
import { DashboardPage } from "./features/dashboards/DashboardPage";
import { ExportsPage } from "./features/exports/ExportsPage";
import { AdminPage } from "./features/admin/AdminPage";
import { ToastContainer } from "./components/ui/Toast";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/priority" element={<PriorityBuilderPage />} />
            <Route path="/dashboards/:tab" element={<DashboardPage />} />
            <Route path="/exports" element={<ExportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/catalog" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>
);
