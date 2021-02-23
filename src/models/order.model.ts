import mongoose from "mongoose";
import {iOrderItem} from "../interfaces/orderItem.interface";
import {iOrderPayment} from "../interfaces/orderPayment.interface";
import {NextFunction} from "express";

export interface iOrder extends mongoose.Document {
    creationDate: Date,
    internalNumber: number
    customerId: string,
    customerName: string,
    customerEmail: string,
    status: string,
    companyCode: string,
    items: [iOrderItem],
    payments: [iOrderPayment],
    itemCount: number
}

const OrderSchema = new mongoose.Schema({
    creationDate: { type: Date, required: true },
    internalNumber: { type: Number, required: true, min:0 },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true, maxlength: 250 },
    customerEmail: { type: String, required: true },
    status: { type: String, required: true, enum:['Created', 'Closed'] },
    companyCode: { type: String, required: true },
    items: [{
        sku: { type: String, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        }
    ],
    payments: [
        {
            code: { type: String, required: true },
            name: { type: String, required: true },
            amount: { type: Number, required: true },
        }
    ],
    itemCount: { type: Number, required: false },
}, {
    timestamps: true
});

// @ts-ignore
OrderSchema.pre("validate", function(this: iOrder, next: NextFunction){
    let qtyTotal = 0;
    for(let it of this.items){
        qtyTotal += it.qty;
    }
    this.itemCount = qtyTotal;
    this.creationDate = new Date();
    next();
});

OrderSchema.index({ internalNumber: 1, companyCode: 1 }, { unique: true });
OrderSchema.index({ customerId: 1, companyCode: 1 }, { unique: false });
OrderSchema.index({ status: 1 }, { unique: false });
export const Order = mongoose.model<iOrder>("orders", OrderSchema);
