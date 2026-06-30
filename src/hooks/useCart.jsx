import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { supabase } from '../lib/supabase.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('cart_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const fetchCart = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('session_id', sessionId);
    if (!error && data) {
      setCartItems(data);
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) fetchCart();
  }, [sessionId, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!sessionId) return;
    const existing = cartItems.find(item => item.product_id === productId);
    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      if (!error) await fetchCart();
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ session_id: sessionId, product_id: productId, quantity });
      if (!error) await fetchCart();
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
    if (!error) await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    if (!error) await fetchCart();
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);
    if (!error) setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
