import { useState, useEffect } from "react";

function ProductSelector({
  onProductAttach,
  attachedProductIds,
  onProductsLoaded,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=20");
        const data = await response.json();
        
        const sanitized = data.map(p => ({
            id: p.id.toString(),
            title: p.title,
            price: p.price,
            description: p.description,
            image: Array.isArray(p.images) && p.images.length > 0 
                   ? p.images[0].replace(/[\[\]"]/g, "") 
                   : null,
        }));

        setProducts(sanitized); 
        localStorage.setItem("quizBuilderProducts", JSON.stringify(sanitized));

        if (onProductsLoaded) {
            onProductsLoaded(sanitized); 
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isSelecting && products.length === 0) {
      fetchProducts();
    } 
  }, [isSelecting]);

  const handleSelect = (productId) => {
    onProductAttach(productId);
  };
  const attachedCount = Array.isArray(attachedProductIds)
    ? attachedProductIds.length
    : 0;
  const buttonText =
    attachedCount > 0 ? `Change (${attachedCount}) Products` : "Attach Product";

  if (!isSelecting) {
    return (
      <div style={{ display: "inline-block", marginLeft: "10px" }}>
        {" "}
        <span
          style={{
            fontSize: "0.9em",
            color: attachedCount > 0 ? "green" : "gray",
            marginRight: "5px",
          }}
        >
          {attachedCount} Products Attached{" "}
        </span>{" "}
        <button
          onClick={() => setIsSelecting(true)}
          style={{
            padding: "4px 8px",
            backgroundColor: "#91f394",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "0.85em",
          }}
        >
          {buttonText}{" "}
        </button>{" "}
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginTop: "10px",
        backgroundColor: "#fff",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      {" "}
      <p style={{ fontWeight: "bold" }}> Chose ONE or MORE Products</p>{" "}
      <button
        onClick={() => setIsSelecting(false)}
        style={{ float: "right", cursor: "pointer" }}
      >
        —
      </button>{" "}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {" "}
          {products.map((product) => {
            const isAttached =
              attachedProductIds &&
              attachedProductIds.includes(product.id.toString());
            return (
              <li
                key={product.id}
                onClick={() => handleSelect(product.id)}
                style={{
                  padding: "5px",
                  borderBottom: "1px dotted #eee",
                  cursor: "pointer",
                  backgroundColor: isAttached ? "#e6ffe6" : "transparent",
                  fontWeight: isAttached ? "bold" : "normal",
                }}
              >
                ID: {product.id} - {product.title} (${product.price}){" "}
              </li>
            );
          })}{" "}
        </ul>
      )}{" "}
    </div>
  );
}

export default ProductSelector;
