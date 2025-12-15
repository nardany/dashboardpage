import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { useNavigate } from 'react-router-dom';
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
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '4px 8px',
    marginRight: '5px',
    backgroundColor: '#ffdb99',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    zIndex: isDragging ? 3 : 0,
    opacity: isDragging ? 0.7 : 1,
    cursor: 'default',
    marginBottom: '5px'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <span 
        {...listeners} 
        style={{ cursor: 'grab', marginRight: '5px' }}
      >
        ⠿
      </span>
      {label}
      <button 
        onClick={() => onRemove(id)} 
        style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
      >
        x
      </button>
    </div>
  );
};


const ChoiceInput = ({ choice, onChoiceChange, onRemove, onAttachProduct, onReorderProducts, getProductLabel }) => {
  const onProductDragEnd = (result) => {
    const { active, over } = result;
    if (active.id !== over?.id) {
        const currentIds = Array.isArray(choice.productIds) ? choice.productIds : [];
        const oldIndex = currentIds.findIndex(id => id === active.id);
        const newIndex = currentIds.findIndex(id => id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newProductIds = arrayMove(currentIds, oldIndex, newIndex);
            onReorderProducts(choice.id, newProductIds);
        }
    }
  };

  const handleRemoveAttachedProduct = (productId) => {
    onAttachProduct(choice.id, productId);
  };

  return (
    <div className="choiceInput" style={{ border: "1px solid #eee", padding: "10px", margin: "5px 0" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
        <input
          type="text"
          value={choice.label}
          onChange={(e) => onChoiceChange(choice.id, "label", e.target.value)}
        />
        <button onClick={() => onRemove(choice.id)} className="deleteBtn">
          X
        </button>
      </div>

      <ProductSelector
        onProductAttach={(newProductId) => onAttachProduct(choice.id, newProductId)}
        attachedProductIds={choice.productIds || []}
      />
      
      {(choice.productIds && choice.productIds.length > 0) && (
        <div style={{ marginTop: '10px' }}>
          <strong>Attached Products:</strong>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={onProductDragEnd}
          >
            <SortableContext
              items={choice.productIds}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '5px' }}>
                {choice.productIds.map((productId) => (
                  <SortableProductItem
                    key={productId}
                    id={productId}
                    label={getProductLabel(productId)} 
                    onRemove={handleRemoveAttachedProduct}
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


const SortableChoiceItem = ({ choice, onChoiceChange, onRemove, onAttachProduct, onReorderProducts, getProductLabel }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: choice.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 0, 
    opacity: isDragging ? 0.6 : 1,
    backgroundColor: 'white',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span 
          {...listeners} 
          style={{ cursor: 'grab', marginRight: '10px' }}
        >
          ⠿
        </span>
        <ChoiceInput
          choice={choice}
          onChoiceChange={onChoiceChange}
          onRemove={onRemove}
          onAttachProduct={onAttachProduct}
          onReorderProducts={onReorderProducts}
          getProductLabel={getProductLabel}
        />
      </div>
    </div>
  );
};


const QuestionBlock = ({ question, onUpdate, onDelete, products }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: question.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      border: isDragging ? '1px dashed #007bff' : '1px solid black',
      opacity: isDragging ? 0.6 : 1,
      zIndex: isDragging ? 1 : 'auto',
      backgroundColor: 'white', 
      padding: "15px",
      margin: "10px 0px",
      borderRadius: "5px",
    };

  const getProductLabel = (productId) => {
    const product = products.find(p => p.id.toString() === productId.toString());
    return product ? product.name : `Product ${productId}`;
  };

  const handleTextChange = (e) => {
    onUpdate({ ...question, text: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onUpdate({
      ...question,
      type: newType,
      choices: newType === "text" ? [] : question.choices,
    });
  };

  const handleAddChoice = () => {
    const newChoice = {
      id: Date.now().toString(),
      label: `New Choice`,
      productIds: [],
    };
    onUpdate({
      ...question,
      choices: [...question.choices, newChoice],
    });
  };

  const handleChoiceChange = (choiceId, field, value) => {
    const updatedChoices = question.choices.map((c) =>
      c.id === choiceId ? { ...c, [field]: value } : c
    );
    onUpdate({ ...question, choices: updatedChoices });
  };
  const handleRemoveChoice = (choiceId) => {
    const updatedChoices = question.choices.filter((c) => c.id !== choiceId);
    onUpdate({ ...question, choices: updatedChoices });
  };
  
  const handleAttachProduct = (choiceId, productId) => {
    const productIdStr = productId.toString();
    const updatedChoices = question.choices.map((c) => {
      if (c.id === choiceId) {
        const currentIds = Array.isArray(c.productIds) ? c.productIds : [];

        if (currentIds.includes(productIdStr)) {
          return {
            ...c,
            productIds: currentIds.filter((id) => id !== productIdStr),
          };
        }
        return { ...c, productIds: [...currentIds, productIdStr] };
      }
      return c;
    });
    onUpdate({ ...question, choices: updatedChoices });
  };

  const handleReorderProducts = (choiceId, newProductIds) => {
    const updatedChoices = question.choices.map((c) => {
        if (c.id === choiceId) {
            return { ...c, productIds: newProductIds };
        }
        return c;
    });
    onUpdate({ ...question, choices: updatedChoices });
  };
  
  const isChoiceBased = question.type !== "text";

  const onChoiceDragEnd = (result) => {
    const { active, over } = result;

    if (active.id !== over?.id) {
        const oldIndex = question.choices.findIndex(c => c.id === active.id);
        const newIndex = question.choices.findIndex(c => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newChoices = arrayMove(question.choices, oldIndex, newIndex);
            onUpdate({ ...question, choices: newChoices });
        }
    }
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mainDashboard"
    >
      <div className="questionContent" style={{ display: 'flex', alignItems: 'center' }}>
        <span 
          {...listeners} 
          {...attributes} 
          style={{ cursor: 'grab', marginRight: '10px' }}
        >
          ⠿
        </span>
        <input type="text" value={question.text} onChange={handleTextChange} style={{ flexGrow: 1 }} />
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

      {isChoiceBased && (
        <DndContext 
          collisionDetection={closestCenter} 
          onDragEnd={onChoiceDragEnd}
        >
          <SortableContext
            items={question.choices.map(c => c.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div style={{ marginTop: '10px' }}>
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <button className="choiceBtn" onClick={handleAddChoice}>
        + choice
      </button>
    </div>
  );
};



function Dashboard() {
  const [quizData, setQuizData] = useState(initialQuizState);
  const [products, setProducts] = useState([]);
    const navigate = useNavigate(); 

  const handleNavigate =()=>{
      navigate("/")
  }

  useEffect(() => {
    setProducts([
        { id: '101', name: 'Product A' },
        { id: '102', name: 'Product B' },
        { id: '103', name: 'Product C' },
    ]);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("quizBuilderData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const sanitizedQuestions = parsedData.questions.map((q) => ({
          ...q,
          choices: q.choices.map((c) => ({
            ...c, 
            productIds: c.productId
              ? [c.productId]
              : Array.isArray(c.productIds)
              ? c.productIds
              : [],
            productId: undefined, 
          })),
        }));

        setQuizData({ ...parsedData, questions: sanitizedQuestions });
      } catch (e) {
        console.error("Error", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quizBuilderData", JSON.stringify(quizData));
  }, [quizData]);

  const handleTitleChange = (e) => {
    setQuizData({ ...quizData, title: e.target.value });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: "new question text",
      type: "radio",
      choices: [],
    };
    setQuizData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, newQuestion],
    }));
  };

  const handleDeleteQuestion = (questionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
  };
  
  const onQuestionDragEnd = (result) => {
    const { active, over } = result;

    if (active.id !== over?.id) {
        setQuizData((prevData) => {
            const oldIndex = prevData.questions.findIndex(q => q.id === active.id);
            const newIndex = prevData.questions.findIndex(q => q.id === over.id);

            if (oldIndex === -1 || newIndex === -1) return prevData;

            const newQuestions = arrayMove(prevData.questions, oldIndex, newIndex);
            return { ...prevData, questions: newQuestions };
        });
    }
  };

  return (
    <div className="dashboard">
      <h1> Dashboard</h1>
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="quizTitle"
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Question Name
        </label>
        <input
          id="quizTitle"
          type="text"
          value={quizData.title}
          onChange={handleTitleChange}
        />
      </div>
      <hr /> <h2>Questions({quizData.questions.length})</h2>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onQuestionDragEnd}
      >
        <SortableContext
          items={quizData.questions.map(q => q.id)} 
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={handleAddQuestion} className="addButton">
        Add New Question
      </button>
      <button onClick={handleNavigate}>
        HOME
      </button>
    </div>
  );
}

export default Dashboard;