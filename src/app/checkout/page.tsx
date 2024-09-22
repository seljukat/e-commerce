"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  const wixClient = useWixClient();

  // const { cart, setOrderCart, removeItem } = useCartStore();
  // const { cart } = useCartStore();

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
      router.push("/success/");
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
