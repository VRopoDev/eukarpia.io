import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetCommandsQuery,
  useAddCommandMutation,
  useUpdateCommandMutation,
  useDeleteCommandMutation,
} from "state/api";
import * as yup from "yup";
import DataPage from "components/DataPage";

const DevicesCommands = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetCommandsQuery(token);
  const [addCommand] = useAddCommandMutation();
  const [updateCommand] = useUpdateCommandMutation();
  const [deleteCommand] = useDeleteCommandMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    device: "",
    content: "",
    server: "http://localhost:4000/",
    port: 62792,
    access: "standard",
  });

  const initialValues = {
    name: "",
    description: "",
    device: "",
    content: "",
    server: "http://localhost:4000/",
    port: 62792,
    access: "standard",
  };
  const formatedData = [];

  if (data) {
    data.forEach((d) => {
      formatedData.push({
        _id: d._id,
        name: d.name,
        description: d.description,
        device: d.device._id,
        content: d.content,
        server: d.server,
        port: d.port,
        access: d.access,
        createdBy: d.createdBy,
      });
    });
  }

  const details =
    "Use the _id value of a device to assigne the command to a device. In the access field type admin to restrict standard users from sending the command.";

  /* Form Validation */
  const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    device: yup.string().required("required"),
    content: yup.string().required("required"),
    access: yup.string().oneOf(["standard", "admin"]).required("required"),
  });

  /* Cancel insert or update functionality */
  const cancelForm = () => {
    setIsEdit(false);
    setFormValues(initialValues);
    setIsShowForm(!isShowForm);
  };

  /* Function to handle insert or update  */
  const createOrEditCommand = async (values, onSubmitProps) => {
    let response;
    const message = isEdit
      ? "Command has been updated"
      : "New command has been created";
    if (isEdit) {
      response = await updateCommand({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addCommand({
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
      hide: true,
      editable: false,
      columnVisibilityModel: {
        status: false,
        traderName: false,
      },
    },
    {
      field: "name",
      headerName: "Command Name",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Command description",
      flex: 0.5,
    },
    {
      field: "device",
      headerName: "Assigned to Device",
      flex: 0.5,
    },
    {
      field: "content",
      headerName: "Command content",
      flex: 0.5,
    },
    {
      field: "server",
      headerName: "Local Server",
      flex: 0.5,
    },
    {
      field: "port",
      headerName: "Local Port",
      flex: 0.5,
    },
    {
      field: "access",
      headerName: "User access level",
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
          if (window.confirm("Do you wish to delete this command?")) {
            const { data } = await deleteCommand({
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
        title="Devices Commands"
        subtitle="A list of your saved commands"
        initialValues={formValues}
        validation={validationSchema}
        data={formatedData}
        columns={columns}
        isLoading={isLoading}
        isShowForm={isShowForm}
        submitFunc={createOrEditCommand}
        cancelForm={cancelForm}
        formMessage={details}
      />
    </>
  );
};

export default DevicesCommands;
