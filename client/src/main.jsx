import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import SignInPage from "./routes/signInPage/signInPage";
import SignUpPage from "./routes/signUpPage/signUpPage";
import ExplorePage from "./components/ExplorePage/ExplorePage";
import AnalyzeTeaPage from "./components/AnalyzeTeaPage/AnalyzeTeaPage";
import ManageStatePage from "./components/ManageStatePage/ManageStatePage";
import HarvestPlanPage from "./components/HarvestPlanPage/HarvestPlanPage";
import ContactPage from "./routes/contactpage/ContactPage";

// Import i18n configuration
import './i18n/i18n';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/explore",
        element: <ExplorePage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/manage-state",
            element: <ManageStatePage />,
          },
          {
            path: "/dashboard/analyze-tea",
            element: <AnalyzeTeaPage />,
          },
          {
            path: "/dashboard/harvest-plan",
            element: <HarvestPlanPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);