import { getOrder } from "@/lib/mongoActions";
import { media as wixMedia } from "@wix/sdk";
import Image from "next/image";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const wixClient = await wixClientServer();

  const id = params.id;

  const user = await wixClient.members.getCurrentMember({
    fieldsets: [members.Set.FULL],
  });

  // console.log(id);

  const userId = user.member?.contactId?.toString();

  const orderRecord = await getOrder(id, userId);

  // console.log(orderRecord);

  const order = orderRecord.order[0];

  // console.log(order);

  return (
    // <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
    // <div>
    // <div className="w-fit h-[calc(100vh-80px)] p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
    <div className="flex items-center justify-center">
      <div className="w-fit h-fit p-4 rounded-md border-8 border-gray-100 bg-white flex flex-col gap-6">
        {!order.lineItems ? (
          <div>Cart is empty</div>
        ) : (
          <>
            <h2 className="text-xl">Order Information</h2>
            {/* LIST */}
            <div className="flex flex-col gap-8">
              {/* ITEM */}
              {order.lineItems.map((item) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* BOTTOM  */}
            <div>
              <div className="flex items-center justify-between font-semibold">
                <span className="">Subtotal</span>
                <span className="">{order.subtotal.formattedAmount}</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
