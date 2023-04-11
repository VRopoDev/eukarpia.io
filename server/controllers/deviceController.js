import axios from "axios";
import Device from "../models/Device.js";
import IoT from "../models/Iot.js";
import User from "../models/User.js";
import Command from "../models/Command.js";
import dgram from "dgram";

/**
 * (READ OPERATION)
 * Middleware to get all devicess of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllDevices = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const devices = await Device.find({
      organisation: organisation,
    });
    res.status(200).json(devices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get all devices commnunications of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllIoT = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const iot = await IoT.find({
      organisation: organisation,
    })
      .populate("device")
      .lean()
      .exec();
    res.status(200).json(iot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (CREATE OPERATION)
 * Middleware to create a device for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const createDevice = async (req, res) => {
  try {
    const { userId, organisation } = res.locals.user;
    const data = req.body;
    data.organisation = organisation;
    const user = await User.findById(userId);
    data.createdBy = `${user.firstname} ${user.lastname}`;
    const devices = new Device(data);
    const newDevice = await devices.save();
    res.status(200).json({ success: true, newDevice });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a device of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateDevice = async (req, res) => {
  try {
    const { _id } = req.body;
    const data = req.body;
    const updatedDevice = await Device.findByIdAndUpdate(_id, data);

    res.status(200).json({ success: true, updatedDevice });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a device of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteDevice = async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    await IoT.findOneAndDelete({ device: req.params.id });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------IoT Devices Commands------------------------------------ //
/**
 * (READ OPERATION)
 * Middleware to get all devices commands of an organisation.
 * RABAC applied.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllCommands = async (req, res) => {
  try {
    const { organisation, userId } = res.locals.user;
    const user = await User.findById(userId);
    const data = {};
    if (user.role === "standard") {
      data.commands = await Command.find({
        $and: [
          { organisation: organisation },
          {
            access: "standard",
          },
        ],
      })
        .populate("device")
        .lean()
        .exec();
    } else {
      data.commands = await Command.find({
        organisation: organisation,
      })
        .populate("device")
        .lean()
        .exec();
    }

    res.status(200).json(data.commands);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (CREATE OPERATION)
 * Middleware to create a command for device for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const createCommand = async (req, res) => {
  try {
    const { userId, organisation } = res.locals.user;
    const data = req.body;
    data.organisation = organisation;
    const user = await User.findById(userId);
    data.createdBy = `${user.firstname} ${user.lastname}`;
    const command = new Command(data);
    const newCommand = await command.save();
    res.status(200).json({ success: true, newCommand });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (READ OPERATION)
 * Middleware to sednd command to a device of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const sendCommand = async (req, res) => {
  try {
    const command = await Command.findById(req.params.id)
      .populate("device")
      .lean()
      .exec();
    // Send the command to a field server to handle
    if (command.server) {
      const data = {};
      data.command = command.content;
      await axios
        .post(command.server, data)
        .then((response) => {
          console.log(`HTTP response status code: ${response.status}`);
        })
        .catch((error) => {
          console.error(`Error sending HTTP request: ${error}`);
        });
    }

    // Send the command to a device within the network with UDP.
    if (command.port) {
      const udpClient = dgram.createSocket("udp4"); // create UDP socket
      // send the command to the UDP IoT device
      udpClient.send(
        command.content,
        0,
        command.content.length,
        command.port,
        command.device.ipaddress,
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Command Send to local device with UDP`);
          }
          udpClient.close(); // close the socket after sending the command
        }
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a command for a device of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateCommand = async (req, res) => {
  try {
    const { _id } = req.body;
    const data = req.body;
    const updatedCommand = await Command.findByIdAndUpdate(_id, data);

    res.status(200).json({ success: true, updatedCommand });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a command for a device of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteCommand = async (req, res) => {
  try {
    await Command.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
