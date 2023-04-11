import React from "react";
import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Formik } from "formik";

const Form = ({
  validationSchema,
  initialValues,
  handleFormSubmit,
  isSend = false,
}) => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({
        values,
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
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {Object.keys(initialValues).map((key, i) => {
              const displayON = ["_id", "createdBy", "actions"].includes(key)
                ? "none"
                : "";
              return (
                <TextField
                  key={i}
                  label={key}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values[key] || ""}
                  name={key}
                  error={Boolean(touched[key]) && Boolean(errors[key])}
                  helperText={touched[key] && errors[key]}
                  sx={{ gridColumn: "span 4", display: `${displayON}` }}
                />
              );
            })}
          </Box>

          <Box>
            <Button
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.secondary[400],
                color: palette.background.alt,
                "&:hover": { color: palette.secondary[400] },
              }}
            >
              {isSend ? "Send command" : "Save"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
