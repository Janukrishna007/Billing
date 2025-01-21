import React, { useState, useEffect } from 'react';
import './FinancialHealth.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar
} from 'recharts';

const FinancialHealth = ({ bills, transactions }) => {
  const [healthScore, setHealthScore] = useState(0);
  const [paymentScore, setPaymentScore] = useState(0);
  const [spendingScore, setSpendingScore] = useState(0);
  const [savingsScore, setSavingsScore] = useState(0);
  const [trends, setTrends] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    calculateScores();
    analyzeTrends();
    checkAchievements();
  }, [bills, transactions]);

  const calculateScores = () => {
    // Calculate Payment Score (30% of total)
    const paymentMetrics = calculatePaymentMetrics();
    const newPaymentScore = (
      paymentMetrics.onTimePayments * 0.5 +
      paymentMetrics.averagePaymentTime * 0.3 +
      paymentMetrics.paymentConsistency * 0.2
    ) * 30;
    setPaymentScore(newPaymentScore);

    // Calculate Spending Score (40% of total)
    const spendingMetrics = calculateSpendingMetrics();
    const newSpendingScore = (
      spendingMetrics.budgetAdherence * 0.4 +
      spendingMetrics.categoryBalance * 0.3 +
      spendingMetrics.spendingTrend * 0.3
    ) * 40;
    setSpendingScore(newSpendingScore);

    // Calculate Savings Score (30% of total)
    const savingsMetrics = calculateSavingsMetrics();
    const newSavingsScore = (
      savingsMetrics.savingsRate * 0.5 +
      savingsMetrics.emergencyFund * 0.3 +
      savingsMetrics.savingsGrowth * 0.2
    ) * 30;
    setSavingsScore(newSavingsScore);

    // Calculate total health score
    setHealthScore(newPaymentScore + newSpendingScore + newSavingsScore);
  };

  const calculatePaymentMetrics = () => {
    // Implement payment metrics calculation
    return {
      onTimePayments: 0.85, // Example: 85% on-time payments
      averagePaymentTime: 0.9, // Example: Good average payment time
      paymentConsistency: 0.8 // Example: Consistent payment behavior
    };
  };

  const calculateSpendingMetrics = () => {
    // Implement spending metrics calculation
    return {
      budgetAdherence: 0.75, // Example: 75% adherence to budget
      categoryBalance: 0.8, // Example: Good balance across categories
      spendingTrend: 0.7 // Example: Positive spending trend
    };
  };

  const calculateSavingsMetrics = () => {
    // Implement savings metrics calculation
    return {
      savingsRate: 0.6, // Example: 60% of target savings rate
      emergencyFund: 0.7, // Example: 70% of target emergency fund
      savingsGrowth: 0.8 // Example: Good savings growth rate
    };
  };

  const analyzeTrends = () => {
    // Example trend data
    const trendData = [
      { month: 'Jan', spending: 2400, savings: 400, health: 65 },
      { month: 'Feb', spending: 2100, savings: 500, health: 70 },
      { month: 'Mar', spending: 2300, savings: 450, health: 68 },
      { month: 'Apr', spending: 2000, savings: 600, health: 75 },
      { month: 'May', spending: 1900, savings: 700, health: 80 },
      { month: 'Jun', spending: 1850, savings: 750, health: 85 },
    ];
    setTrends(trendData);
  };

  const checkAchievements = () => {
    // Example achievements
    const newAchievements = [
      {
        id: 1,
        title: 'Savings Master',
        description: 'Maintained positive savings for 3 months',
        progress: 85,
        unlocked: true
      },
      {
        id: 2,
        title: 'Budget Pro',
        description: 'Stayed within budget for 6 months',
        progress: 60,
        unlocked: false
      },
      {
        id: 3,
        title: 'Payment Ninja',
        description: 'All payments made on time for 3 months',
        progress: 100,
        unlocked: true
      }
    ];
    setAchievements(newAchievements);
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="financial-health-dashboard">
      <div className="dashboard-header">
        <h2>Financial Health Score</h2>
        <div className="score-display" style={{ color: getHealthScoreColor(healthScore) }}>
          {Math.round(healthScore)}
        </div>
      </div>

      <div className="score-breakdown">
        <div className="score-card payment">
          <h3>Payment Health</h3>
          <div className="score">{Math.round(paymentScore)}</div>
          <div className="score-bar">
            <div className="fill" style={{ width: `${paymentScore}%` }}></div>
          </div>
        </div>

        <div className="score-card spending">
          <h3>Spending Health</h3>
          <div className="score">{Math.round(spendingScore)}</div>
          <div className="score-bar">
            <div className="fill" style={{ width: `${spendingScore}%` }}></div>
          </div>
        </div>

        <div className="score-card savings">
          <h3>Savings Health</h3>
          <div className="score">{Math.round(savingsScore)}</div>
          <div className="score-bar">
            <div className="fill" style={{ width: `${savingsScore}%` }}></div>
          </div>
        </div>
      </div>

      <div className="trends-section">
        <h3>Financial Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="health" stroke="#8884d8" />
            <Line type="monotone" dataKey="spending" stroke="#82ca9d" />
            <Line type="monotone" dataKey="savings" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="achievements-section">
        <h3>Financial Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${achievement.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{achievement.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth; 