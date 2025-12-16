import { useState, useEffect } from "react";
import ImgDefault from "../../assets/defaultimg.jpg";
import "./Result.css";

const StarIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.46199 2.58999C8.63485 2.23978 8.72128 2.06468 8.83862 2.00874C8.94071 1.96006 9.05931 1.96006 9.1614 2.00874C9.27874 2.06468 9.36517 2.23978 9.53804 2.58999L11.178 5.91246C11.2291 6.01585 11.2546 6.06755 11.2919 6.10768C11.3249 6.14322 11.3645 6.17201 11.4085 6.19247C11.4582 6.21557 11.5152 6.2239 11.6293 6.24058L15.2977 6.77678C15.684 6.83324 15.8772 6.86148 15.9666 6.95583C16.0444 7.03792 16.0809 7.15072 16.0661 7.26283C16.0491 7.39168 15.9093 7.52788 15.6296 7.80029L12.9761 10.3848C12.8934 10.4654 12.852 10.5057 12.8253 10.5536C12.8017 10.596 12.7865 10.6427 12.7807 10.6909C12.7741 10.7453 12.7838 10.8022 12.8034 10.9161L13.4295 14.5666C13.4955 14.9516 13.5285 15.1441 13.4665 15.2584C13.4125 15.3578 13.3165 15.4275 13.2053 15.4481C13.0775 15.4718 12.9046 15.3809 12.5588 15.1991L9.27928 13.4744C9.1771 13.4206 9.12601 13.3938 9.07218 13.3832C9.02452 13.3739 8.9755 13.3739 8.92784 13.3832C8.87402 13.3938 8.82293 13.4206 8.72074 13.4744L5.44119 15.1991C5.09544 15.3809 4.92256 15.4718 4.79473 15.4481C4.68351 15.4275 4.58754 15.3578 4.53355 15.2584C4.4715 15.1441 4.50452 14.9516 4.57056 14.5666L5.19666 10.9161C5.21618 10.8022 5.22594 10.7453 5.21934 10.6909C5.21349 10.6427 5.19833 10.596 5.1747 10.5536C5.14802 10.5057 5.10666 10.4654 5.02394 10.3848L2.37042 7.80029C2.09075 7.52788 1.95091 7.39168 1.93389 7.26283C1.91909 7.15072 1.95567 7.03792 2.03344 6.95583C2.12283 6.86148 2.31598 6.83324 2.70228 6.77678L6.37073 6.24058C6.48482 6.2239 6.54186 6.21557 6.59154 6.19247C6.63552 6.17201 6.67512 6.14322 6.70814 6.10768C6.74543 6.06755 6.77095 6.01585 6.82198 5.91246L8.46199 2.58999Z"
        fill="#F9C254"
        stroke="#F9C254"
      />
    </svg>
  );
};

function Result() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("userQuizAnswers");
    const savedProducts = localStorage.getItem("quizBuilderProducts");

    if (savedAnswers && savedProducts) {
      try {
        const answers = JSON.parse(savedAnswers);
        const allProducts = JSON.parse(savedProducts);
        setUserAnswers(answers);

        const productCounts = {};
        const answersArray = Array.isArray(answers) ? answers : [];

        answersArray.forEach((answer) => {
          if (answer && answer.productIds && Array.isArray(answer.productIds)) {
            answer.productIds.forEach((id) => {
              const cleanId = id.toString();
              productCounts[cleanId] = (productCounts[cleanId] || 0) + 1;
            });
          }
        });

        const countsArray = Object.values(productCounts);

        if (countsArray.length > 0) {
          const maxScore = Math.max(...countsArray);
          const topProductIds = Object.keys(productCounts).filter(
            (id) => productCounts[id] === maxScore
          );
          const topProducts = allProducts.filter((p) =>
            topProductIds.includes(p.id.toString())
          );

          setRecommendedProducts(topProducts);
        }
      } catch (e) {
        console.error("Error logic:", e);
      }
    }
  }, []);

  return (
    <div className="mainResult">
      <div className="content">
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Your Hair type is:{" "}
            <span
              style={{
                color: "#1F7984",
                textTransform: "uppercase",
                borderBottom: "2px solid #1F7984",
              }}
            >
              OILY
            </span>
          </span>
        </header>

        <div className="resultContent">
          {recommendedProducts.length > 0 ? (
            <p style={{ fontSize: "20px", textAlign: "center", color: "#555" }}>
              Lorem ipsum dolor sit amet consectetur. Habitant sit fermentum ut
              nisl quam.. Adipiscing consequat quis erat consequat lorem quis
              arcu.. Lorem hendrerit purus orci lorem eu ut commodo.. Duis
              convallis mattis hac habitant nibh sit.. Nunc nam sed elit cras
              diam donec amet.. Donec nam nibh condimentum justo volutpat porta
              nunc ac..{" "}
            </p>
          ) : (
            <div className="noProductsMessage">
              <p>No products found. Please complete the quiz.</p>
            </div>
          )}
        </div>

        {recommendedProducts.length > 0 && (
          <div style={{ width: "100%" }}>
            <p className="productTitle">Products we recommend for you:</p>
            <div className="productsGrid">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="productCard">
                  <div className="productImageContainer">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="productImg"
                      />
                    ) : (
                      <img
                        src={ImgDefault}
                        alt={product.title}
                        className="productImg"
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div className="starReview">
                      <div>
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                      </div>
                      <div>
                        <p className="reviewText">10 reviews</p>
                      </div>
                    </div>
                    <div className="productItmes">
                      <h3 className="productName">{product.title}</h3>
                      <span className="productPrice">${product.price}</span>
                    </div>
                    <button className="cartBtn">Add to cart</button>
                    <div className="productFooter">
                      <p className="productDesc">
                        {product.description
                          ? `${product.description.substring(0, 70)}...`
                          : "No description available"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
