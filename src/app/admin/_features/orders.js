"use client";
import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

export const Order = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      selected: true,
      customer: "Amgalan",
      food: "2 foods",
      date: "2024/12/20",
      total: "$26.97",
      address: "СБД, 12-р хороо, СБД нэгдсэн эмнэлэг...",
      status: "Pending",
    },
    {
      id: 2,
      selected: true,
      customer: "Test@gmail.com",
      food: "2 foods",
      date: "2024/12/20",
      total: "$26.97",
      address: "СБД, 12-р хороо, СБД нэгдсэн эмнэлэг...",
      status: "Pending",
    },
    {
      id: 3,
      selected: true,
      customer: "Test@gmail.com",
      food: "2 foods",
      date: "2024/12/20",
      total: "$26.97",
      address: "СБД, 12-р хороо, СБД нэгдсэн эмнэлэг...",
      status: "Pending",
    },
    {
      id: 4,
      selected: false,
      customer: "Test@gmail.com",
      food: "2 foods",
      date: "2024/12/20",
      total: "$26.97",
      address: "СБД, 12-р хороо, СБД нэгдсэн эмнэлэг...",
      status: "Delivered",
    },
  ]);

  const toggleSelection = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, selected: !order.selected } : order
      )
    );
  };

  const toggleAll = () => {
    const allSelected = orders.every((o) => o.selected);
    setOrders(orders.map((order) => ({ ...order, selected: !allSelected })));
  };

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-6">Orders Management</h1>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Select All
          </button>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">Select</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Food</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={order.selected}
                      onChange={() => toggleSelection(order.id)}
                    />
                  </td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.food}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3">{order.address}</td>
                  <td className="p-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
