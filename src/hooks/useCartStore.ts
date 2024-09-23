import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";
import { create } from "zustand";

type CartState = {
  cart: currentCart.Cart;
  // orderCart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  resetCounter: () => void;
  // setOrderCart: (cart: currentCart.Cart) => void;
  // deleteCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  // orderCart: [],
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();

      // const orderCart = { ...cart };
      set({
        cart: cart || [],
        // orderCart: orderCart || [],
        isLoading: false,
        counter: cart?.lineItems.length || 0,
      });
    } catch (err) {
      set((prevState) => ({ ...prevState, isLoading: false }));
    }
  },
  resetCounter: () => {
    set((prevState) => ({ ...prevState, counter: 0 }));
  },
  // setOrderCart: (cart) => {
  //   const orderCart = { ...cart };
  //   // set({ orderCart: orderCart, cart: undefined });
  //   set({ orderCart: orderCart });
  // },
  // deleteCart: async (wixClient) => {
  //   // try {
  //   // const response = await wixClient.currentCart.deleteCurrentCart();
  //   // console.log(response);
  //   const cart = await wixClient.currentCart.getCurrentCart();
  //   console.log(cart);
  //   set({ cart: [] });
  //   // set({ cart: cart || [] });
  //   // } catch (err) {
  //   //   set((prevState) => ({ ...prevState, isLoading: false }));
  //   // }
  // },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((prevState) => ({ ...prevState, isLoading: true }));

    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
            catalogItemId: productId,
            ...(variantId && { options: { variantId } }),
          },
          quantity: quantity,
        },
      ],
    });

    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },
  removeItem: async (wixClient, itemId) => {
    set((prevState) => ({ ...prevState, isLoading: true }));

    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId]
    );

    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },
}));
