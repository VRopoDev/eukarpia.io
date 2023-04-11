import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "state/api";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as yup from "yup";
import DataPage from "components/DataPage";

const Users = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetUsersQuery(token);
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    role: "standard",
  });

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    role: "standard",
  };

  /* Form Validation */
  const validationSchema = yup.object().shape({
    firstname: yup.string().required("required"),
    lastname: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    role: yup.string().oneOf(["standard", "admin"]).required("required"),
  });

  const cancelForm = () => {
    setIsEdit(false);
    setFormValues(initialValues);
    setIsShowForm(!isShowForm);
  };

  const createOrEditUser = async (values, onSubmitProps) => {
    let response;
    const message = isEdit
      ? "User has been updated"
      : "New user has been created";
    if (isEdit) {
      response = await updateUser({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addUser({
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
      field: "role",
      headerName: "Role",
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
          const user = getRow(e);
          if (data.length === 1) {
            alert("To delete all users and data go to organisation page!");
            return;
          }
          if (window.confirm("Do you wish to delete this user?")) {
            const { data } = await deleteUser({
              id: user._id,
              token,
            });
            if (data.success) {
              setIsSnackOpen(true);
              setSnackMessage({
                type: "success",
                message: "User has been deleted",
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
          row.password = "";
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
        title="Organisation Users"
        subtitle="List of users"
        initialValues={formValues}
        validation={validationSchema}
        data={data}
        columns={columns}
        isLoading={isLoading}
        isShowForm={isShowForm}
        submitFunc={createOrEditUser}
        cancelForm={cancelForm}
      />
    </>
  );
};

export default Users;
