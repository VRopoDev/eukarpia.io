import Device from "../models/Device.js";
import IoT from "../models/Iot.js";

/**
 * (CREATE OPERATION)
 * Middleware to insert a device communication for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const insertIoT = async (req, res) => {
  try {
    const data = req.body;
    const device = await Device.findOne({ macaddress: data.macaddress })
      .lean()
      .exec();
    if (!device) {
      return res.status(400).json({ error: "Device not authorised" });
    }
    const iot = await IoT.updateOne(
      { device: device._id },
      {
        connection: true,
        organisation: device.organisation,
        comms: JSON.stringify(data),
      },
      { upsert: true }
    );
    res.status(200).json({ success: true, iot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
