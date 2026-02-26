"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminOrders,
  getCartCount,
  getCartItems,
  placeOrderFromCart,
  setCheckoutInfo,
  subscribeOrderCartStore,
  updateCartItemQuantity,
} from "@/lib/orderCartStore";

const SHIPPING_FEE = 0.99;

export default function Header() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressAlertOpen, setAddressAlertOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [successOrderOpen, setSuccessOrderOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const syncState = () => {
      setCartCount(getCartCount());
      setCartItems(getCartItems());
      setOrderHistory(getAdminOrders());
      const authEmail =
        typeof window !== "undefined"
          ? window.localStorage.getItem("nomnom_user_email") || ""
          : "";
      setEmail(authEmail);
      setAddress((prev) => prev || "");
    };

    syncState();
    return subscribeOrderCartStore(syncState);
  }, []);

  const itemsTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const orderTotal = cartItems.length > 0 ? itemsTotal + SHIPPING_FEE : 0;
  const addressPreview = address.trim() || "Add Location";

  const changeQty = (id, diff) => {
    const current = cartItems.find((item) => item._id === id);
    if (!current) return;
    updateCartItemQuantity(id, Number(current.quantity || 0) + diff);
    setCheckoutSuccess("");
    setCheckoutError("");
  };

  const removeItem = (id) => {
    updateCartItemQuantity(id, 0);
    setCheckoutSuccess("");
    setCheckoutError("");
  };

  const handleSaveCheckoutInfo = () => {
    setCheckoutInfo({ email, address });
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("nomnom_user_email");
      try {
        const checkout = JSON.parse(window.localStorage.getItem("nomnom_checkout_info") || "{}");
        window.localStorage.setItem(
          "nomnom_checkout_info",
          JSON.stringify({ ...checkout, email: "" })
        );
      } catch {
        window.localStorage.setItem(
          "nomnom_checkout_info",
          JSON.stringify({ email: "", address })
        );
      }
    }

    setEmail("");
    setUserMenuOpen(false);
    setLoginAlertOpen(false);
    router.push("/homepage");
  };

  const handleUseCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setCheckoutError("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    setCheckoutError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextAddress = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
        setAddress(nextAddress);
        setCheckoutInfo({ email, address: nextAddress });
        setLocating(false);
      },
      () => {
        setCheckoutError("Location permission denied or unavailable.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCheckout = () => {
    setCheckoutError("");
    setCheckoutSuccess("");

    if (!email.trim()) {
      setLoginAlertOpen(true);
      return;
    }

    if (!address.trim()) {
      setAddressAlertOpen(true);
      return;
    }

    const result = placeOrderFromCart({
      email,
      address,
    });

    if (!result.ok) {
      setCheckoutError(result.message || "Failed to place order.");
      return;
    }

    setCheckoutInfo({ email, address: "" });
    setAddress("");
    setCheckoutSuccess("Order placed successfully.");
    setActiveTab("order");
    setSuccessOrderOpen(true);
  };

  return (
    <header className="relative bg-[#0B0D12] border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-[url(/nomnom.svg)] bg-contain bg-center bg-no-repeat" />
          <div className="leading-none">
            <p className="text-base font-extrabold tracking-tight">
              <span className="text-white">Nom</span>
              <span className="text-red-500">Nom</span>
            </p>
            <p className="text-xs text-white/70">Swift delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddressModalOpen(true)}
            className="flex max-w-[360px] items-center gap-2 rounded-full bg-white px-5 py-3 text-sm"
            title={addressPreview}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">
              <span className="font-medium text-[#EF4444]">Delivery address:</span>{" "}
              <span className="text-[#71717A]">{addressPreview}</span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#71717A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              setCartOpen(true);
              setActiveTab("cart");
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#18181B]"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.7L22 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-red-500 px-1.5 text-center text-[10px] font-bold leading-5 text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white"
            aria-label="Open user menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {userMenuOpen && (
        <div className="absolute right-3 top-20 z-40 w-[280px] rounded-2xl border border-white/10 bg-[#18181B] p-3 shadow-2xl sm:right-6">
          {email.trim() ? (
            <>
              <p className="text-xs text-white/60">Logged in as</p>
              <p className="mt-1 truncate text-sm font-medium text-white">{email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#18181B]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white">You are not logged in</p>
              <p className="mt-1 text-xs text-white/60">
                Log in or sign up to place an order.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/login?next=/homepage");
                  }}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#18181B]"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/signup?next=/homepage");
                  }}
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white"
                >
                  Sign up
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/35">
          <button
            type="button"
            aria-label="Close cart panel overlay"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0"
          />

          <div className="absolute inset-x-0 bottom-0 top-14 sm:inset-x-auto sm:right-3 sm:top-16 sm:w-[500px]">
            <div className="h-full rounded-t-2xl border border-white/10 bg-[#F4F4F5] shadow-2xl sm:h-auto sm:max-h-[82vh] sm:rounded-2xl">
              <div className="flex h-full flex-col p-5">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-[#3F3F46] px-4 py-3.5 text-white">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.7L22 6H6" />
                    </svg>
                    <p className="text-base font-medium">Order detail</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white/80"
                    aria-label="Close cart panel"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 rounded-full bg-white p-1.5 shadow-sm">
                  <div className="grid grid-cols-2 gap-1.5 text-center text-base">
                    <button
                      type="button"
                      onClick={() => setActiveTab("cart")}
                      className={`rounded-full py-2.5 transition ${
                        activeTab === "cart" ? "bg-[#EF4444] text-white" : "text-[#18181B]"
                      }`}
                    >
                      Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("order")}
                      className={`rounded-full py-2.5 transition ${
                        activeTab === "order" ? "bg-[#EF4444] text-white" : "text-[#18181B]"
                      }`}
                    >
                      Order
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pb-2">
                  {activeTab === "cart" ? (
                    <>
                      <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
                        <h3 className="mb-3 text-base font-semibold text-[#71717A]">My cart</h3>

                        {cartItems.length === 0 ? (
                          <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-[#E4E4E7] bg-[#FAFAFA] text-base text-[#A1A1AA]">
                            Your cart is empty
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {cartItems.map((item, index) => (
                              <div
                                key={item._id}
                                className={`pb-4 ${index !== cartItems.length - 1 ? "border-b border-dashed border-[#E4E4E7]" : ""}`}
                              >
                                <div className="flex gap-4">
                                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#E4E4E7]">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : null}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#EF4444]">
                                          {item.name}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-[#71717A]">
                                          Fluffy pancake stacked with fruits, cream, syrup, and
                                          powdered sugar.
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeItem(item._id)}
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FCA5A5] text-sm text-[#EF4444]"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                      <div className="flex items-center gap-5 text-base text-[#18181B]">
                                        <button
                                          type="button"
                                          onClick={() => changeQty(item._id, -1)}
                                          className="px-1"
                                        >
                                          -
                                        </button>
                                        <span className="min-w-4 text-center font-semibold">
                                          {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => changeQty(item._id, 1)}
                                          className="px-1"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <p className="text-base font-semibold text-[#18181B]">
                                        $
                                        {(
                                          Number(item.price || 0) * Number(item.quantity || 0)
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
                        <h3 className="mb-3 text-base font-semibold text-[#71717A]">Payment info</h3>
                        <div className="space-y-2.5 text-sm text-[#71717A]">
                          <div className="flex items-center justify-between">
                            <span>Items</span>
                            <span className="font-semibold text-[#18181B]">
                              ${itemsTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Shipping</span>
                            <span className="font-semibold text-[#18181B]">
                              {cartItems.length > 0 ? `$${SHIPPING_FEE.toFixed(2)}` : "$0.00"}
                            </span>
                          </div>
                          <div className="border-t border-dashed border-[#E4E4E7] pt-2" />
                          <div className="flex items-center justify-between text-base">
                            <span>Total</span>
                            <span className="font-semibold text-[#18181B]">
                              ${orderTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {checkoutError && (
                          <p className="mt-2 text-sm text-red-500">{checkoutError}</p>
                        )}
                        {checkoutSuccess && (
                          <p className="mt-2 text-sm text-green-600">{checkoutSuccess}</p>
                        )}

                        <button
                          type="button"
                          onClick={handleCheckout}
                          disabled={cartItems.length === 0}
                          className="mt-4 w-full rounded-full bg-[#EF4444] px-4 py-3.5 text-base font-medium text-white disabled:opacity-50"
                        >
                          Checkout
                        </button>
                      </section>
                    </>
                  ) : (
                    <>
                      <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
                        <h3 className="mb-3 text-base font-semibold text-[#71717A]">Order history</h3>
                        {orderHistory.length === 0 ? (
                          <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-[#E4E4E7] bg-[#FAFAFA] text-base text-[#A1A1AA]">
                            No order history yet
                          </div>
                        ) : (
                          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                            {orderHistory.map((order) => (
                              <div
                                key={order.id}
                                className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-3.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[#18181B]">
                                      {order.food}
                                    </p>
                                    <p className="truncate text-xs text-[#71717A]">
                                      {order.customer}
                                    </p>
                                    <p className="text-xs text-[#A1A1AA]">{order.date}</p>
                                  </div>
                                  <span
                                    className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                                      order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                  <span className="truncate text-[#71717A]">{order.address}</span>
                                  <span className="font-semibold text-[#18181B]">{order.total}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      <section className="rounded-xl border border-[#E4E4E7] bg-white p-5">
                        <h3 className="mb-3 text-base font-semibold text-[#71717A]">Current delivery</h3>
                        <p className="text-sm text-[#71717A]">Delivery location</p>
                        <p className="mt-1 text-base text-[#18181B]">
                          {address.trim() || "No delivery address yet"}
                        </p>
                      </section>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {addressModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/45 p-4 sm:p-8"
          onClick={() => setAddressModalOpen(false)}
        >
          <div
            className="mx-auto mt-8 w-full max-w-[760px] rounded-[28px] bg-[#F4F4F5] p-6 shadow-2xl sm:mt-12 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <h2 className="max-w-[560px] text-2xl font-semibold leading-tight text-[#09090B] sm:text-[34px]">
                Please write your delivery address!
              </h2>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E4E4E7] text-2xl text-[#52525B] hover:bg-[#D4D4D8]"
                aria-label="Close address modal"
              >
                ✕
              </button>
            </div>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={handleSaveCheckoutInfo}
              rows={5}
              placeholder="Please share your complete address"
              className="min-h-[120px] w-full rounded-xl border border-[#D4D4D8] bg-white px-4 py-3 text-lg text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none"
            />

            <div className="mt-8 flex justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="rounded-xl border border-[#D4D4D8] bg-white px-5 py-3 text-lg text-[#27272A] hover:bg-[#FAFAFA] sm:px-8"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveCheckoutInfo();
                  setAddressModalOpen(false);
                }}
                disabled={!address.trim()}
                className="rounded-xl bg-[#18181B] px-5 py-3 text-lg text-white disabled:opacity-40 sm:px-8"
              >
                Deliver Here
              </button>
            </div>
          </div>
        </div>
      )}

      {loginAlertOpen && (
        <div className="fixed inset-0 z-[70] bg-black/45 p-4">
          <div className="mx-auto mt-28 w-full max-w-[320px] rounded-2xl bg-white p-4 shadow-2xl">
            <p className="text-sm font-semibold text-[#18181B]">You need to log in first</p>
            <p className="mt-1 text-xs text-[#71717A]">
              Please log in to continue checkout and place your order.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setLoginAlertOpen(false);
                  router.push("/login?next=/homepage");
                }}
                className="flex-1 rounded-lg bg-[#18181B] px-3 py-2 text-xs font-medium text-white"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginAlertOpen(false);
                  router.push("/signup?next=/homepage");
                }}
                className="flex-1 rounded-lg border border-[#D4D4D8] bg-white px-3 py-2 text-xs font-medium text-[#18181B]"
              >
                Sign up
              </button>
            </div>

            <button
              type="button"
              onClick={() => setLoginAlertOpen(false)}
              className="mt-2 w-full rounded-lg bg-[#F4F4F5] px-3 py-2 text-xs text-[#52525B]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {addressAlertOpen && (
        <div className="fixed inset-0 z-[75] bg-black/45 p-4">
          <div className="mx-auto mt-28 w-full max-w-[340px] rounded-2xl bg-white p-4 shadow-2xl">
            <p className="text-sm font-semibold text-[#18181B]">
              Delivery address is empty
            </p>
            <p className="mt-1 text-xs text-[#71717A]">
              Please enter your delivery address before checkout.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddressAlertOpen(false);
                  setAddressModalOpen(true);
                }}
                className="flex-1 rounded-lg bg-[#18181B] px-3 py-2 text-xs font-medium text-white"
              >
                Add address
              </button>
              <button
                type="button"
                onClick={() => setAddressAlertOpen(false)}
                className="flex-1 rounded-lg border border-[#D4D4D8] bg-white px-3 py-2 text-xs font-medium text-[#18181B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {successOrderOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/45 p-4"
          onClick={() => setSuccessOrderOpen(false)}
        >
          <div
            className="mx-auto mt-24 w-full max-w-[360px] rounded-2xl bg-white p-5 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-[#18181B]">
              Your order has been successfully placed!
            </p>
            <p className="mt-1 text-xs text-[#71717A]">
              You can check the status in the Order tab.
            </p>

            <button
              type="button"
              onClick={() => setSuccessOrderOpen(false)}
              className="mt-4 w-full rounded-lg bg-[#18181B] px-3 py-2 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
