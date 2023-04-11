import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import ForestIcon from "@mui/icons-material/Forest";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Agri Management",
    icon: null,
  },
  {
    text: "Fields",
    icon: <ForestIcon />,
  },
  {
    text: "Products",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Contacts",
    icon: <Groups2Outlined />,
  },
  {
    text: "Transactions",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "IoT",
    icon: <MonitorHeartOutlinedIcon />,
  },
  {
    text: "Analytics",
    icon: null,
  },
  {
    text: "Overview",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Daily",
    icon: <TodayOutlined />,
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
  },
  {
    text: "Organisation Admin",
    icon: null,
  },
  {
    text: "Devices",
    icon: <SettingsInputComponentIcon />,
  },
  {
    text: "Users",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "Organisation",
    icon: <LanguageIcon />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="0.5rem 0.5rem 0.5rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.3rem">
                  <Typography variant="h4" fontWeight="bold">
                    EUKARPIA
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (
                  [
                    "users",
                    "devices",
                    "organisation admin",
                    "organisation",
                  ].includes(text.toLowerCase()) &&
                  user.role === "standard"
                ) {
                  return <></>;
                }
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lowerCaseText = text.toLowerCase();
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`${lowerCaseText}`);
                        setActive(lowerCaseText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lowerCaseText
                            ? theme.palette.secondary[700]
                            : "transparent",
                        color:
                          active === lowerCaseText
                            ? theme.palette.primary[100]
                            : theme.palette.secondary[300],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "1.5rem",
                          color:
                            active === lowerCaseText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lowerCaseText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box bottom="0.1rem">
            <Divider />
            <Box mt="1rem" textAlign="center">
              <Typography
                fontSize="0.8rem"
                sx={{ color: theme.palette.secondary[200] }}
              >
                Organisation: {user.organisationId}
              </Typography>
            </Box>
            <Box mt="1rem" textAlign="center">
              <Typography
                fontSize="0.8rem"
                sx={{ color: theme.palette.secondary[200] }}
              >
                {process.env.REACT_APP_TAG}
              </Typography>
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
