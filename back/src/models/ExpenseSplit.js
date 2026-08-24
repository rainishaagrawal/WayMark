import mongoose from "mongoose";

const expenseSplitSchema = new mongoose.Schema(
  {
    expense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense", required: [true, "Expense reference is required"], index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    splitAmount: { type: Number, required: [true, "Split amount is required"], min: [0, "Split amount cannot be negative"] },
    isSettled: { type: Boolean, default: false, index: true },
    settledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

expenseSplitSchema.index({ expense: 1, user: 1 }, { unique: true });

export const ExpenseSplit = mongoose.model("ExpenseSplit", expenseSplitSchema);
export default ExpenseSplit;
