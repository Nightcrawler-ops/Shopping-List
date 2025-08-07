import { useEffect, useState } from "react";

function FoodList() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const styles = {
    page: {
      backgroundColor: darkMode ? "#121212" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      minHeight: "100vh",
      padding: "20px",
      transition: "all 1s ease",
    },
    button: {
      padding: "10px 16px",
      backgroundColor: darkMode ? "#333333" : "#dddddd",
      color: darkMode ? "#ffffff" : "#000000",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      marginBottom: "20px",
      transition: "background-color 1s ease, color 0.3s ease",
      boxShadow: darkMode ? "0 2px 5px rgba(123, 121, 121, 0.2)" : "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
  };

  const [foods, setFoods] = useState([]);
  const [addList, setAddList] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({ name: "", quantity: "", amount: "" });

  function handleAddList() {
    if (addList.trim() === "") return;
    setFoods((f) => [
      ...f,
      {
        sn: f.length,
        name: addList,
        quantity: quantity || 1,
        amount: amount || 0,
      },
    ]);
    setAddList("");
    setQuantity("");
    setAmount("");
  }

  function handleRemoveItems(index) {
    if (window.confirm("Are you sure you want to remove this item?"))
      setFoods((prevFoods) => prevFoods.filter((_, i) => i !== index));
  }

  function clearList() {
    if (window.confirm("Are you sure you want to clear the entire list?")) {
      setFoods([]);
    }
  }

  useEffect(() => {
    const total = foods.reduce(
      (sum, food) => sum + (parseFloat(food.amount) || 0),
      0
    );
    setTotalAmount(total);
  }, [foods]);

  function handleEdit(index) {
    setEditIndex(index);
    setEditRow({
      name: foods[index].name,
      quantity: foods[index].quantity,
      amount: foods[index].amount,
    });
  }

  function handleUpdate(index) {
    setFoods(
      foods.map((f, i) => (i === index ? { ...f, ...editRow } : f))
    );
    setEditIndex(null);
    setEditRow({ name: "", quantity: "", amount: "" });
  }

return (
  <div style={styles.page} className="container">
    <h2>
      <img className="headericon" src="/add-to-cart.png" alt="Cart Icon" /> MY SHOPPING LIST
    </h2>

    <button onClick={toggleTheme} style={styles.button}>
      {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>

    <table border="1" cellPadding="8" cellSpacing="0">
      <thead>
        <tr>
          <th>SN</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Amount (₦)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {foods.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: "center", padding: "20px", fontStyle: "italic", color: "gray" }}>
              🛒 Your shopping list is empty. Add items below to get started!
            </td>
          </tr>
        ) : (
          foods.map((food, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editRow.name}
                    onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
                  />
                ) : (
                  food.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editRow.quantity}
                    onChange={(e) => setEditRow({ ...editRow, quantity: e.target.value })}
                  />
                ) : (
                  food.quantity
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editRow.amount}
                    onChange={(e) => setEditRow({ ...editRow, amount: e.target.value })}
                  />
                ) : (
                  food.amount
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button onClick={() => handleUpdate(index)}>Update</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>
                    <img className="editicon" src="/edit.png" alt="edit" />
                  </button>
                )}
                <button className="deletebtn" onClick={() => handleRemoveItems(index)}>
                  <img className="delicon" src="/delete.png" alt="Delete" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {foods.length > 0 && (
      <>
        <h3>Total Amount: ₦{totalAmount}</h3>
        <button onClick={clearList}>Clear List</button>
      </>
    )}

    <p><b>Add Item(s) to buy Below</b></p>
    <label>
      <b>Items: </b>{" "}
      <input
        type="text"
        value={addList}
        onChange={(e) => setAddList(e.target.value)}
        placeholder="Rice, Milk, Fish, Garri etc...."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddList();
        }}
      />
      <br />
      <b>Quantity: </b>{" "}
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Derica, Pcs, Kg, Paint, etc..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddList();
        }}
      />
      <br />
      <b>Amount: ₦ </b>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddList();
        }}
      />
    </label>
    <br />
    <button onClick={handleAddList}>
      <img className="addicon" src="/add-to-cart.png" alt="Add" /> <br /> Add Item
    </button>
  </div>
);
}


export default FoodList;
