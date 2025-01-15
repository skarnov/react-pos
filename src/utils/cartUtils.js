export const addToCart = (cart, product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      return cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...cart, { ...product, quantity: 1 }];
  };
  
  export const removeFromCart = (cart, productId) => {
    return cart.filter((item) => item.id !== productId);
  };
  
  export const updateQuantity = (cart, productId, quantity) => {
    return cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
  };
  
  export const calculateCartTotal = (cart) => {
    return cart
      .reduce(
        (total, item) =>
          total +
          parseFloat(item.sale_price.replace(/[^0-9.-]+/g, "")) * item.quantity,
        0
      )
      .toFixed(2);
  };
  