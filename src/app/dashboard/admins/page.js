"use client"
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, } from "@nextui-org/table";

import {columns, users} from "./data";
import { FaEye } from "react-icons/fa";
import { Edit, Trash } from "iconoir-react";

const statusColorMap = {
  active: "bg-green-100",
  paused: "bg-red-100",
  vacation: "bg-yellow-100",
};

export default function App() {
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
                <div class="align-middle flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white justify-center">
                    <img class="w-10 h-10 rounded-full" src={user.avatar}alt="Jese image"/>
                    <div class="ps-3">
                        <div class="text-base font-semibold">{cellValue}</div>
                        <div class="font-normal text-gray-500">{user.email}</div>
                    </div>  
                </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
          </div>
        );
      case "status":
        return (
                <span class={`${statusColorMap[user.status]} text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}>{cellValue}</span>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Details"> */}
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaEye />
              </span>
            {/* </Tooltip> */}
            {/* <Tooltip content="Edit user"> */}
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit />
              </span>
            {/* </Tooltip> */}
            {/* <Tooltip color="danger" content="Delete user"> */}
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash />
              </span>
            {/* </Tooltip> */}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
  <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="center">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id} >
            {(columnKey) => <TableCell align="center">{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
