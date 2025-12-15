import { useNavigate } from 'react-router-dom';
import "./Home.css";

function Home(){
  const navigate = useNavigate(); 

  const handleNavigate =()=>{
      navigate("/questions")
  }
  
    return(
    <div className="main">
      <div className="content">
        <p className="header">FIND OUT YOUR HAIR TYPE</p>
        <div className="infoContent">
          <p className="info">
            Answer a few questions and receive customized result and product
            recommendations specifically for your hair type.
          </p>
        </div>
        <button className="takeBtn" onClick={handleNavigate}>Take Our Quiz</button>
      </div>
    </div>
    )
}
export default Home