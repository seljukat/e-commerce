import UpdateButton from "@/components/UpdateButton";
import { updateUser } from "@/lib/actions";
import { getOrders } from "@/lib/mongoActions";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import { format } from "timeago.js";
import Link from "next/link";

const ProfilePage = async () => {
  const wixClient = await wixClientServer();

  const user = await wixClient.members.getCurrentMember({
    fieldsets: [members.Set.FULL],
  });

  if (!user.member?.contactId) {
    return <div className="">Not logged in!</div>;
  }

  const orders = await getOrders(user.member?.contactId.toString());

  //   console.log(orders);

  return (
    <div className="mt-12 flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl">Profile</h1>
        <form action={updateUser} className="mt-12 flex flex-col gap-4">
          <input type="text" hidden name="id" value={user.member.contactId} />
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder={user.member?.profile?.nickname || "john"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder={user.member?.contact?.firstName || "John"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">Surname</label>
          <input
            type="text"
            name="lastName"
            placeholder={user.member?.contact?.lastName || "Doe"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder={
              (user.member?.contact?.phones &&
                user.member?.contact?.phones[0]) ||
              "+1234567"
            }
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <label className="text-sm text-gray-700">E-mail</label>
          <input
            type="email"
            name="email"
            placeholder={user.member?.loginEmail || "john@gmail.com"}
            className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
          />
          <UpdateButton />
        </form>
      </div>
      {/* <div>Orders</div> */}
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl">All Orders</h1>
        {/* <div className="mt-12 flex flex-col"> */}
        <div
          className={`mt-12 flex flex-col ${
            orders.length > 6 ? "h-[500px] overflow-auto" : "h-fit"
          }`}
        >
          {orders.map((order) => {
            // console.log(order.order[0]);
            return (
              <Link
                href={`/orders/${order.orderId}`}
                key={order.orderId}
                className="flex justify-between px-2 py-6 rounded-md hover:bg-green-50 even:bg-slate-100"
              >
                <span className="w-1/4">
                  {order.orderId?.substring(0, 10)}...
                </span>
                <span className="w-1/4">
                  {order.order[0]?.subtotal?.formattedAmount}
                </span>
                {order.order[0]._createdDate && (
                  <span className="w-1/4">
                    {format(order.order[0]._createdDate)}
                  </span>
                )}
                <span className="w-1/4">APPROVED</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
