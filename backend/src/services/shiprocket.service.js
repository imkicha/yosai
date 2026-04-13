let _token = null;
let _tokenExpiry = null;

const BASE = "https://apiv2.shiprocket.in/v1/external";

const getToken = async () => {
  if (_token && _tokenExpiry > Date.now()) return _token;
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  _token = data.token;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return _token;
};

const headers = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken()}`,
});

export const createShipment = async ({ subOrder, shippingAddress, vendor }) => {
  const h = await headers();
  const res = await fetch(`${BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      order_id: subOrder.subOrderId,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: vendor.shiprocket.pickupLocationName || "Primary",
      billing_customer_name: shippingAddress.name,
      billing_last_name: "",
      billing_address: shippingAddress.street,
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state,
      billing_country: shippingAddress.country || "India",
      billing_email: "",
      billing_phone: shippingAddress.phone,
      shipping_is_billing: 1,
      order_items: subOrder.items.map((i) => ({
        name: i.name,
        sku: i.productId?.toString(),
        units: i.quantity,
        selling_price: i.price,
        discount: 0,
        tax: 0,
        hsn: 0,
      })),
      payment_method: "Prepaid",
      sub_total: subOrder.subtotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    }),
  });
  return res.json();
};

export const checkServiceability = async (pickupPincode, deliveryPincode, weight = 0.5) => {
  const h = await headers();
  const res = await fetch(
    `${BASE}/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=0`,
    { headers: h }
  );
  return res.json();
};

export const assignAWB = async (shipmentId, courierId) => {
  const h = await headers();
  const res = await fetch(`${BASE}/courier/assign/awb`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ shipment_id: [shipmentId], courier_id: courierId }),
  });
  return res.json();
};

export const schedulePickup = async (shipmentId) => {
  const h = await headers();
  const res = await fetch(`${BASE}/courier/generate/pickup`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ shipment_id: [shipmentId] }),
  });
  return res.json();
};

export const createPickupLocation = async (vendorData) => {
  const h = await headers();
  const res = await fetch(`${BASE}/settings/company/addpickup`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      pickup_location: vendorData.brandName.replace(/\s/g, "_"),
      name: vendorData.kyc?.accountHolderName || vendorData.brandName,
      email: vendorData.email,
      phone: vendorData.phone,
      address: vendorData.address?.street,
      address_2: "",
      city: vendorData.address?.city,
      state: vendorData.address?.state,
      country: "India",
      pin_code: vendorData.address?.pincode,
    }),
  });
  return res.json();
};
