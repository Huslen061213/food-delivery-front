const CART_KEY = "nomnom_cart_items";
const ORDER_KEY = "nomnom_admin_orders";
const CHECKOUT_KEY = "nomnom_checkout_info";
const CART_EVENT = "nomnom-cart-updated";
const ORDER_EVENT = "nomnom-orders-updated";
const CHECKOUT_EVENT = "nomnom-checkout-updated";

const canUseWindow = () => typeof window !== "undefined";

const readJson = (key, fallback) => {
  if (!canUseWindow()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const readObject = (key, fallback) => {
  if (!canUseWindow()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!canUseWindow()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const emitEvent = (name) => {
  if (!canUseWindow()) return;
  window.dispatchEvent(new Event(name));
};

export const getCartItems = () => readJson(CART_KEY, []);

export const getCartCount = () =>
  getCartItems().reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export const addDishToCart = (dish) => {
  const current = getCartItems();
  const dishId = dish?._id || `${dish?.name}-${dish?.price}`;
  const index = current.findIndex((item) => item._id === dishId);

  if (index >= 0) {
    current[index] = {
      ...current[index],
      quantity: Number(current[index].quantity || 0) + 1,
    };
  } else {
    current.push({
      _id: dishId,
      name: dish?.name || "Unnamed dish",
      price: Number(dish?.price) || 0,
      image: dish?.image || "",
      quantity: 1,
    });
  }

  writeJson(CART_KEY, current);
  emitEvent(CART_EVENT);
  return current;
};

export const getAdminOrders = () => readJson(ORDER_KEY, []);

export const updateCartItemQuantity = (dishId, nextQuantity) => {
  const current = getCartItems();
  const qty = Number(nextQuantity);

  const updated =
    qty <= 0
      ? current.filter((item) => item._id !== dishId)
      : current.map((item) =>
          item._id === dishId ? { ...item, quantity: qty } : item
        );

  writeJson(CART_KEY, updated);
  emitEvent(CART_EVENT);
  return updated;
};

export const clearCart = () => {
  writeJson(CART_KEY, []);
  emitEvent(CART_EVENT);
};

export const getCheckoutInfo = () => {
  if (!canUseWindow()) return { email: "", address: "" };

  try {
    const parsed = readObject(CHECKOUT_KEY, {});
    return {
      email: String(parsed?.email || window.localStorage.getItem("nomnom_user_email") || ""),
      address: String(parsed?.address || ""),
    };
  } catch {
    return {
      email: String(window.localStorage.getItem("nomnom_user_email") || ""),
      address: "",
    };
  }
};

export const setCheckoutInfo = ({ email, address }) => {
  const next = {
    email: String(email || ""),
    address: String(address || ""),
  };
  writeJson(CHECKOUT_KEY, next);
  if (canUseWindow() && next.email) {
    window.localStorage.setItem("nomnom_user_email", next.email);
  }
  emitEvent(CHECKOUT_EVENT);
  return next;
};

export const placeOrderFromCart = ({ email, address }) => {
  const cartItems = getCartItems();
  if (!cartItems.length) {
    return { ok: false, message: "Cart is empty" };
  }

  const safeEmail = String(email || "").trim();
  const safeAddress = String(address || "").trim();

  if (!safeEmail) {
    return { ok: false, message: "Email is required" };
  }

  if (!safeAddress) {
    return { ok: false, message: "Delivery address is required" };
  }

  const orders = getAdminOrders();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const itemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  orders.unshift({
    id: `order-${Date.now()}`,
    selected: false,
    customer: safeEmail,
    food: itemCount === 1 ? cartItems[0]?.name || "1 food" : `${itemCount} foods`,
    date: `${yyyy}/${mm}/${dd}`,
    total: `$${totalPrice.toFixed(2)}`,
    address: safeAddress,
    status: "Pending",
  });

  writeJson(ORDER_KEY, orders);
  emitEvent(ORDER_EVENT);
  // Keep login email, but clear the address input after successful checkout.
  setCheckoutInfo({ email: safeEmail, address: "" });
  clearCart();
  return { ok: true };
};

export const subscribeOrderCartStore = (callback) => {
  if (!canUseWindow()) return () => {};

  const handler = () => callback();
  const storageHandler = (event) => {
    if (
      event.key === CART_KEY ||
      event.key === ORDER_KEY ||
      event.key === CHECKOUT_KEY ||
      event.key === "nomnom_user_email"
    ) {
      callback();
    }
  };

  window.addEventListener(CART_EVENT, handler);
  window.addEventListener(ORDER_EVENT, handler);
  window.addEventListener(CHECKOUT_EVENT, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener(ORDER_EVENT, handler);
    window.removeEventListener(CHECKOUT_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
};
