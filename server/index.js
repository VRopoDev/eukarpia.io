import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { scheduler } from "./startup/scheduler.js";
import { createUDPServer } from "./startup/udpServer.js";

//import adminRoute from "./routes/adminRoute.js";
import organisationRoute from "./routes/organisationRoute.js";
import userRoute from "./routes/userRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import contactRoute from "./routes/contactRoute.js";
import fieldRoute from "./routes/fieldRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import statRoute from "./routes/statRoute.js";
import deviceRoute from "./routes/deviceRoute.js";
import thirdPartyRoute from "./routes/thirdPartyRoute.js";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyparser.json({ limit: "30mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* ROUTES */

//app.use("/api/admin", adminRoute); // superadmin operation only
app.use("/api/organisation", organisationRoute);
app.use("/api/user", userRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/contact", contactRoute);
app.use("/api/field", fieldRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/stat", statRoute);
app.use("/api/device", deviceRoute);
app.use("/api/third-party", thirdPartyRoute);

// Serve the client build
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
// Connect to database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the server
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    // Create any cron tasks in the scheduler
    if (process.env.ORGID) scheduler();
    const udpServer = createUDPServer();
  })
  .catch((error) => {
    console.log(`${error} Server did not started!`);
  });
