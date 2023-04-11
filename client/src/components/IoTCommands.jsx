import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { useGetCommandsQuery, useSendCommandMutation } from "state/api";

const Command = ({ command, handleCommand }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[100]}
          gutterBottom
        >
          Name: {command.name}
        </Typography>
        <Typography variant="h5" component="div">
          Description: {command.description}
        </Typography>
        <Typography variant="h5" component="div">
          Device: {command.device?.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => handleCommand(command._id)}
        >
          Send command
        </Button>
      </CardActions>
    </Card>
  );
};

const Commands = ({ setIsSnackOpen, setSnackMessage }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetCommandsQuery(token);
  const [sendCommand] = useSendCommandMutation();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  // function to send command to the device
  const handleCommand = async (id) => {
    if (window.confirm("Do you wish to send this command to the device?")) {
      const { data } = await sendCommand({
        id,
        token,
      });
      if (data && data?.success) {
        setIsSnackOpen(true);
        setSnackMessage({
          type: "success",
          message: "Command has been sent to the device",
        });
      } else {
        setIsSnackOpen(true);
        setSnackMessage({
          type: "error",
          message: "Something went wrong",
        });
      }
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Device Commands"
        subtitle="A list of commands to send to your devices."
      />
      {data ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data &&
            data.map((command) => (
              <Command
                key={command._id}
                command={command}
                handleCommand={handleCommand}
              />
            ))}
        </Box>
      ) : isLoading ? (
        <>Loading...</>
      ) : (
        <>No commands.</>
      )}
    </Box>
  );
};

export default Commands;
