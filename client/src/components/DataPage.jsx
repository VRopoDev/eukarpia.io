import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import Form from "components/Form";

const DataPage = ({
  title,
  subtitle,
  initialValues,
  validation,
  data,
  columns,
  isLoading,
  isShowForm,
  submitFunc,
  cancelForm,
  formMessage = "",
  serverList = false,
  rowCount,
  page,
  pageSize,
  setPage,
  setPageSize,
  setSort,
  searchInput,
  setSearchInput,
  setSearch,
}) => {
  const theme = useTheme();
  return (
    <Box m="1.5rem 2.5rem">
      <Header title={title} />
      <Button
        onClick={cancelForm}
        sx={{
          m: "2rem 0",
          p: "1rem",
          backgroundColor: theme.palette.secondary[400],
          color: theme.palette.background.alt,
          "&:hover": { color: theme.palette.secondary[400] },
        }}
      >
        {isShowForm ? "Cancel" : "Add New"}
      </Button>
      {isShowForm && (
        <>
          <pre sx={{ "font-family": "Roboto, sans-serif" }}>{formMessage}</pre>
          <Form
            initialValues={initialValues}
            validationSchema={validation}
            handleFormSubmit={submitFunc}
          />
        </>
      )}

      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <Header title="" subtitle={subtitle} />
        {serverList ? (
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={columns}
            rowCount={rowCount || 0}
            rowsPerPageOptions={[20, 50, 100]}
            pagination
            page={page}
            pageSize={pageSize}
            paginationMode="server"
            sortingMode="server"
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onSortModelChange={(newSortModel) => setSort(...newSortModel)}
            components={{ Toolbar: DataGridCustomToolbar }}
            componentsProps={{
              toolbar: { searchInput, setSearchInput, setSearch },
            }}
          />
        ) : (
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default DataPage;
