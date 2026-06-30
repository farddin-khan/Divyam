const BASE_URL = import.meta.env.VITE_SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';
const EMAIL = import.meta.env.VITE_SHIPROCKET_EMAIL;
const PASSWORD = import.meta.env.VITE_SHIPROCKET_PASSWORD;
const STORE_ID = import.meta.env.VITE_SHIPROCKET_STORE_ID;

async function getShiprocketToken() {
  if (!EMAIL || !PASSWORD) {
    console.warn('Shiprocket credentials are not configured.');
    return null;
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!response.ok) {
    console.warn('Failed to authenticate with Shiprocket:', response.statusText);
    return null;
  }

  const data = await response.json();
  return data?.token;
}

export async function sendShiprocketOrder(orderData, customer, cartItems, shipping, totalAmount) {
  if (!EMAIL || !PASSWORD || !STORE_ID) {
    console.warn('Shiprocket env vars missing. Shiprocket order creation skipped.');
    return { status: 'skipped' };
  }

  const token = await getShiprocketToken();
  if (!token) {
    throw new Error('Shiprocket auth failed');
  }

  const orderPayload = {
    order_id: orderData.id.toString(),
    order_date: new Date().toISOString().slice(0, 10),
    channel_id: '1',
    billing_customer_name: `${customer.firstName} ${customer.lastName}`,
    billing_address: customer.address,
    billing_city: customer.city,
    billing_pincode: customer.zip,
    billing_state: customer.state,
    billing_country: 'India',
    billing_email: customer.email,
    billing_phone: customer.phone,
    shipping_is_billing: true,
    order_items: cartItems.map((item) => ({
      name: item.product?.name || 'Item',
      sku: item.product?.sku || item.product_id?.toString() || 'SKU',
      units: item.quantity,
      selling_price: Number(item.product?.price || 0),
    })),
    payment_method: 'Prepaid',
    sub_total: Number(totalAmount - shipping),
    shipping_charges: Number(shipping),
    total_discount: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_amount: Number(totalAmount),
    shipping_method: 'Standard',
    shipment_type: 'AIR',
    weight: Number(
      cartItems.reduce(
        (sum, item) => sum + ((item.product?.weight && parseFloat(item.product.weight)) || 0) * item.quantity,
        0,
      ),
    ) || 0.5,
    store_id: STORE_ID,
  };

  const response = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shiprocket order creation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    shiprocketOrderId: data?.order_id || data?.data?.order_id,
    status: data?.status || 'created',
  };
}
