import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthThunk } from "./states/auth/authThunks";
import { checkEpirationThunk } from "./states/request/requestThunk";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./store";
import MySubscriptions from "./pages/MySubscriptions";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector(
    (state: RootState) => state.auth
  );

  // Check if user is authenticated when app loads
  useEffect(() => {
    dispatch(checkAuthThunk());
    if ( userData ) {
      dispatch(checkEpirationThunk());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <MySubscriptions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
