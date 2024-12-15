'use client';
import React, { useState, useEffect,useRef, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CsvExportModule, ModuleRegistry,} from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";


const OrdersDashboard = () => {
  const [rowData, setRowData] = useState([]);
  const [count, setCount] = useState(0);
  const gridRef = useRef();
  ModuleRegistry.registerModules([CsvExportModule,ExcelExportModule,]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        console.log(res.data.orders[1].orders);
        const formattedData = res.data.orders
          .map((order) =>
            order.orders.flatMap((subOrder) =>
              subOrder.items.map((item) => ({
                customerName: subOrder.customer.name || "N/A",
                itemName: item.productId?.name || "N/A",
                quantity: item.quantity,
                paymentStatus: subOrder.payment.mode,
                orderId: subOrder.orderID,
                address: subOrder.customer.address,
                orderStatus: subOrder.orderStatus, 
                total: `Rs.${subOrder.items[0].price}/-`,
                date: new Date(subOrder.createdAt).toLocaleDateString("en-GB") || "N/A",
                delivery: subOrder.delivery || "N/A",
                items: subOrder.items[0].quantity,
              }))
            )
          )
          .flat();

        setRowData(formattedData);
       
        setCount(formattedData.length);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (params, newStatus) => {
    const updatedRowData = rowData.map((row) => {
      if (row.orderId === params.data.orderId) {
        return { ...row, orderStatus: newStatus };
      }
      return row;
    });
  
    setRowData(updatedRowData);
  
  
    // axios.put(`/api/orders/${params.data.orderId}`, { orderStatus: newStatus })
    //   .then(() => console.log("Status updated"))
    //   .catch((err) => console.error("Error updating status:", err));
  };

  const onBtExportCsv = useCallback(() => {
    gridRef.current.api.exportDataAsCsv({
     fileName: 'jeniiorders.csv'
    });
  }, []);
  
  

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return { background: "rgb(191, 219, 254)", color: "rgb(37, 99, 235)" };
      case "Delivered":
        return { background: "rgb(187, 247, 208)", color: "rgb(34, 197, 94)" };
      case "Canceled":
        return { background: "rgb(254, 202, 202)", color: "rgb(239, 68, 68)" };
      case "Processing":
        return { background: "rgb(254, 243, 199)", color: "rgb(234, 179, 8)" };
      default:
        return { background: "rgb(229, 231, 235)", color: "rgb(55, 65, 81)" };
    }
  };
  

  const columnDefs = [
    { headerName: "Order ID", field: "orderId", flex: 0.5 },
    { headerName: "Product", field: "itemName", flex: 1 },
    { headerName: "Customer", field: "customerName", flex: 1 },
    { headerName: "Date", field: "date", flex: 1 },
    {
      headerName: "Payment",
      field: "paymentStatus",
      flex: 1,
      cellStyle: (params) => ({
        color: params.value === "Prepaid" ? "green" : "orange",
        backgroundColor: "rgb(187, 247, 208)",
      }),
    },
    { headerName: "Total", field: "total", flex: 1 },
    { headerName: "Address", field: "address", flex: 1.5 },
    { headerName: "Items", field: "items", flex: 0.5 },
    {
      headerName: "Status",
      field: "orderStatus",
      flex: 1,
      cellRenderer: (params) => {
        const statuses = ["Processing", "Shipped", "Delivered", "Canceled"];
        return (
          <select
            value={params.value}
            onChange={(e) => handleStatusChange(params, e.target.value)}
            style={{
              backgroundColor: getStatusColor(params.value).background,
              color: getStatusColor(params.value).color,
              padding:"4px",
              font:"bold"
            }}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          All Products{" "}
          <span className="text-sm p-3 top-3 rounded-xl bg-red-400 text-red-800">
            {count}
          </span>
        </h1>
        <div className="flex gap-2">
          <button className="bg-red-500 text-white py-2 px-4 rounded-md">Filter</button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md"
          onClick={onBtExportCsv}>
            Export to CSV
          </button>
        </div>
      </div>
      <div
        className="ag-theme-alpine bg-white shadow-md rounded-lg p-4"
        style={{ height: 600, width: "100%" }}
      >
        <AgGridReact
        ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default OrdersDashboard;
