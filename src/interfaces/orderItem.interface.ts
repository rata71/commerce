import mongoose from "mongoose";

export interface iOrderItem extends mongoose.Document {
    sku: string,
    name: string,
    qty: number,
    unitPrice: number,
    totalPrice: number,
}
