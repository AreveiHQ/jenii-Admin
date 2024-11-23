'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        const formattedData = res.data.orders.map((order) =>
          order.orders.flatMap((subOrder) =>
            subOrder.items.map((item) => ({
              customerName: order.userId?.name || "N/A",
              itemName: item.productId?.name || "N/A",
              quantity: item.quantity,
              paymentStatus: subOrder.paymentStatus,
              orderId: subOrder.orderId,
              orderStatus: subOrder.orderStatus,
              total: subOrder.total || 0,
              date: subOrder.date || "N/A",
              delivery: subOrder.delivery || "N/A",
              items: subOrder.items.length,
            }))
          )
        ).flat();
        setRowData(formattedData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    setRowData((prevData) =>
      prevData.map((row) =>
        row.orderId === orderId ? { ...row, orderStatus: newStatus } : row
      )
    );
  };

  const columnDefs = [
    { headerName: "Order ID", field: "orderId", flex: 0.5 },
    { headerName: "Date", field: "date", flex: 1 },
    { headerName: "Customer", field: "customerName", flex: 1 },
    { headerName: "Payment", field: "paymentStatus", flex: 1, cellStyle: params => ({color: params.value === 'Success' ? 'green' : 'orange'}) },
    { headerName: "Total", field: "total", flex: 1 },
    { headerName: "Delivery", field: "delivery", flex: 1 },
    { headerName: "Items", field: "items", flex: 0.5 },
    { headerName: "Fulfillment", field: "orderStatus", flex: 1, cellStyle: params => ({ color: params.value === 'Fulfilled' ? 'green' : 'red' }) },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1.5,
      cellRendererFramework: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(params.data.orderId, "Shipped")}
            className="px-2 py-1 text-white bg-blue-500 rounded"
          >
            Shipped
          </button>
          <button
            onClick={() => handleStatusUpdate(params.data.orderId, "Delivered")}
            className="px-2 py-1 text-white bg-green-500 rounded"
          >
            Delivered
          </button>
          <button
            onClick={() => handleStatusUpdate(params.data.orderId, "Canceled")}
            className="px-2 py-1 text-white bg-red-500 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => handleStatusUpdate(params.data.orderId, "Pending")}
            className="px-2 py-1 text-white bg-yellow-500 rounded"
          >
            Pending
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders Dashboard</h1>

      {/* Header Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Orders", value: "21", trend: "+25.2%" },
          { title: "Order Items Over Time", value: "15", trend: "+18.2%" },
          { title: "Returns Orders", value: "0", trend: "-1.2%" },
          { title: "Fulfilled Orders Over Time", value: "12", trend: "+12.2%" },
        ].map((card, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-lg flex flex-col"
          >
            <h2 className="text-gray-500 text-sm">{card.title}</h2>
            <p className="text-2xl font-bold">{card.value}</p>
            <span
              className={`text-sm ${
                card.trend.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {card.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex space-x-4">
        {["All", "Unfulfilled", "Unpaid", "Open", "Closed"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="ag-theme-alpine bg-white shadow-md rounded-lg p-4" style={{ height: 600, width: "100%" }}>
        <AgGridReact
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
}
