import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Home.css";

function Home() {
  const [hasQuestions, setHasQuestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("quizBuilderData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.questions && parsedData.questions.length > 0) {
          setHasQuestions(true);
        } else {
          setHasQuestions(false);
        }
      } catch (e) {
        setHasQuestions(false);
      }
    }
  }, []);

  const handleNavigate = () => {
    if (hasQuestions) {
      navigate("/questions");
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="main">
      <button style={{ marginBottom: "15px" }} className='toDashboardPage' onClick={handleDashboard}>
        Dashboard
      </button>
      <div className="content contentHome">
        <p className="header">FIND OUT YOUR HAIR TYPE</p>
        <div className="infoContent">
          <p className="info">
            Answer a few questions and receive customized result and product
            recommendations specifically for your hair type.
          </p>
        </div>
        <button
          className={`takeBtn ${!hasQuestions ? "disabledBtn" : ""}`}
          onClick={handleNavigate}
          disabled={!hasQuestions}
          style={{
            cursor: hasQuestions ? "pointer" : "not-allowed"
          }}
        >
          {hasQuestions ? "Take Our Quiz" : "Not ready yet"}
        </button>

        {!hasQuestions && (
          <p style={{ color: "red", marginTop: "10px", fontSize: "0.8em" }}>
            The admin hasn't added any questions yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;