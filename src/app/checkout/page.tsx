"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { addOrder } from "@/lib/mongoActions";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const { replace } = useRouter();

  const wixClient = useWixClient();

  // const { cart, setOrderCart, removeItem } = useCartStore();
  const { cart, resetCounter } = useCartStore();

  const handlePayment = async () => {
    try {
      // setOrderCart(cart);
      // deleteCart(wixClient);
      // cart.lineItems?.map((item) => {
      //   console.log(item._id);
      //   removeItem(wixClient, item._id!);
      // });
      // const removePromises = cart.lineItems?.map((item) =>
      //   removeItem(wixClient, item._id!)
      // );

      // if (removePromises) {
      //   await Promise.all(removePromises);
      // }

      // const params = new URLSearchParams(searchParams);
      // params.set("orderId", cart._id!.toString());
      // replace(`${pathname}?${params.toString()}`);

      const order = { ...cart };

      await wixClient.currentCart.deleteCurrentCart();

      resetCounter();

      await addOrder(order, order._id?.toString());

      router.push("/success/?orderId=" + order._id?.toString());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button
        className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
        onClick={handlePayment}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
