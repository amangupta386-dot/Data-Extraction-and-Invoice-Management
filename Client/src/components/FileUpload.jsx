import React, { useState } from "react";
import axios from "axios";
import { InvoicePage } from "./InvoicePage";
import { ProductPage } from "./ProductPage";
import { CustomerPage } from "./CustomerPage";
import { CircularProgress, Snackbar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setInvoices } from "../store/slices/invoiceSlice";
import { setProducts } from "../store/slices/productSlice";
import { setCustomers } from "../store/slices/customerSlice";
import { useNavigate } from "react-router-dom";
import RouteNames from "../utils/routesConstant";

const FileUpload = () => {

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleFileUpload = async () => {
    
    if (!file) {
      console.error("No file selected");
      setSnackbar({ open: true, message: "Please select a file before uploading." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      if (file.type === "image/jpeg") {
        
        dispatch(setProducts(response.data.summary)); // Dispatch to products slice
        dispatch(setInvoices(null)); // Clear other states
        dispatch(setCustomers(null));
        navigate(RouteNames.productPage);
      } else if (file.type === "application/pdf") {
        dispatch(setInvoices(response.data.summary)); // Dispatch to invoices slice
        dispatch(setProducts(null));
        dispatch(setCustomers(null));
        navigate(RouteNames.invoicePage);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        dispatch(setCustomers(response.data.summary)); // Dispatch to customers slice
        dispatch(setInvoices(null));
        dispatch(setProducts(null));
        navigate(RouteNames.customerPage);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbar({ open: true, message: "Error uploading file. Please try again later" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        id="file-input"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label htmlFor="file-input">
        <Button variant="contained" component="span" style={{ margin: "10px" }}>
          Choose File
        </Button>
      </label>
      {file && (
        <Typography variant="subtitle1" style={{ margin: "10px", color: "#555" }}>
          Selected File: <b>{file.name}</b> ({file.type})
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleFileUpload}
        style={{ margin: "10px" }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default FileUpload;
