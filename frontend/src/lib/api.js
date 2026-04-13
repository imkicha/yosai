import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("yosai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const cartId = localStorage.getItem("yosai_cart_id");
  if (cartId) config.headers["x-cart-id"] = cartId;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("yosai_token");
      window.location.href = "/auth";
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;
