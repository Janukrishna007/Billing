import React, { useState, useEffect } from 'react';
import './GameInvoice.css';

const GameInvoice = ({ items, totalAmount, onDiscountEarned }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [discountEarned, setDiscountEarned] = useState(0);
  const [hiddenDiscount, setHiddenDiscount] = useState(null);
  const [foundDiscount, setFoundDiscount] = useState(false);

  const quizQuestions = [
    {
      question: "What's the best way to save energy while shopping?",
      options: [
        "Buy in bulk to reduce trips",
        "Shop during peak hours",
        "Order multiple small packages",
        "Ignore energy consumption"
      ],
      correct: 0
    },
    {
      question: "Which payment method has the lowest carbon footprint?",
      options: [
        "Digital payment",
        "Cash payment",
        "Check payment",
        "Credit card"
      ],
      correct: 0
    },
    {
      question: "How can you reduce paper waste in billing?",
      options: [
        "Request digital receipts",
        "Print multiple copies",
        "Ask for detailed paper receipts",
        "Ignore receipts entirely"
      ],
      correct: 0
    }
  ];

  useEffect(() => {
    // Generate random position for hidden discount
    const position = Math.floor(Math.random() * 100);
    setHiddenDiscount(position);
  }, []);

  const handleMouseMove = (e) => {
    if (foundDiscount) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if mouse is near hidden discount
    const distance = Math.sqrt(
      Math.pow(x - hiddenDiscount, 2) + 
      Math.pow(y - hiddenDiscount, 2)
    );

    if (distance < 10) { // Within 10% radius
      setFoundDiscount(true);
      const newDiscount = 5; // 5% discount
      setDiscountEarned(prev => prev + newDiscount);
      onDiscountEarned(newDiscount);
    }
  };

  const handleAnswerSelect = (selectedIndex) => {
    if (selectedIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
      const newDiscount = 2; // 2% discount per correct answer
      setDiscountEarned(prev => prev + newDiscount);
      onDiscountEarned(newDiscount);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowQuiz(false);
    }
  };

  return (
    <div className="game-invoice">
      <div className="game-header">
        <h2>Interactive Invoice</h2>
        <div className="discount-info">
          Total Discount Earned: {discountEarned}%
        </div>
      </div>

      <div 
        className="treasure-hunt-area"
        onMouseMove={handleMouseMove}
      >
        <div className="hint-text">
          Move your mouse around to find hidden discounts!
        </div>
        {foundDiscount && (
          <div className="discount-found">
            🎉 You found a 5% discount!
          </div>
        )}
        {/* Regular invoice content */}
        <div className="invoice-content">
          {items.map((item, index) => (
            <div key={index} className="game-invoice-item">
              <span>{item.itemNumber}</span>
              <span>{item.quantity}x</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="quiz-button"
        onClick={() => setShowQuiz(true)}
      >
        Take Quiz for Extra Discount! 🎯
      </button>

      {showQuiz && (
        <div className="quiz-modal">
          <div className="quiz-content">
            <h3>Sustainability Quiz</h3>
            <div className="question">
              {quizQuestions[currentQuestion].question}
            </div>
            <div className="options">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="quiz-progress">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>
        </div>
      )}

      <div className="ar-view-button">
        <button onClick={() => window.open('/ar-invoice', '_blank')}>
          View in AR 🥽
        </button>
      </div>
    </div>
  );
};

export default GameInvoice; 