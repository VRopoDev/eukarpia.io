import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { useGetIoTQuery } from "state/api";
import IoTCommands from "components/IoTCommands";

const IoTStat = ({ iot }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const comms = JSON.parse(iot.comms);
  const keys = Object.keys(comms);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography mb="0.5rem" variant="h5">
          Device: {iot.device.name}
        </Typography>
        <Typography mb="0.5rem" variant="h5">
          MAC Address: {iot.device.macaddress}
        </Typography>
        <Typography mb="0.5rem" variant="h5">
          Connection: {iot.connection.toString()}
        </Typography>
        <Typography mb="0.5rem" variant="h5">
          Lastest connection on: {new Date(iot.updatedAt).toUTCString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          {keys &&
            keys.map((key, index) => (
              <Typography mb="0.5rem" variant="h5" key={index}>
                {key}: {comms[key]}
              </Typography>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const IoT = ({ setIsSnackOpen, setSnackMessage }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetIoTQuery(token);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  return (
    <>
      <IoTCommands
        setIsSnackOpen={setIsSnackOpen}
        setSnackMessage={setSnackMessage}
      />
      <Box m="1.5rem 2.5rem">
        <Header
          title="Connections & Data"
          subtitle="A list of the latest connections from your devices."
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
            {data && data.map((iot) => <IoTStat key={iot._id} iot={iot} />)}
          </Box>
        ) : isLoading ? (
          <>Loading...</>
        ) : (
          <>No connections.</>
        )}
      </Box>
    </>
  );
};

export default IoT;
