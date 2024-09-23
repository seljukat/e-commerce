"use server";

import { Order } from "./mongoModels";
import { connectToDb } from "./mongoUtils";
import { revalidatePath } from "next/cache";

export const addOrder = async (order, orderId) => {
  try {
    connectToDb();

    const newOrder = new Order({
      order: order,
      orderId: orderId,
    });

    await newOrder.save();

    console.log("order saved to db");

    // revalidatePath("/success/?orderId=" + order._id?.toString());
    // revalidatePath(`/orders/${orderId}`);
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const getOrders = async () => {
  try {
    connectToDb();
    const orders = await Order.find();
    return orders;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch orders!");
  }
};

export const getOrder = async (id) => {
  try {
    connectToDb();
    const order = await Order.findOne({ orderId: id });
    return order;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch order!");
  }
};
