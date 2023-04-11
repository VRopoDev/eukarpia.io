import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LoginForm from "components/LoginForm";

const LoginPage = ({ setIsSnackOpen, setSnackMessage }) => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="secondary">
          Eukarpia Platform
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <LoginForm
          setIsSnackOpen={setIsSnackOpen}
          setSnackMessage={setSnackMessage}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
