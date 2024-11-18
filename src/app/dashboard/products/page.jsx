"use client"
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import { fetchProducts } from "../services/api";

const ProductTable = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchProducts();
        setRowData(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    {
      headerName: "Product",
      field: "name",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={params.data.image}
            alt={params.data.name}
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          {params.data.name}
        </div>
      ),
    },
    { headerName: "Category", field: "category", sortable: true, filter: true },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <span
          style={{
            color: params.value === "In Stock" ? "green" : params.value === "Coming Soon" ? "orange" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    { headerName: "Stock", field: "stock", sortable: true, filter: true },
    { headerName: "Price ($)", field: "price", sortable: true, filter: true },
    {
      headerName: "Action",
      field: "id",
      cellRenderer: () => (
        <div>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "blue",
            }}
          >
            ✏️
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>
      <div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            defaultColDef={{
              sortable: true,
              filter: true,
              flex: 1,
            }}
            rowSelection="multiple"
          />
        )}
      </div>
    </div>
  );
};

export default ProductTable;
