import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Question.css";
const getInitialAnswersState = (questions) => {
  return questions.reduce((acc, q) => {
    acc[q.id] = q.type === "checkbox" ? [] : "";
    return acc;
  }, {});
};
const BackIcon = () => {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 7L1 7M1 7L7 13M1 7L7 1"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const NextIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H20M20 12L14 6M20 12L14 18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
function Question() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuizData = localStorage.getItem("quizBuilderData");

    if (savedQuizData) {
      try {
        const data = JSON.parse(savedQuizData);
        const questions = data.questions || [];

        setQuizQuestions(questions);
        setUserAnswers(getInitialAnswersState(questions));
      } catch (e) {
        setQuizQuestions([]);
        setUserAnswers({});
      }
    }
  }, []);

  const questionsCount = quizQuestions.length;
  if (questionsCount === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading</h1>
        <p>Error</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questionsCount - 1;
  const isAnswerValid = () => {
    const answer = userAnswers[currentQuestion.id];
    const questionType = currentQuestion.type;

    if (questionType === "text") {
      return typeof answer === "string" && answer.trim() !== "";
    } else if (questionType === "radio" || questionType === "checkbox") {
      if (questionType === "radio") {
        return typeof answer === "string" && answer !== "";
      } else if (questionType === "checkbox") {
        return Array.isArray(answer) && answer.length > 0;
      }
    }
    return true;
  };
  const handleNext = () => {
    if (!isAnswerValid()) {
      setShowValidation(true); 
      return;
    }
    setShowValidation(false);
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setUserAnswers((prevAnswers) => {
      const questionType = quizQuestions.find((q) => q.id === questionId).type;

      if (questionType === "checkbox") {
        const currentChoices = prevAnswers[questionId];
        if (currentChoices.includes(value)) {
          return {
            ...prevAnswers,
            [questionId]: currentChoices.filter((v) => v !== value),
          };
        } else {
          return { ...prevAnswers, [questionId]: [...currentChoices, value] };
        }
      } else {
        return { ...prevAnswers, [questionId]: value };
      }
    });
  };

 const handleResult = () => {
  if (!isAnswerValid()) {
    setShowValidation(true);
    return;
  }
  const selectedChoicesObjects = [];
  quizQuestions.forEach((question) => {
    const answerValue = userAnswers[question.id];
    if (question.type === "radio") {
      const selectedChoice = question.choices.find(c => c.id === answerValue);
      if (selectedChoice) selectedChoicesObjects.push(selectedChoice);
    } 
    else if (question.type === "checkbox") {
      if (Array.isArray(answerValue)) {
        answerValue.forEach(choiceId => {
          const selectedChoice = question.choices.find(c => c.id === choiceId);
          if (selectedChoice) selectedChoicesObjects.push(selectedChoice);
        });
      }
    }
  });
  localStorage.setItem("userQuizAnswers", JSON.stringify(selectedChoicesObjects));
  navigate("/result");
};
  const renderQuestion = (q) => {
    const currentAnswer =
      userAnswers[q.id] || (q.type === "checkbox" ? [] : "");
      const isOddCount = q.choices.length % 2 !== 0; 
       const containerClass = `options-container ${isOddCount ? 'odd-count-center' : ''}`;
    switch (q.type) {
      case "radio":
        return (
          <div className={containerClass}>
            {q.choices.map((choice) => (
              <div key={choice.id}>
                <input
                  type="radio"
                  id={`radio-${q.id}-${choice.id}`}
                  name={q.id}
                  value={choice.id}
                  checked={currentAnswer === choice.id}
                  onChange={() => handleAnswerChange(q.id, choice.id)}
                />
                <label
                  htmlFor={`radio-${q.id}-${choice.id}`}
                  className="btn-choice radio-choice"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div  className={containerClass}>
            {q.choices.map((choice) => (
              <div key={choice.id}>
                <input
                  type="checkbox"
                  id={`checkbox-${q.id}-${choice.id}`}
                  value={choice.id}
                  checked={
                    Array.isArray(currentAnswer) &&
                    currentAnswer.includes(choice.id)
                  }
                  onChange={() => handleAnswerChange(q.id, choice.id)}
                />
                <label
                  htmlFor={`checkbox-${q.id}-${choice.id}`}
                  className="btn-choice checkbox-choice"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "text":
        return (
          <div style={{ padding: "10px 0" }}>
            <input
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="textInput"
              placeholder="Type here..."
            />
          </div>
        );
      default:
        return <p>{q.type}</p>;
    }
  };

  return (
    <div className="mainQuestion">
      <div className="contentQuestion">
        <h2 style={{ color: "#333", textAlign: "center" }}>
          Question {currentQuestionIndex + 1} of {questionsCount}
        </h2>
        <div className="renderQuestion">
          <h1 className="questionTitle">{currentQuestion.text}</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Vel leo leo porta orci
            tellus. Aliquam sit hendrerit cras laoreet massa dui.
          </p>
          <div>{renderQuestion(currentQuestion)}</div>
        </div>
        <div className="buttonMainContent">
          <div
            className="buttonContent"
            onClick={handlePrevious}
            >
            <BackIcon />
          <button
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Back
          </button>
          </div>

          {isLastQuestion ? (
            <div
             className="buttonContent"
             onClick={handleResult}
             >
            <button
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Next
            </button>
              <NextIcon/>
            </div>
          ) : (
            <div
              onClick={handleNext}
              className="buttonContent">
            <button
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Next
            </button>
              <NextIcon/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Question;