import Expense from "../models/Expense.js";
import ExpenseSplit from "../models/ExpenseSplit.js";
import Trip from "../models/Trip.js";
import GroupTrip from "../models/GroupTrip.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const addExpense = async (userId, expenseData) => {
  const { tripId, amount, category, description, currency, date, paidBy } = expenseData;

  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  // Check permission: user is trip owner OR group member
  let isAuthorized = trip.user.toString() === userId.toString();
  if (!isAuthorized) {
    const groupTrip = await GroupTrip.findOne({ trip: tripId });
    if (groupTrip) {
      const membership = await GroupMember.findOne({ groupTrip: groupTrip._id, user: userId, status: "ACCEPTED" });
      if (membership) isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized to add expenses to this trip");
  }

  // Payer can be specified (e.g. logging an expense paid by another member), defaulting to current user
  const payerId = paidBy || userId;

  const expense = await Expense.create({
    trip: tripId,
    paidBy: payerId,
    amount,
    category,
    description,
    currency: currency || "USD",
    date: date || new Date(),
  });

  await Trip.findByIdAndUpdate(tripId, { $inc: { "budget.spentAmount": amount } });

  const populatedExpense = await Expense.findById(expense._id).populate("paidBy", "name email avatar");
  return populatedExpense;
};

export const deleteExpense = async (expenseId, userId) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Expense not found");

  const trip = await Trip.findById(expense.trip);
  const isPayer = expense.paidBy.toString() === userId.toString();
  const isTripOwner = trip && trip.user.toString() === userId.toString();

  if (!isPayer && !isTripOwner) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have permission to delete this expense");
  }

  await Trip.findByIdAndUpdate(expense.trip, { $inc: { "budget.spentAmount": -expense.amount } });
  await ExpenseSplit.deleteMany({ expense: expenseId });
  await expense.deleteOne();

  return { message: "Expense deleted successfully" };
};

export const splitExpense = async (expenseId, splits = []) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Expense not found");

  const splitRecords = [];
  for (const item of splits) {
    const record = await ExpenseSplit.findOneAndUpdate(
      { expense: expenseId, user: item.user },
      { $set: { expense: expenseId, user: item.user, splitAmount: item.splitAmount, isSettled: false } },
      { upsert: true, new: true }
    );
    splitRecords.push(record);
  }

  return splitRecords;
};

export const settleExpenseSplit = async (splitId) => {
  const split = await ExpenseSplit.findByIdAndUpdate(
    splitId,
    { $set: { isSettled: true, settledAt: new Date() } },
    { new: true }
  );
  if (!split) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Expense split record not found");
  return split;
};

export const getTripExpenses = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  const expenses = await Expense.find({ trip: tripId }).populate("paidBy", "name email avatar").sort({ date: -1 });
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Determine group members for this trip
  const groupTrip = await GroupTrip.findOne({ trip: tripId });
  let members = [];

  if (groupTrip) {
    const groupMembers = await GroupMember.find({ groupTrip: groupTrip._id, status: "ACCEPTED" }).populate("user", "name email avatar");
    members = groupMembers.map((m) => m.user).filter(Boolean);
  }

  // Fallback: if no group trip or empty members, include trip owner and any expense payers
  if (members.length === 0) {
    const owner = await User.findById(trip.user).select("name email avatar");
    if (owner) members.push(owner);

    expenses.forEach((e) => {
      if (e.paidBy && !members.some((m) => m._id.toString() === e.paidBy._id.toString())) {
        members.push(e.paidBy);
      }
    });
  }

  const memberCount = members.length || 1;
  const perMemberShare = Math.round((totalSpent / memberCount) * 100) / 100;

  // Group expenses by member
  const memberExpenses = members.map((member) => {
    const userExpenses = expenses.filter((e) => e.paidBy && e.paidBy._id.toString() === member._id.toString());
    const totalPaid = userExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = Math.round((totalPaid - perMemberShare) * 100) / 100;
    return {
      user: member,
      totalPaid,
      shareAmount: perMemberShare,
      netBalance, // >0: gets back money, <0: owes money, ==0: settled
      expenses: userExpenses,
    };
  });

  const categoryBreakdown = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  // Calculate pairwise settlements
  const debtors = memberExpenses.filter(m => m.netBalance < 0).map(m => ({ user: m.user, amount: Math.abs(m.netBalance) }));
  const creditors = memberExpenses.filter(m => m.netBalance > 0).map(m => ({ user: m.user, amount: m.netBalance }));
  
  const settlements = [];
  let d = 0, c = 0;
  while(d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) {
       settlements.push({
         from: debtor.user,
         to: creditor.user,
         amount: Math.round(amount * 100) / 100
       });
    }
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount < 0.01) d++;
    if (creditor.amount < 0.01) c++;
  }

  return {
    expenses,
    members,
    totalSpent,
    memberCount,
    perMemberShare,
    memberBalances: memberExpenses,
    settlements,
    categoryBreakdown,
    isGroupTrip: !!groupTrip,
  };
};

export const getMyTripExpenses = async (tripId, userId) => {
  const expenses = await Expense.find({ trip: tripId, paidBy: userId }).sort({ date: -1 });
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  return { expenses, totalSpent };
};
