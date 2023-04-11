import React, { useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Login from "scenes/login";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Transactions from "scenes/transactions";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Users from "scenes/users";
import Contacts from "scenes/contacts";
import Fields from "scenes/fields";
import Toast from "components/Toast";
import Organisation from "scenes/organisation";
import Devices from "scenes/devices";
import IoT from "scenes/iot";

function App() {
  const mode = useSelector((state) => state.auth.mode);
  const user = useSelector((state) => state.auth.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState({
    type: "",
    message: "",
  });

  // const AuthWrapper = () => {
  //   return isExpired(localStorage.getItem('token'))
  //     ? <Navigate to="/login" replace />
  //     : <Outlet />
  // };

  return (
    <div className="app">
      <Toast
        isSnackOpen={isSnackOpen}
        setIsSnackOpen={setIsSnackOpen}
        snackMessage={snackMessage}
      />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={
                isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={
                isAuth ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login
                    setIsSnackOpen={setIsSnackOpen}
                    setSnackMessage={setSnackMessage}
                  />
                )
              }
            />
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/home"
                element={
                  isAuth ? <Dashboard /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/fields"
                element={
                  <Fields
                    setIsSnackOpen={setIsSnackOpen}
                    setSnackMessage={setSnackMessage}
                  />
                }
              />
              <Route path="/products" element={<Products />} />
              <Route
                path="/contacts"
                element={
                  <Contacts
                    setIsSnackOpen={setIsSnackOpen}
                    setSnackMessage={setSnackMessage}
                  />
                }
              />
              <Route
                path="/transactions"
                element={
                  <Transactions
                    setIsSnackOpen={setIsSnackOpen}
                    setSnackMessage={setSnackMessage}
                  />
                }
              />
              <Route
                path="/iot"
                element={
                  <IoT
                    setIsSnackOpen={setIsSnackOpen}
                    setSnackMessage={setSnackMessage}
                  />
                }
              />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route
                path="/users"
                element={
                  isAuth && ["admin", "superuser"].includes(user.role) ? (
                    <Users
                      setIsSnackOpen={setIsSnackOpen}
                      setSnackMessage={setSnackMessage}
                    />
                  ) : (
                    <Navigate to="/home" />
                  )
                }
              />

              <Route
                path="/organisation"
                element={
                  isAuth && ["admin", "superuser"].includes(user.role) ? (
                    <Organisation
                      setIsSnackOpen={setIsSnackOpen}
                      setSnackMessage={setSnackMessage}
                    />
                  ) : (
                    <Navigate to="/home" />
                  )
                }
              />
              <Route
                path="/devices"
                element={
                  isAuth && ["admin", "superuser"].includes(user.role) ? (
                    <Devices
                      setIsSnackOpen={setIsSnackOpen}
                      setSnackMessage={setSnackMessage}
                    />
                  ) : (
                    <Navigate to="/home" />
                  )
                }
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
