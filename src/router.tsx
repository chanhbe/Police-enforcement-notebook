import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomeDashboard from "./pages/HomeDashboard";
import BreathDashboard from "./pages/BreathDashboard";
import FinesDashboard from "./pages/FinesDashboard";
import DrugsDashboard from "./pages/DrugsDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true,      element: <HomeDashboard />  },
      { path: "breath",   element: <BreathDashboard /> },
      { path: "fines",    element: <FinesDashboard />  },
      { path: "drugs",    element: <DrugsDashboard />  },
    ],
  },
]);