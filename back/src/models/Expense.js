import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: [true, "Trip reference is required"], index: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Payer user reference is required"], index: true },
    amount: { type: Number, required: [true, "Expense amount is required"], min: [0, "Amount cannot be negative"] },
    currency: { type: String, default: "USD", uppercase: true },
    category: {
      type: String,
      enum: ["flights", "hotels", "food", "shopping", "transport", "activities", "miscellaneous"],
      required: [true, "Expense category is required"],
      index: true,
    },
    description: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

expenseSchema.index({ trip: 1, category: 1 });
expenseSchema.index({ trip: 1, paidBy: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
