import "./Result.css"

function Result(){
    return(
    <div className="mainResult">
      <div className="content">
        <span style={{ color: "#333", textAlign: "center",fontSize: "36px" }}>
         Your Hair type is: <span>Oily</span>
        </span>
        <div className="resultContent">
          <p style={{fontSize: "22px",textAlign : "center"}}>
           Lorem ipsum dolor sit amet consectetur. Habitant sit fermentum ut nisl quam.. 
           Adipiscing consequat quis erat consequat lorem quis arcu.. 
           Lorem hendrerit purus orci lorem eu ut commodo.. 
           Duis convallis mattis hac habitant nibh sit..
            Nunc nam sed elit cras diam donec amet.. 
            Donec nam nibh condimentum justo volutpat porta nunc ac..
          </p>
        </div>
        <div>
            <h2 className="productTitle">Products we recommend for you:</h2>
        </div>
      </div>
    </div>
  );
}
export default Result