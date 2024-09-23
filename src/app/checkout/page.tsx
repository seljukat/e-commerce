"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { addOrder } from "@/lib/mongoActions";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { members } from "@wix/members";

import { media as wixMedia } from "@wix/sdk";
// import { useCartStore } from "@/hooks/useCartStore";
import Image from "next/image";

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

      const user = await wixClient.members.getCurrentMember({
        fieldsets: [members.Set.FULL],
      });

      console.log(user);

      const order = { ...cart };

      await wixClient.currentCart.deleteCurrentCart();

      resetCounter();

      console.log(user.member?.contactId);

      await addOrder(
        order,
        order._id?.toString(),
        user.member?.contactId?.toString()
      );

      router.push("/success/?orderId=" + order._id?.toString());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-12 flex flex-col md:flex-row gap-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl">Customer Details</h1>
        <form className="mt-6 flex flex-col gap-4">
          <label htmlFor="email" className="text-sm text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label htmlFor="firstName" className="text-sm text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label htmlFor="lastName" className="text-sm text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label htmlFor="phone" className="text-sm text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
        </form>
        <h1 className="mt-12 text-2xl">Delivery Details</h1>
        <form className="mt-6 flex flex-col gap-4">
          <label htmlFor="country/region" className="text-sm text-gray-700">
            Country/Region
          </label>
          <input
            type="text"
            name="country/region"
            id="country/region"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label htmlFor="address" className="text-sm text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label htmlFor="delivery-method" className="text-sm text-gray-700">
            Delivery Method
          </label>
          <div className="flex">
            <input
              type="radio"
              name="lastName"
              id="delivery-method"
              value="Free Shipping"
            />
            <label
              htmlFor="delivery-method"
              className="ml-1 text-sm text-gray-700"
            >
              Free Shipping
            </label>
          </div>
        </form>

        <button
          className="mt-12 rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
          onClick={handlePayment}
        >
          Place Order
        </button>
      </div>

      {/* <div> */}
      <div className="flex">
        <div className="w-fit h-fit p-4 rounded-md border-8 border-gray-100 bg-white flex flex-col gap-6">
          {/* {!orderCart.lineItems ? ( */}
          {!cart.lineItems ? (
            <div>Cart is empty</div>
          ) : (
            <>
              <h2 className="text-xl">Order Information</h2>
              {/* LIST */}
              <div className="flex flex-col gap-8">
                {/* ITEM */}
                {/* {orderCart.lineItems.map((item) => ( */}
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
                        {/* <span
                      className="text-blue-500"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(wixClient, item._id!)}
                    >
                      Remove
                    </span> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* BOTTOM  */}
              <div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="">Subtotal</span>
                  {/* <span className="">{orderCart.subtotal.formattedAmount}</span> */}
                  <span className="">{cart.subtotal.formattedAmount}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2 mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                {/* <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View cart
              </button>
              <button
                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div> */}
              </div>
            </>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default CheckoutPage;
