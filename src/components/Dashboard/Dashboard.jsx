import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";
import ProductSelector from "../Products";
import "./Dashboard.css";

const initialQuizState = {
  title: "Quiz",
  questions: [],
};

const SortableProductItem = ({ id, onRemove, label }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "4px 8px",
    marginRight: "5px",
    backgroundColor: "#ffdb99",
    borderRadius: "4px",
    display: "inline-flex",
    alignItems: "center",
    zIndex: isDragging ? 3 : 0,
    opacity: isDragging ? 0.7 : 1,
    cursor: "default",
    marginBottom: "5px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <span {...listeners} style={{ cursor: "grab", marginRight: "5px" }}>
        ⠿
      </span>
      {label}
      <button
        onClick={() => onRemove(id)}
        style={{
          marginLeft: "5px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "red",
          fontWeight: "bold",
        }}
      >
        x
      </button>
    </div>
  );
};

const ChoiceInput = ({
  choice,
  onChoiceChange,
  onRemove,
  onAttachProduct,
  onReorderProducts,
  getProductLabel,
  onProductsLoaded,
  canDelete,
}) => {
  const onProductDragEnd = (result) => {
    const { active, over } = result;
    if (active.id !== over?.id) {
      const currentIds = Array.isArray(choice.productIds)
        ? choice.productIds
        : [];
      const oldIndex = currentIds.findIndex((id) => id === active.id);
      const newIndex = currentIds.findIndex((id) => id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newProductIds = arrayMove(currentIds, oldIndex, newIndex);
        onReorderProducts(choice.id, newProductIds);
      }
    }
  };

  return (
    <div
      className="choiceInput"
      style={{ border: "1px solid #eee", padding: "10px", margin: "5px 0" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
      >
        <input
          type="text"
          value={choice.label}
          onChange={(e) => onChoiceChange(choice.id, "label", e.target.value)}
        />
        {canDelete && (
          <button onClick={() => onRemove(choice.id)} className="deleteBtn">
            X
          </button>
        )}
      </div>
      <ProductSelector
        onProductAttach={(newProductId) =>
          onAttachProduct(choice.id, newProductId)
        }
        attachedProductIds={choice.productIds || []}
        onProductsLoaded={onProductsLoaded}
      />
      {choice.productIds && choice.productIds.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Attached Products:</strong>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={onProductDragEnd}
          >
            <SortableContext
              items={choice.productIds}
              strategy={verticalListSortingStrategy}
            >
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}
              >
                {choice.productIds.map((productId) => (
                  <SortableProductItem
                    key={productId}
                    id={productId}
                    label={getProductLabel(productId)}
                    onRemove={(id) => onAttachProduct(choice.id, id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

const SortableChoiceItem = ({
  choice,
  onChoiceChange,
  onRemove,
  onAttachProduct,
  onReorderProducts,
  getProductLabel,
  onProductsLoaded,
  canDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: choice.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 0,
    opacity: isDragging ? 0.6 : 1,
    backgroundColor: "white",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span {...listeners} style={{ cursor: "grab", marginRight: "10px" }}>
          ⠿
        </span>
        <ChoiceInput
          choice={choice}
          onChoiceChange={onChoiceChange}
          onRemove={onRemove}
          onAttachProduct={onAttachProduct}
          onReorderProducts={onReorderProducts}
          getProductLabel={getProductLabel}
          onProductsLoaded={onProductsLoaded}
          canDelete={canDelete}
        />
      </div>
    </div>
  );
};

const QuestionBlock = ({
  question,
  onUpdate,
  onDelete,
  products,
  onProductsLoaded,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? "1px dashed #007bff" : "1px solid black",
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : "auto",
    backgroundColor: "white",
    padding: "15px",
    margin: "10px 0px",
    borderRadius: "5px",
  };
  const getProductLabel = (productId) => {
    const product = products.find(
      (p) => p.id.toString() === productId.toString()
    );
    return product ? product.title : `Product ${productId}`;
  };

  const handleTextChange = (e) =>
    onUpdate({ ...question, text: e.target.value });
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let newChoices = question.choices;
    if (newType === "text") {
      newChoices = [];
    } else if (newChoices.length < 2) {
      newChoices = [
        { id: Date.now().toString() + "-1", label: "Choice 1", productIds: [] },
        { id: Date.now().toString() + "-2", label: "Choice 2", productIds: [] },
      ];
    }
    onUpdate({ ...question, type: newType, choices: newChoices });
  };

  const handleAddChoice = () => {
    const newChoice = {
      id: Date.now().toString(),
      label: `New Choice`,
      productIds: [],
    };
    onUpdate({ ...question, choices: [...question.choices, newChoice] });
  };

  const handleChoiceChange = (choiceId, field, value) => {
    const updatedChoices = question.choices.map((c) =>
      c.id === choiceId ? { ...c, [field]: value } : c
    );
    onUpdate({ ...question, choices: updatedChoices });
  };

  const handleRemoveChoice = (choiceId) => {
    if (question.choices.length > 2) {
      const updatedChoices = question.choices.filter((c) => c.id !== choiceId);
      onUpdate({ ...question, choices: updatedChoices });
    }
  };

  const handleAttachProduct = (choiceId, productId) => {
    const productIdStr = productId.toString();
    const updatedChoices = question.choices.map((c) => {
      if (c.id === choiceId) {
        const currentIds = Array.isArray(c.productIds) ? c.productIds : [];
        return {
          ...c,
          productIds: currentIds.includes(productIdStr)
            ? currentIds.filter((id) => id !== productIdStr)
            : [...currentIds, productIdStr],
        };
      }
      return c;
    });
    onUpdate({ ...question, choices: updatedChoices });
  };

  const handleReorderProducts = (choiceId, newProductIds) => {
    const updatedChoices = question.choices.map((c) =>
      c.id === choiceId ? { ...c, productIds: newProductIds } : c
    );
    onUpdate({ ...question, choices: updatedChoices })
  };

  return (
    <div ref={setNodeRef} style={style} className="mainDashboard">
      <div
        className="questionContent"
        style={{ display: "flex", alignItems: "center" }}
      >
        <span
          {...listeners}
          {...attributes}
          style={{ cursor: "grab", marginRight: "10px" }}
        >
          ⠿
        </span>
        <input
          type="text"
          value={question.text}
          onChange={handleTextChange}
          style={{ flexGrow: 1 }}
        />
        <select
          value={question.type}
          onChange={handleTypeChange}
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option value="radio">radio</option>
          <option value="checkbox">checkbox</option>
          <option value="text">text</option>
        </select>
        <button className="deleteBtn" onClick={() => onDelete(question.id)}>
          Delete
        </button>
      </div>
      {question.type !== "text" && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(res) => {
            const { active, over } = res;
            if (active.id !== over?.id) {
              const oldIdx = question.choices.findIndex(
                (c) => c.id === active.id
              );
              const newIdx = question.choices.findIndex(
                (c) => c.id === over.id
              );
              onUpdate({
                ...question,
                choices: arrayMove(question.choices, oldIdx, newIdx),
              });
            }
          }}
        >
          <SortableContext
            items={question.choices.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ marginTop: "10px" }}>
              <h4>Choices:</h4>
              {question.choices.map((choice) => (
                <SortableChoiceItem
                  key={choice.id}
                  choice={choice}
                  onChoiceChange={handleChoiceChange}
                  onRemove={handleRemoveChoice}
                  onAttachProduct={handleAttachProduct}
                  onReorderProducts={handleReorderProducts}
                  getProductLabel={getProductLabel}
                  onProductsLoaded={onProductsLoaded}
                  canDelete={question.choices.length > 2}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      {question.type !== "text" && (
        <button className="choiceBtn" onClick={handleAddChoice}>
          + choice
        </button>
      )}
    </div>
  );
};

function Dashboard() {
  const [quizData, setQuizData] = useState(initialQuizState);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("quizBuilderData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setQuizData(parsedData);
    }
    const savedProducts = localStorage.getItem("quizBuilderProducts");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);


  const handleSave = ()=>{
    localStorage.setItem("quizBuilderData", JSON.stringify(quizData));
    navigate("/")
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: "new question text",
      type: "radio",
      choices: [
        { id: Date.now().toString() + "-1", label: "Choice 1", productIds: [] },
        { id: Date.now().toString() + "-2", label: "Choice 2", productIds: [] },
      ],
    };
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });
  };

  const handleDeleteQuestion = (id) =>
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((q) => q.id !== id),
    });
  const handleUpdateQuestion = (updated) =>
    setQuizData({
      ...quizData,
      questions: quizData.questions.map((q) =>
        q.id === updated.id ? updated : q
      ),
    });

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/")}>HOME</button>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Question Name
        </label>
        <input
          type="text"
          value={quizData.title}
          onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
        />
      </div>
      <hr />
      <h2>Questions({quizData.questions.length})</h2>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(res) => {
          const { active, over } = res;
          if (active.id !== over?.id) {
            const oldIdx = quizData.questions.findIndex(
              (q) => q.id === active.id
            );
            const newIdx = quizData.questions.findIndex(
              (q) => q.id === over.id
            );
            setQuizData({
              ...quizData,
              questions: arrayMove(quizData.questions, oldIdx, newIdx),
            });
          }
        }}
      >
        <SortableContext
          items={quizData.questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="questionList">
            {quizData.questions.map((q) => (
              <QuestionBlock
                key={q.id}
                question={q}
                onUpdate={handleUpdateQuestion}
                onDelete={handleDeleteQuestion}
                products={products}
                onProductsLoaded={(p) => setProducts(p)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div style={{display:"flex",justifyContent: "space-between"}}>
      <button onClick={handleAddQuestion} className="addButton">
        Add New Question
      </button>
      <button className="addButton" onClick={handleSave} >
        Save 
      </button>
      </div>
    </div>
  );
}

export default Dashboard;
