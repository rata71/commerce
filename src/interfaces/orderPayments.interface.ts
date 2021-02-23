import mongoose from "mongoose";

export interface iOrderPayments extends mongoose.Document {
    code: string,
    name: string,
    amount: number,
}