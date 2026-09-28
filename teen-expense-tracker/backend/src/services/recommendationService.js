const TransactionModel = require('../models/TransactionModel');
const BudgetModel = require('../models/BudgetModel');
const SavingsGoalModel = require('../models/SavingsGoalModel');

class RecommendationService {
  /**
   * Generate personalized spending recommendations based on the user's financial data.
   * All recommendations are data-driven, non-judgmental, and teen-friendly.
   */
  static async generateRecommendations(userId) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Current month data
    const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
    const monthTransactions = await TransactionModel.getByDateRange(userId, startOfMonth, endOfMonth);

    // Previous month data
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const startOfPrevMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
    const endOfPrevMonth = new Date(prevYear, prevMonth, 0).toISOString().split('T')[0];
    const prevMonthTransactions = await TransactionModel.getByDateRange(userId, startOfPrevMonth, endOfPrevMonth);

    // Get budgets and savings goals
    const budgets = await BudgetModel.findByUserId(userId, currentMonth, currentYear);
    const savingsGoals = await SavingsGoalModel.findByUserId(userId);

    const recommendations = [];

    // Analyze spending patterns
    const currentExpenses = this._groupByCategory(monthTransactions.filter((t) => t.type === 'expense'));
    const prevExpenses = this._groupByCategory(prevMonthTransactions.filter((t) => t.type === 'expense'));

    const totalCurrentExpense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalCurrentIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalPrevExpense = prevMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // 1. Compare monthly spending to previous month
    if (totalPrevExpense > 0 && totalCurrentExpense > totalPrevExpense) {
      const increase = ((totalCurrentExpense - totalPrevExpense) / totalPrevExpense * 100).toFixed(0);
      if (increase > 10) {
        recommendations.push({
          type: 'spending_increase',
          title: 'Spending is up this month',
          message: `Your total spending increased by ${increase}% compared to last month. It might help to review where the extra spending is going.`,
          priority: increase > 30 ? 'high' : 'medium',
          icon: '📈',
        });
      }
    }

    // 2. Category-specific insights
    for (const [category, data] of Object.entries(currentExpenses)) {
      const prevData = prevExpenses[category];

      // Check if category spending increased significantly
      if (prevData && prevData.amount > 0) {
        const categoryIncrease = ((data.amount - prevData.amount) / prevData.amount * 100).toFixed(0);
        if (categoryIncrease > 25) {
          recommendations.push({
            type: 'category_increase',
            title: `${category} spending went up`,
            message: `You spent ${categoryIncrease}% more on ${category.toLowerCase()} this month compared to last month. Maybe keep an eye on this area.`,
            priority: categoryIncrease > 50 ? 'high' : 'medium',
            icon: data.icon || '💰',
          });
        }
      }

      // Check if a category represents a large portion of spending
      if (totalCurrentExpense > 0) {
        const percentage = (data.amount / totalCurrentExpense * 100).toFixed(0);
        if (percentage > 30) {
          recommendations.push({
            type: 'high_category',
            title: `${category} is your biggest expense`,
            message: `${category} accounts for ${percentage}% of your spending this month. Consider setting a budget for this category if you haven't already.`,
            priority: 'medium',
            icon: data.icon || '🎯',
          });
        }
      }
    }

    // 3. Budget-related recommendations
    for (const budget of budgets) {
      const categoryName = budget.categories?.name || 'Unknown';
      const budgetAmount = parseFloat(budget.amount);
      const spent = monthTransactions
        .filter((t) => t.type === 'expense' && t.category_id === budget.category_id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const percentUsed = budgetAmount > 0 ? (spent / budgetAmount * 100) : 0;

      if (percentUsed > 100) {
        recommendations.push({
          type: 'budget_exceeded',
          title: `${categoryName} budget exceeded`,
          message: `You've spent ₹${spent.toFixed(0)} out of your ₹${budgetAmount.toFixed(0)} ${categoryName.toLowerCase()} budget. Consider adjusting your budget or reducing spending in this area.`,
          priority: 'high',
          icon: '🚨',
        });
      } else if (percentUsed > 80) {
        recommendations.push({
          type: 'budget_warning',
          title: `${categoryName} budget almost used up`,
          message: `You've used ${percentUsed.toFixed(0)}% of your ${categoryName.toLowerCase()} budget. You have ₹${(budgetAmount - spent).toFixed(0)} left for the rest of the month.`,
          priority: 'medium',
          icon: '⚠️',
        });
      } else if (percentUsed < 30 && now.getDate() > 20) {
        recommendations.push({
          type: 'budget_underuse',
          title: `Well done on ${categoryName}!`,
          message: `You've only used ${percentUsed.toFixed(0)}% of your ${categoryName.toLowerCase()} budget this month. Consider putting the difference toward a savings goal!`,
          priority: 'low',
          icon: '🌟',
        });
      }
    }

    // 4. Savings recommendations
    if (totalCurrentIncome > 0) {
      const savingsRate = ((totalCurrentIncome - totalCurrentExpense) / totalCurrentIncome * 100);
      if (savingsRate > 50) {
        recommendations.push({
          type: 'great_savings',
          title: 'Amazing savings this month!',
          message: `You've saved ${savingsRate.toFixed(0)}% of your income. That's excellent! Consider putting some toward your savings goals.`,
          priority: 'low',
          icon: '🎉',
        });
      } else if (savingsRate < 10 && savingsRate >= 0) {
        recommendations.push({
          type: 'low_savings',
          title: 'Savings are a bit low',
          message: `You've saved about ${savingsRate.toFixed(0)}% of your income this month. Even small amounts add up — try setting aside a little more each week.`,
          priority: 'medium',
          icon: '💡',
        });
      }
    }

    // 5. Savings goal recommendations
    for (const goal of savingsGoals) {
      const progress = parseFloat(goal.target_amount) > 0
        ? (parseFloat(goal.current_amount) / parseFloat(goal.target_amount) * 100)
        : 0;

      if (progress >= 90 && progress < 100) {
        recommendations.push({
          type: 'goal_almost_done',
          title: `Almost there — ${goal.name}!`,
          message: `You're ${progress.toFixed(0)}% of the way to your "${goal.name}" goal. Just a little more to go!`,
          priority: 'low',
          icon: '🏆',
        });
      }

      if (goal.deadline) {
        const deadline = new Date(goal.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        const remaining = parseFloat(goal.target_amount) - parseFloat(goal.current_amount);

        if (daysLeft > 0 && daysLeft <= 30 && remaining > 0) {
          const dailyNeeded = (remaining / daysLeft).toFixed(0);
          recommendations.push({
            type: 'goal_deadline',
            title: `${goal.name} deadline approaching`,
            message: `You need to save about ₹${dailyNeeded} per day to reach your "${goal.name}" goal by the deadline. You can do it!`,
            priority: daysLeft <= 7 ? 'high' : 'medium',
            icon: '⏰',
          });
        }
      }
    }

    // 6. General tips based on no data
    if (monthTransactions.length === 0) {
      recommendations.push({
        type: 'get_started',
        title: 'Start tracking your spending!',
        message: 'Add your first expense or income to start getting personalized insights and recommendations.',
        priority: 'low',
        icon: '🚀',
      });
    }

    if (budgets.length === 0 && monthTransactions.length > 3) {
      recommendations.push({
        type: 'set_budget',
        title: 'Set up budgets',
        message: 'You have some transactions but no budgets set. Creating budgets helps you stay in control of your spending.',
        priority: 'medium',
        icon: '📊',
      });
    }

    if (savingsGoals.length === 0 && monthTransactions.length > 3) {
      recommendations.push({
        type: 'set_goal',
        title: 'Create a savings goal',
        message: 'Setting a savings goal gives you something to work toward. It could be anything — new headphones, a game, or a trip!',
        priority: 'low',
        icon: '🎯',
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return { recommendations };
  }

  /**
   * Group transactions by category name and sum amounts.
   */
  static _groupByCategory(transactions) {
    const grouped = {};
    transactions.forEach((t) => {
      const name = t.categories?.name || 'Other';
      const icon = t.categories?.icon || '📦';
      if (!grouped[name]) {
        grouped[name] = { amount: 0, count: 0, icon };
      }
      grouped[name].amount += parseFloat(t.amount);
      grouped[name].count += 1;
    });
    return grouped;
  }
}

module.exports = RecommendationService;
