import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

const Analytics = ({ expenses }) => {
  const [stats, setStats] = useState({
    totalAmount: 0,
    categoryBreakdown: {},
    monthlySpending: {},
    averageExpense: 0
  });

  useEffect(() => {
    calculateStats();
  }, [expenses]);

  const calculateStats = () => {
    if (!expenses || expenses.length === 0) {
      setStats({
        totalAmount: 0,
        categoryBreakdown: {},
        monthlySpending: {},
        averageExpense: 0
      });
      return;
    }

    // Calculate total amount
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate monthly spending
    const monthlySpending = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate average expense
    const averageExpense = totalAmount / expenses.length;

    setStats({
      totalAmount,
      categoryBreakdown,
      monthlySpending,
      averageExpense
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#ff6b6b',
      'Transport': '#4ecdc4',
      'Entertainment': '#45b7d1',
      'Shopping': '#96ceb4',
      'Bills': '#feca57',
      'Healthcare': '#ff9ff3',
      'Other': '#a55eea'
    };
    return colors[category] || '#95a5a6';
  };

  const topCategories = Object.entries(stats.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentMonths = Object.entries(stats.monthlySpending)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-6);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>
          <BarChart3 size={24} />
          Analytics & Insights
        </h2>
      </div>

      <div className="stats-grid">
        {/* Total Spending */}
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Spending</h3>
            <p className="stat-value">${stats.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Average Expense */}
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Average Expense</h3>
            <p className="stat-value">${stats.averageExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="stat-card">
          <div className="stat-icon">
            <PieChart size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <p className="stat-value">{expenses.length}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Category Breakdown */}
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="category-chart">
            {topCategories.map(([category, amount]) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <div 
                    className="category-color" 
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></div>
                  <span className="category-name">{category}</span>
                </div>
                <div className="category-amount">
                  ${amount.toFixed(2)}
                  <div className="category-percentage">
                    {((amount / stats.totalAmount) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="chart-card">
          <h3>Monthly Spending Trend</h3>
          <div className="monthly-chart">
            {recentMonths.map(([month, amount]) => (
              <div key={month} className="month-item">
                <div className="month-bar">
                  <div 
                    className="month-fill"
                    style={{ 
                      height: `${(amount / Math.max(...Object.values(stats.monthlySpending))) * 100}%`,
                      backgroundColor: '#667eea'
                    }}
                  ></div>
                </div>
                <div className="month-info">
                  <span className="month-name">{month}</span>
                  <span className="month-amount">${amount.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
