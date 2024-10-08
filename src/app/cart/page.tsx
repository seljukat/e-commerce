"use client";

import { useCartStore } from "@/hooks/useCartStore";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { useRouter } from "next/navigation";

const ViewCartPage = () => {
  // TEMPORARY
  // const cartItems = true;

  const wixClient = useWixClient();

  const { cart, isLoading, removeItem } = useCartStore();

  const router = useRouter();

  const handleCheckout = () => {
    try {
      router.push("/checkout/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
    <div className="flex items-center justify-center">
      <div className="w-fit h-fit p-4 rounded-md border-8 border-gray-100 bg-white flex flex-col gap-6">
        {!cart.lineItems ? (
          <div>Cart is empty</div>
        ) : (
          <>
            <h2 className="text-xl">Shopping Cart</h2>
            {/* LIST */}
            {/* <div className="flex flex-col gap-8 h-64 overflow-auto"> */}
            {/* <div
              className={`flex flex-col gap-8 ${
                cart.lineItems.length > 2 ? "h-64 overflow-auto" : "h-fit"
              }`}
            > */}
            <div className="flex flex-col gap-8 h-fit">
              {/* ITEM */}
              {cart.lineItems.map((item) => (
                <div className="flex gap-4" key={item._id}>
                  {item.image && (
                    <Image
                      src={wixMedia.getScaledToFillImageUrl(
                        item.image,
                        72,
                        96,
                        {}
                      )}
                      alt=""
                      width={72}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  )}
                  <div className="flex flex-col justify-between w-full">
                    {/* TOP */}
                    <div>
                      {/* TITLE */}
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold">
                          {item.productName?.original}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-xs text-green-500">
                              {item.quantity} x
                            </div>
                          )}
                          {item.price?.formattedAmount}
                        </div>
                      </div>
                      {/* DESC */}
                      <div className="text-sm text-gray-500">
                        {item.availability?.status}
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Qty. {item.quantity}
                      </span>
                      <span
                        className="text-blue-500"
                        style={{
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                        onClick={() => removeItem(wixClient, item._id!)}
                      >
                        Remove
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* BOTTOM  */}
            <div>
              <div className="flex items-center justify-between font-semibold">
                <span className="">Subtotal</span>
                <span className="">{cart.subtotal.formattedAmount}</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-between text-sm">
                <button
                  className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                  disabled={isLoading}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewCartPage;
