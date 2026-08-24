import mongoose from 'mongoose';
import Trip from './src/models/Trip.js';
import GroupTrip from './src/models/GroupTrip.js';
import GroupMember from './src/models/GroupMember.js';
import User from './src/models/User.js';
import Expense from './src/models/Expense.js';
import ExpenseSplit from './src/models/ExpenseSplit.js';
import { addExpense, getTripExpenses, deleteExpense, splitExpense } from './src/services/expenseService.js';
import { createGroupTrip, joinGroupTripByCode } from './src/services/groupTripService.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
  try {
    await mongoose.connect(uri);
    
    // Find two users
    const users = await User.find({}).limit(2);
    const u1 = users[0];
    const u2 = users[1];
    
    // Create a temporary trip
    const trip = await Trip.create({
      user: u1._id,
      title: 'Test Splitting Trip',
      destinationName: 'Test Splitting Trip',
      startDate: new Date(),
      endDate: new Date(),
      budget: { totalAmount: 5000, spentAmount: 0 }
    });
    
    // Make it a group trip
    const groupTrip = await createGroupTrip(u1._id, { tripId: trip._id });
    await joinGroupTripByCode(u2._id, groupTrip.inviteCode);
    
    console.log("Trip and Group created with 2 members.");
    
    // 1. Add Equal Expense (u1 paid 100)
    let exp1 = await addExpense(u1._id, {
      tripId: trip._id,
      amount: 100,
      category: 'food',
      description: 'Equal food',
      paidBy: u1._id
    });
    console.log("Equal Expense Added:", exp1._id);
    
    // 2. Add Percentage Expense (u1 paid 100, u1=70%, u2=30%)
    let exp2 = await addExpense(u1._id, {
      tripId: trip._id,
      amount: 100,
      category: 'activities',
      description: 'Percentage split',
      paidBy: u1._id
    });
    // Add custom splits manually like the frontend does
    await splitExpense(exp2._id, [
       { user: u1._id, splitAmount: 70 },
       { user: u2._id, splitAmount: 30 }
    ]);
    console.log("Percentage Expense Added:", exp2._id);
    
    // Fetch summary
    let summary = await getTripExpenses(trip._id);
    console.log("Summary after 2 expenses:");
    console.log("Total spent:", summary.totalSpent);
    console.log("Settlements:", JSON.stringify(summary.settlements, null, 2));
    
    // 3. Delete the equal expense
    await deleteExpense(exp1._id, u1._id);
    console.log("Deleted equal expense.");
    
    // Fetch summary again
    summary = await getTripExpenses(trip._id);
    console.log("Summary after deletion:");
    console.log("Total spent:", summary.totalSpent);
    console.log("Settlements:", JSON.stringify(summary.settlements, null, 2));
    
    // Cleanup
    await ExpenseSplit.deleteMany({ expense: { $in: [exp1._id, exp2._id] } });
    await Expense.deleteMany({ _id: { $in: [exp1._id, exp2._id] } });
    await GroupMember.deleteMany({ groupTrip: groupTrip._id });
    await GroupTrip.findByIdAndDelete(groupTrip._id);
    await Trip.findByIdAndDelete(trip._id);
    console.log("Cleanup complete.");
    
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};
run();
