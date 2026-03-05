"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminOrders,
  subscribeOrderCartStore,
  updateAdminOrderStatus,
} from "@/lib/orderCartStore";

const STATUS_OPTIONS = ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"];

export const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const syncOrders = () => {
      setOrders(getAdminOrders());
    };

    syncOrders();
    return subscribeOrderCartStore(syncOrders);
  }, []);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const handleStatusChange = (orderId, nextStatus) => {
    const result = updateAdminOrderStatus(orderId, nextStatus);
    if (!result.ok) return;
    setOrders(result.orders || getAdminOrders());
  };

  const renderOrderedItems = (order) => {
    if (!Array.isArray(order.orderedItems) || order.orderedItems.length === 0) {
      return <span className="text-gray-500">{order.food || "No items"}</span>;
    }

    return (
      <div className="space-y-1">
        {order.orderedItems.map((item, index) => (
          <p key={`${order.id}-${item._id || item.name}-${index}`} className="text-xs text-gray-700">
            {item.name} x{item.quantity}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-xl font-bold">Orders Management</h1>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">Customer</th>
                <th className="p-3">Foods</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t align-top">
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{renderOrderedItems(order)}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3 max-w-[280px] break-words">{order.address}</td>
                  <td className="p-3">
                    <select
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm"
                      value={order.status || "Pending"}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!hasOrders && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
