import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetFieldsQuery,
  useAddFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
} from "state/api";
import * as yup from "yup";
import DataPage from "components/DataPage";

const Fields = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetFieldsQuery(token);
  const [addField] = useAddFieldMutation();
  const [updateField] = useUpdateFieldMutation();
  const [deleteField] = useDeleteFieldMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    product: "",
    supply: 0,
    latitude: "",
    longitude: "",
    city: "",
    type: "arable",
  });

  const initialValues = {
    name: "",
    description: "",
    product: "",
    supply: 0,
    latitude: "",
    longitude: "",
    city: "",
    type: "arable",
  };

  const details = `To get the accurate location of your field: 
    1. Navigate to Google maps. 
    2. Find your field on the map. 
    3. Right click on the map and select the first option. 
    4. Paste the copied value to the lat and long fields.
    
    For field type paste on of the following:
    1. arable
    2. vineyard
    3. forestry
    4. horticulture
    5. greenhouse
    6. hydroponic
    7. urban

    (More field types are coming soon)
    `;

  /* Form Validation */
  const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    supply: yup.number(),
    latitude: yup.string().required("required"),
    longitude: yup.string().required("required"),
    city: yup.string().required("required"),
    type: yup
      .string()
      .oneOf([
        "arable",
        "vineyard",
        "forestry",
        "horticulture",
        "greenhouse",
        "hydroponic",
        "urban",
      ])
      .required("required"),
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
      ? "Field has been updated"
      : "New field has been created";
    if (isEdit) {
      response = await updateField({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addField({
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
      headerName: "Field Name",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
    },
    {
      field: "product",
      headerName: "Product",
      flex: 0.5,
    },
    {
      field: "supply",
      headerName: "Supply",
      flex: 0.5,
    },
    {
      field: "latitude",
      headerName: "Location (lat)",
      flex: 0.5,
    },
    {
      field: "longitude",
      headerName: "Location (long)",
      flex: 0.5,
    },
    {
      field: "city",
      headerName: "City",
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "Field Type",
      flex: 0.5,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 1,
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
          const field = getRow(e);
          if (window.confirm("Do you wish to delete this field?")) {
            const { data } = await deleteField({
              id: field._id,
              token,
            });
            if (data.success) {
              setIsSnackOpen(true);
              setSnackMessage({
                type: "success",
                message: "Field has been deleted",
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
        title="Fields"
        subtitle="List of Fields"
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
    </>
  );
};

export default Fields;
