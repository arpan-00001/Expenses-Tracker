const TransactionModel = require('../models/TransactionModel');
const BudgetModel = require('../models/BudgetModel');
const SavingsGoalModel = require('../models/SavingsGoalModel');

class AnalyticsService {
  /**
   * Get a complete dashboard summary for the user.
   */
  static async getDashboardSummary(userId) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

    // Get all transactions and current month transactions
    const allTransactions = await TransactionModel.getAllByUserId(userId);
    const monthTransactions = await TransactionModel.getByDateRange(userId, startOfMonth, endOfMonth);

    // Calculate totals
    const totalIncome = allTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = allTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Monthly calculations
    const monthlyIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyExpenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Daily average spending this month
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dayOfMonth = now.getDate();
    const averageDailySpending = dayOfMonth > 0 ? monthlyExpenses / dayOfMonth : 0;

    // Savings rate
    const savingsRate = monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100)
      : 0;

    // Budget info
    const budgets = await BudgetModel.findByUserId(userId, currentMonth, currentYear);
    const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
    const remainingBudget = totalBudget - monthlyExpenses;

    // Savings goals
    const goals = await SavingsGoalModel.findByUserId(userId);
    const totalSavingsTarget = goals.reduce((sum, g) => sum + parseFloat(g.target_amount), 0);
    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.current_amount), 0);

    // Recent transactions
    const recentTransactions = await TransactionModel.getRecentByUserId(userId, 5);

    return {
      balance: Math.round(balance * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100,
      totalBudget: Math.round(totalBudget * 100) / 100,
      remainingBudget: Math.round(remainingBudget * 100) / 100,
      totalSavingsTarget: Math.round(totalSavingsTarget * 100) / 100,
      totalSaved: Math.round(totalSaved * 100) / 100,
      recentTransactions,
      currentMonth,
      currentYear,
    };
  }

  /**
   * Get spending breakdown by category for a given period.
   */
  static async getCategoryBreakdown(userId, startDate, endDate) {
    const transactions = await TransactionModel.getByDateRange(userId, startDate, endDate);

    const expensesByCategory = {};
    const incomeByCategory = {};

    transactions.forEach((t) => {
      const categoryName = t.categories?.name || 'Other';
      const categoryIcon = t.categories?.icon || '📦';
      const amount = parseFloat(t.amount);

      if (t.type === 'expense') {
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = { name: categoryName, icon: categoryIcon, amount: 0, count: 0 };
        }
        expensesByCategory[categoryName].amount += amount;
        expensesByCategory[categoryName].count += 1;
      } else {
        if (!incomeByCategory[categoryName]) {
          incomeByCategory[categoryName] = { name: categoryName, icon: categoryIcon, amount: 0, count: 0 };
        }
        incomeByCategory[categoryName].amount += amount;
        incomeByCategory[categoryName].count += 1;
      }
    });

    // Calculate totals and percentages
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, c) => sum + c.amount, 0);
    const totalIncome = Object.values(incomeByCategory).reduce((sum, c) => sum + c.amount, 0);

    const expenses = Object.values(expensesByCategory)
      .map((c) => ({
        ...c,
        amount: Math.round(c.amount * 100) / 100,
        percentage: totalExpenses > 0 ? Math.round((c.amount / totalExpenses) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const income = Object.values(incomeByCategory)
      .map((c) => ({
        ...c,
        amount: Math.round(c.amount * 100) / 100,
        percentage: totalIncome > 0 ? Math.round((c.amount / totalIncome) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      expenses,
      income,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
    };
  }

  /**
   * Get monthly spending/income data for chart visualization.
   */
  static async getMonthlyData(userId, months = 6) {
    const now = new Date();
    const monthlyData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const transactions = await TransactionModel.getByDateRange(userId, startDate, endDate);

      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      monthlyData.push({
        month: monthNames[month - 1],
        monthNumber: month,
        year,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        savings: Math.round((income - expenses) * 100) / 100,
      });
    }

    return monthlyData;
  }

  /**
   * Get spending trends — daily spending over the last 30 days.
   */
  static async getSpendingTrends(userId, days = 30) {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    const transactions = await TransactionModel.getByDateRange(
      userId,
      startDate.toISOString().split('T')[0],
      now.toISOString().split('T')[0]
    );

    const dailySpending = {};
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailySpending[dateStr] = { date: dateStr, amount: 0 };
    }

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const dateStr = t.transaction_date;
        if (dailySpending[dateStr]) {
          dailySpending[dateStr].amount += parseFloat(t.amount);
        }
      });

    return Object.values(dailySpending).map((d) => ({
      ...d,
      amount: Math.round(d.amount * 100) / 100,
    }));
  }

  /**
   * Get budget usage for a specific month.
   */
  static async getBudgetUsage(userId, month, year) {
    const budgets = await BudgetModel.findByUserId(userId, month, year);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    const transactions = await TransactionModel.getByDateRange(userId, startDate, endDate);

    const budgetUsage = budgets.map((budget) => {
      const categoryExpenses = transactions
        .filter((t) => t.type === 'expense' && t.category_id === budget.category_id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const budgetAmount = parseFloat(budget.amount);
      const spent = Math.round(categoryExpenses * 100) / 100;
      const remaining = Math.round((budgetAmount - categoryExpenses) * 100) / 100;
      const percentageUsed = budgetAmount > 0 ? Math.round((categoryExpenses / budgetAmount) * 10000) / 100 : 0;

      let status = 'on-track';
      if (percentageUsed >= 100) status = 'exceeded';
      else if (percentageUsed >= 90) status = 'critical';
      else if (percentageUsed >= 75) status = 'warning';
      else if (percentageUsed >= 50) status = 'halfway';

      return {
        id: budget.id,
        category: budget.categories,
        budgetAmount: Math.round(budgetAmount * 100) / 100,
        spent,
        remaining,
        percentageUsed,
        status,
      };
    });

    return budgetUsage;
  }
}

module.exports = AnalyticsService;
