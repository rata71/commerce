import mongoose from "mongoose";

export interface iUser extends mongoose.Document {
    username: string,
    password: string,
    active: boolean,
    name: string,
    companyCode: string,
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    name: { type: String, required: true, maxlength: 250 },
    companyCode: { type: String, required: true },
}, {
    versionKey: false,
    timestamps: true
});

UserSchema.index({ username: 1, companyCode: 1 }, { unique: true });
export const User = mongoose.model<iUser>("users", UserSchema);
