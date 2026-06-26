'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './POS.module.scss';

interface Product {
  id: string;
  name: string;
  salePrice: number;
  category?: { name: string };
}

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => d.success && setProducts(d.data));
  }, [token]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, qty: 1, price: product.salePrice }];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => i.productId === productId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category?.name || 'Uncategorized')));
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => (p.category?.name || 'Uncategorized') === activeCategory);

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (!selectedPayment) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: cart.map(i => ({ product_id: i.productId, qty: i.qty, price: i.price })),
        payment_method: selectedPayment,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setCart([]);
      setSelectedPayment('');
    }
  };

  return (
    <div className={styles.posLayout}>
      <div className={styles.mainColumn}>
        <div className={styles.categoryBar}>
          <button
            className={`${styles.categoryChip} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryChip} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {filtered.map(product => (
            <button key={product.id} className={styles.productCard} onClick={() => addToCart(product)}>
              <div className={styles.productImagePlaceholder} />
              <span className={styles.productName}>{product.name}</span>
              <span className={styles.productPrice}>${product.salePrice.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cartColumn}>
        <h2 className={styles.cartTitle}>Current Order</h2>
        <div className={styles.cartList}>
          {cart.map(item => (
            <div key={item.productId} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
              </div>
              <div className={styles.qtyControls}>
                <button onClick={() => updateQty(item.productId, -1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.productId, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.paymentColumn}>
        <h2 className={styles.paymentTitle}>Payment</h2>
        <div className={styles.totals}>
          <div className={styles.totalRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <div className={styles.paymentMethods}>
          {['Cash', 'Card', 'QR'].map(method => (
            <button
              key={method}
              className={`${styles.payButton} ${selectedPayment === method ? styles.active : ''}`}
              onClick={() => setSelectedPayment(method)}
            >
              {method}
            </button>
          ))}
        </div>
        <button
          className={styles.actionButton}
          disabled={cart.length === 0 || !selectedPayment}
          onClick={placeOrder}
        >
          {cart.length === 0 ? 'Add Items' : !selectedPayment ? 'Select Payment' : `Charge $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
