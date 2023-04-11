import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import {
  useGetOrganisationQuery,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
} from "state/api";
import { Formik } from "formik";
import * as yup from "yup";

const orgSchema = yup.object().shape({
  orgName: yup.string().min(3),
});

const Organisation = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { data } = useGetOrganisationQuery(token);

  const [updateOrg] = useUpdateOrganisationMutation();
  const [deleteOrg] = useDeleteOrganisationMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValues] = useState({
    orgName: data?.orgName || "",
    weatherapi: data?.weatherapi || "",
    apikey: data?.apikey || "",
  });

  const handleFormSubmit = async (values) => {
    const { data } = await updateOrg({
      body: JSON.stringify(values),
      token,
    });
    if (data.success) {
      setInitialValues({
        orgName: data.updatedOrganisation.orgName || "",
        weatherapi: data.updatedOrganisation.weatherapi || "",
        apikey: data?.apikey || "",
      });
      setIsEdit(false);
      setIsSnackOpen(true);
      setSnackMessage({
        type: "success",
        message: "Organisation has been updated",
      });
    } else {
      setIsSnackOpen(true);
      setSnackMessage({ type: "error", message: "Something went wrong" });
    }
    return;
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `This action will delete all data and users of your organisation. 
        Are you sure you wish to continue?`
      )
    ) {
      const { data } = await deleteOrg(token);
      if (data.success) {
        dispatch(
          setLogout({
            user: data.user,
            token: token,
          })
        );
        navigate("/login");
      } else {
        setIsSnackOpen(true);
        setSnackMessage({ type: "error", message: "Something went wrong" });
      }
    }
    return;
  };

  return (
    <Box>
      <Box width="100%" p="1rem" textAlign="center">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={orgSchema}
        >
          {({
            values = { initialValues },
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  disabled={!isEdit}
                  label="Organisation Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.orgName || ""}
                  name="orgName"
                  error={Boolean(touched.orgName) && Boolean(errors.orgName)}
                  helperText={touched.orgName && errors.orgName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled={!isEdit}
                  label="Weather API"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.weatherapi || ""}
                  name="weatherapi"
                  error={
                    Boolean(touched.weatherapi) && Boolean(errors.weatherapi)
                  }
                  helperText={touched.weatherapi && errors.weatherapi}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled={!isEdit}
                  label="Weather API Key"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.apikey || ""}
                  name="apikey"
                  error={Boolean(touched.apikey) && Boolean(errors.apikey)}
                  helperText={touched.apikey && errors.apikey}
                  sx={{ gridColumn: "span 2" }}
                />
                <Button
                  type="submit"
                  sx={{
                    display: !isEdit ? "none" : "",
                    backgroundColor: palette.primary[100],
                    color: palette.background.alt,
                    width: "20%",
                    "&:hover": { color: palette.secondary[400] },
                  }}
                >
                  Save
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <Button
        onClick={() => {
          setIsEdit(!isEdit);
        }}
        sx={{
          backgroundColor: palette.primary[100],
          color: palette.background.alt,
          margin: "1em",
          "&:hover": { color: palette.secondary[400] },
        }}
      >
        {isEdit ? "Cancel" : "Edit"}
      </Button>
      <Button
        onClick={() => {
          handleDelete();
        }}
        sx={{
          backgroundColor: palette.primary[100],
          color: palette.background.alt,
          "&:hover": { color: palette.secondary[400] },
        }}
      >
        Delete
      </Button>
    </Box>
  );
};

export default Organisation;
