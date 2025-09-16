import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Tag,
  BarChart3,
} from "lucide-react";
import Analytics from "./components/Analytics";
import Filter from "./components/Filter";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("expenses");

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Load expenses from API on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const apiExpenses = await fetchExpensesFromAPI();
        if (apiExpenses && apiExpenses.length > 0) {
          // Convert MongoDB _id to id for frontend compatibility
          const expensesWithId = apiExpenses.map((expense) => ({
            ...expense,
            id: expense._id,
          }));
          setExpenses(expensesWithId);
          calculateTotal(expensesWithId);
        } else {
          // Fallback to localStorage if no API data
          const savedExpenses = localStorage.getItem("expenses");
          if (savedExpenses) {
            const parsedExpenses = JSON.parse(savedExpenses);
            setExpenses(parsedExpenses);
            calculateTotal(parsedExpenses);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load expenses from API, using localStorage:",
          error
        );
        // Fallback to localStorage
        const savedExpenses = localStorage.getItem("expenses");
        if (savedExpenses) {
          const parsedExpenses = JSON.parse(savedExpenses);
          setExpenses(parsedExpenses);
          calculateTotal(parsedExpenses);
        }
      }
    };

    loadExpenses();
  }, []);

  // API functions
  const saveExpenseToAPI = async (expense) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/expenses`, expense);
      console.log("Expense saved to API:", response.data);
      return response.data;
    } catch (err) {
      setError("Failed to save expense to server");
      console.error("API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpenseFromAPI = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/expenses/${id}`);
      console.log("Expense deleted from API:", id);
    } catch (err) {
      setError("Failed to delete expense from server");
      console.error("API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesFromAPI = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/expenses`);
      console.log("Expenses fetched from API:", response.data);
      return response.data.data;
    } catch (err) {
      setError("Failed to fetch expenses from server");
      console.error("API Error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    calculateTotal(expenses);
    setFilteredExpenses(expenses); // Initialize filtered expenses
  }, [expenses]);

  const calculateTotal = (expenseList) => {
    const total = expenseList.reduce(
      (sum, expense) => sum + parseFloat(expense.amount || 0),
      0
    );
    setTotalExpenses(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newExpense.title && newExpense.amount && newExpense.category) {
      try {
        const expenseData = {
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
        };

        // Save to API first
        const savedExpense = await saveExpenseToAPI(expenseData);

        // Add the API response (with MongoDB _id) to local state
        const expenseWithId = {
          ...savedExpense.data,
          id: savedExpense.data._id, // Use MongoDB _id as id for frontend
        };

        setExpenses((prev) => [...prev, expenseWithId]);

        // Reset form
        setNewExpense({
          title: "",
          amount: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        console.error("Failed to save expense:", error);
        // Don't add to local state if API call failed
      }
    }
  };

  const deleteExpense = async (id) => {
    try {
      // Delete from API first
      await deleteExpenseFromAPI(id);

      // Delete from local state only if API call succeeds
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
      // Don't remove from local state if API call failed
    }
  };

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Other",
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Expense Tracker</h1>
        <div className="total">
          <DollarSign size={24} />
          <span>Total Expenses: </span>
          <span className="total-amount">${totalExpenses.toFixed(2)}</span>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          <DollarSign size={20} />
          Expenses
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={20} />
          Analytics
        </button>
      </div>

      <main className="main">
        {activeTab === "expenses" && (
          <>
            <section className="add-expense">
              <h2>Add New Expense</h2>
              <form onSubmit={handleSubmit} className="expense-form">
                <div className="form-group">
                  <label htmlFor="title">
                    <Tag size={16} />
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newExpense.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">
                    <DollarSign size={16} />
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="add-btn" disabled={loading}>
                  <Plus size={20} />
                  {loading ? "Adding..." : "Add Expense"}
                </button>
              </form>
            </section>

            <section className="expenses-list">
              <h2>Recent Expenses</h2>

              {/* Filter Component */}
              <Filter
                expenses={expenses}
                onFilteredExpenses={setFilteredExpenses}
                categories={categories}
              />

              {filteredExpenses.length === 0 ? (
                <p className="no-expenses">
                  {expenses.length === 0
                    ? "No expenses yet. Add your first expense above!"
                    : "No expenses match your current filters."}
                </p>
              ) : (
                <div className="expenses">
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="expense-item">
                      <div className="expense-info">
                        <h3>{expense.title}</h3>
                        <p className="expense-category">{expense.category}</p>
                        <p className="expense-date">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="expense-amount">
                        <span>${expense.amount.toFixed(2)}</span>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="delete-btn"
                          title="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-tab">
            <Analytics expenses={expenses} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
