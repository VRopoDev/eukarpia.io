import dgram from "dgram";
import IoT from "../models/Iot.js";
import Device from "../models/Device.js";

export const createUDPServer = async () => {
  const udpServer = dgram.createSocket("udp4"); // create UDP socket
  try {
    // listen for incoming UDP messages
    udpServer.on("message", async (message) => {
      const hexSTR = Buffer.from(message, "hex").toString("ascii");
      const data = JSON.parse(hexSTR);
      const device = await Device.findOne({ macaddress: data.macaddress })
        .lean()
        .exec();

      if (device) {
        const iot = await IoT.updateOne(
          { device: device._id },
          {
            connection: true,
            organisation: device.organisation,
            comms: JSON.stringify(data),
          },
          { upsert: true }
        );
      }
      return;
    });
    udpServer.bind(1212);
  } catch (err) {
    console.log(err);
  }
};
