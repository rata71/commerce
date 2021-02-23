import mongoose from "mongoose";

export interface iOrderPayment extends mongoose.Document {
    code: string,
    name: string,
    amount: number
}
