import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetContactsQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from "state/api";
import * as yup from "yup";
import DataPage from "components/DataPage";

const Contacts = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetContactsQuery(token);
  const [addContact] = useAddContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    company: "",
    connection: "",
    email: "",
    mobile: "",
  });

  const initialValues = {
    firstname: "",
    lastname: "",
    company: "",
    connection: "",
    email: "",
    mobile: "",
  };

  /* Form Validation */
  const validationSchema = yup.object().shape({
    firstname: yup.string().required("required"),
    lastname: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    connection: yup
      .string()
      .oneOf(["worker", "customer", "supplier"])
      .required("required"),
  });

  /* Cancel inser or update functionality */
  const cancelForm = () => {
    setIsEdit(false);
    setFormValues(initialValues);
    setIsShowForm(!isShowForm);
  };

  /* Function to handle insert or update  */
  const createOrEditContact = async (values, onSubmitProps) => {
    let response;
    const message = isEdit
      ? "Contact has been updated"
      : "New contact has been created";
    if (isEdit) {
      response = await updateContact({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addContact({
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
      field: "firstname",
      headerName: "First Name",
      flex: 0.5,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      flex: 0.5,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0.5,
    },
    {
      field: "connection",
      headerName: "Connection Type",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.5,
    },
    {
      field: "mobile",
      headerName: "Mobile Number",
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
          const contact = getRow(e);
          if (window.confirm("Do you wish to delete this contact?")) {
            const { data } = await deleteContact({
              id: contact._id,
              token,
            });
            if (data.success) {
              setIsSnackOpen(true);
              setSnackMessage({
                type: "success",
                message: "Contact has been deleted",
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
        title="Contacts"
        subtitle="List of Contacts"
        initialValues={formValues}
        validation={validationSchema}
        data={data}
        columns={columns}
        isLoading={isLoading}
        isShowForm={isShowForm}
        submitFunc={createOrEditContact}
        cancelForm={cancelForm}
      />
    </>
  );
};

export default Contacts;
