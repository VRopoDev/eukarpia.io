import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetDevicesQuery,
  useAddDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
} from "state/api";
import * as yup from "yup";
import DataPage from "components/DataPage";
import DevicesCommands from "components/DeviceCommands";

const Devices = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetDevicesQuery(token);
  const [addDevice] = useAddDeviceMutation();
  const [updateDevice] = useUpdateDeviceMutation();
  const [deleteDevice] = useDeleteDeviceMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    field: "",
    ipaddress: "",
    macaddress: "",
  });

  const initialValues = {
    name: "",
    description: "",
    field: "",
    ipaddress: "",
    macaddress: "",
  };

  const details =
    "Use the _id value of a field to assigne the device to a field";

  /* Form Validation */
  const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    field: yup.string().required("required"),
    ipaddress: yup.string().required("required"),
    macaddress: yup.string().required("required"),
  });

  /* Cancel insert or update functionality */
  const cancelForm = () => {
    setIsEdit(false);
    setFormValues(initialValues);
    setIsShowForm(!isShowForm);
  };

  /* Function to handle insert or update  */
  const createOrEdit = async (values, onSubmitProps) => {
    let response;
    const message = isEdit
      ? "Device has been updated"
      : "New device has been created";
    if (isEdit) {
      response = await updateDevice({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addDevice({
        body: JSON.stringify(values),
        token,
      });
    }
    const { data } = response;

    if (data.success) {
      onSubmitProps.resetForm();
      setIsSnackOpen(true);
      setSnackMessage({
        type: "success",
        message: message,
      });
    } else {
      setIsSnackOpen(true);
      setSnackMessage({ type: "error", message: "Something went wrong" });
    }
    cancelForm();
    return;
  };

  /* Setting up the columns of the grid */
  const columns = [
    {
      field: "_id",
      headerName: "_id",
      editable: false,
    },
    {
      field: "name",
      headerName: "Device Name",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Device description",
      flex: 0.5,
    },
    {
      field: "field",
      headerName: "Assigned to Field",
      flex: 0.5,
    },
    {
      field: "ipaddress",
      headerName: "Device IP Address",
      flex: 0.5,
    },
    {
      field: "macaddress",
      headerName: "Device MAC Address",
      flex: 0.5,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.5,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const getRow = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.row[c.field]));

          return thisRow;
        };
        const onDelete = async (e) => {
          const device = getRow(e);
          if (window.confirm("Do you wish to delete this device?")) {
            const { data } = await deleteDevice({
              id: device._id,
              token,
            });
            if (data.success) {
              setIsSnackOpen(true);
              setSnackMessage({
                type: "success",
                message: "Device has been deleted",
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

        const onEdit = (e) => {
          const row = getRow(e);
          setIsEdit(true);
          setFormValues(row);
          setIsShowForm(true);
          return;
        };

        return (
          <>
            <Button onClick={onEdit}>
              <EditIcon sx={{ color: theme.palette.primary[100] }} />
            </Button>
            <Button
              onClick={onDelete}
              sx={{ color: theme.palette.primary[100] }}
            >
              <DeleteIcon sx={{ color: theme.palette.primary[100] }} />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <DataPage
        title="IoT Devices"
        subtitle="List of all your IoT devices"
        initialValues={formValues}
        validation={validationSchema}
        data={data}
        columns={columns}
        isLoading={isLoading}
        isShowForm={isShowForm}
        submitFunc={createOrEdit}
        cancelForm={cancelForm}
        formMessage={details}
      />
      <br />
      <hr />
      <DevicesCommands
        setIsSnackOpen={setIsSnackOpen}
        setSnackMessage={setSnackMessage}
      />
    </>
  );
};

export default Devices;
