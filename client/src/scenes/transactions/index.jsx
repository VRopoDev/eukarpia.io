import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "state/api";
import * as yup from "yup";
import DataPage from "components/DataPage";

const Transactions = ({ setIsSnackOpen, setSnackMessage }) => {
  /* Initialisation of state */
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
    token,
  });
  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    description: "",
    product: "",
    price: 0,
    quantity: 1,
    type: "expense",
  });

  const initialValues = {
    description: "",
    product: "",
    price: 0,
    quantity: 1,
    type: "expense",
  };

  /* Form Validation */
  const validationSchema = yup.object().shape({
    description: yup.string().required("required"),
    product: yup.string().required("required"),
    price: yup.number(),
    quantity: yup.number(),
    type: yup.string().oneOf(["expense", "sale"]).required("required"),
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
      ? "Transaction has been updated"
      : "New transaction has been created";
    if (isEdit) {
      response = await updateTransaction({
        id: values._id,
        body: JSON.stringify(values),
        token,
      });
    } else {
      response = await addTransaction({
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
      field: "price",
      headerName: "Price",
      flex: 0.5,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "Transaction Type",
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
          const transaction = getRow(e);
          if (window.confirm("Do you wish to delete this transaction?")) {
            const { data } = await deleteTransaction({
              id: transaction._id,
              token,
            });
            if (data.success) {
              setIsSnackOpen(true);
              setSnackMessage({
                type: "success",
                message: "Transaction has been deleted",
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
        title="Transactions"
        subtitle="List of transactions"
        initialValues={formValues}
        validation={validationSchema}
        data={data && !isLoading ? data.transactions : []}
        columns={columns}
        isLoading={isLoading}
        isShowForm={isShowForm}
        submitFunc={createOrEdit}
        cancelForm={cancelForm}
        formMessage={"Use a product from your list of products."}
        serverList={true}
        rowCount={data && !isLoading ? data.total : 0}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        setSort={setSort}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearch={setSearch}
      />
    </>
  );
};

export default Transactions;
