import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/features/store.ts";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import App from "./App.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import Home from "./Home/Home.tsx";
import About from "./About/About.tsx";
import Contact from "./Contact/Contact.tsx";
import Admin from "./Admin/Admin.tsx";
import AdminDashboard from "./Admin/AdminDashboard.tsx";
import UserDashboard from "./User/UserDashboard.tsx";
import Page404 from "./Page404.tsx";
import { Toaster } from "sonner";
import LoginRoute from "./LoginRoute.tsx";
import Users from "./Admin/Users.tsx";
import Profile from "./Admin/Profile.tsx";
import AllBooking from "./Admin/AllBooking.tsx";
import AddFaculties from "./Admin/AddFaculties.tsx";
import AllFaculties from "./Admin/AllFaculties.tsx";
import User from "./User/User.tsx";
import UserBooking from "./User/UserBooking.tsx";
import AllFacultyRoute from "./Home/Facilities/AllFacultyRoute.tsx";
import FacultyDetails from "./Home/Facilities/FacultyDetails.tsx";
import Booking from "./Booking/Booking.tsx";
import BookingDetails from "./User/BookingDetails.tsx";

export type TRole = "admin" | "user";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <App />
      </>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/facilities", element: <AllFacultyRoute /> },
      { path: "/facility/:id", element: <FacultyDetails /> },
      { path: "/booking/:id", element: <Booking /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <Users /> },
      { path: "profile", element: <Profile /> },
      { path: "bookings", element: <AllBooking /> },
      { path: "add-faculties", element: <AddFaculties /> },
      { path: "faculties", element: <AllFaculties /> },
      { path: "booking/:id", element: <BookingDetails /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="user">
        <User />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "bookings", element: <UserBooking /> },
      { path: "booking/:id", element: <BookingDetails /> },
    ],
  },
  { path: "*", element: <Page404 /> },
  { path: "/login", element: <LoginRoute /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <Toaster />
    </Provider>
  </StrictMode>
);
