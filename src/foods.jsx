import { useEffect, useState, useRef } from "react";
import InstallPWAButton from "./InstallPWAButton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function FoodList() {
  const [darkMode, setDarkMode] = useState(true);
  const [foods, setFoods] = useState([]);
  const [addList, setAddList] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({ name: "", quantity: "", amount: "" });
  const [savedLists, setSavedLists] = useState(() => JSON.parse(localStorage.getItem("shoppingLists")) || {});
  const [currentListName, setCurrentListName] = useState("");
  const listRef = useRef(null);

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    const total = foods.reduce((sum, food) => sum + (parseFloat(food.amount) || 0), 0);
    setTotalAmount(total);
  }, [foods]);

  const handleAddList = () => {
    if (!addList.trim()) return;
    setFoods(prev => [
      ...prev,
      { sn: prev.length, name: addList, quantity: quantity || 1, amount: amount || 0 },
    ]);
    setAddList("");
    setQuantity("");
    setAmount("");
  };

  const handleRemoveItems = (index) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setFoods(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearList = () => {
    if (window.confirm("Are you sure you want to clear the entire list?")) {
      setFoods([]);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditRow({ ...foods[index] });
  };

  const handleUpdate = (index) => {
    setFoods(prev => prev.map((item, i) => i === index ? { ...item, ...editRow } : item));
    setEditIndex(null);
    setEditRow({ name: "", quantity: "", amount: "" });
  };

  const handleDownloadSnapshot = async () => {
    const element = listRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    pdf.text(`Shopping List - ${formattedDate}`, 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0);
    pdf.save(`Shopping_List_${formattedDate}.pdf`);
  };

  const handleShare = () => {
    const text = foods.map(f => `${f.name} (${f.quantity}) - ₦${f.amount}`).join("\n");
    const body = encodeURIComponent(`My Shopping List:\n\n${text}\n\nTotal: ₦${totalAmount}`);
    window.open(`https://wa.me/?text=${body}`, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("My Shopping List");
    const body = encodeURIComponent(
      foods.map(f => `${f.name} (${f.quantity}) - ₦${f.amount}`).join("\n") + `\n\nTotal: ₦${totalAmount}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSaveList = () => {
    const name = prompt("Enter a name for this list:");
    if (!name) return;

    const updatedLists = {
      ...savedLists,
      [name]: foods,
    };

    localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
    setSavedLists(updatedLists);
    setCurrentListName(name);
  };

  const handleLoadList = (name) => {
    setFoods(savedLists[name] || []);
    setCurrentListName(name);
  };

  const handleDeleteList = (name) => {
    if (window.confirm(`Delete saved list "${name}"?`)) {
      const updatedLists = { ...savedLists };
      delete updatedLists[name];
      localStorage.setItem("shoppingLists", JSON.stringify(updatedLists));
      setSavedLists(updatedLists);

      if (name === currentListName) {
        setFoods([]);
        setCurrentListName("");
      }
    }
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
      marginBottom: "10px",
      marginRight: "10px",
      transition: "background-color 1s ease, color 0.3s ease",
      boxShadow: darkMode ? "0 2px 5px rgba(123, 121, 121, 0.2)" : "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div style={styles.page} className="container">
      <h2>
        <img className="headericon" src="/shopping-list2.png" alt="List Icon" /> MY SHOPPING LIST
      </h2>
      <button onClick={toggleTheme}>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</button>
      <InstallPWAButton />

      <div ref={listRef}>
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
      </div>

      {foods.length > 0 && (
        <>
          <h3>Total Amount: ₦{totalAmount}</h3>
          <button onClick={clearList}>Clear List</button>
          <button onClick={handleDownloadSnapshot}>📥 Download List</button>
          <button onClick={handleSaveList}>💾 Save This List</button>
          <br />
          <button onClick={handleShare}>📤 Share on WhatsApp</button>
          <button onClick={handleEmailShare}>✉️ Share via Email</button>
        </>
      )}

      <div>
        <h4>Load Saved List:</h4>
        {Object.keys(savedLists).length === 0 && <p>No saved lists found.</p>}
        {Object.keys(savedLists).map(name => (
          <div key={name} style={{ marginBottom: "8px" }}>
            <button onClick={() => handleLoadList(name)}>{name}</button>
            <button onClick={() => handleDeleteList(name)} style={{ marginLeft: "2px"}}>                      <img className="delicon" src="/delete.png" alt="Delete" /></button>
          </div>
        ))}

        <p><b>Add Item(s) to buy Below</b></p>
        <label>
          <b>Items: </b><br />
          <input
            type="text"
            value={addList}
            onChange={(e) => setAddList(e.target.value)}
            placeholder="Rice, Milk, Fish, Garri etc...."
            onKeyDown={(e) => e.key === "Enter" && handleAddList()}
          /><br />
          <b>Quantity: </b><br />
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Derica, Pcs, Kg, Paint, etc..."
            onKeyDown={(e) => e.key === "Enter" && handleAddList()}
          /><br />
          <b>Amount: ₦ </b><br />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            onKeyDown={(e) => e.key === "Enter" && handleAddList()}
          />
        </label><br />
        <button onClick={handleAddList}>
          <img className="addicon" src="/add-to-cart.png" alt="Add" /> <br /> Add Item
        </button>
      </div>
    </div>
  );
}

export default FoodList;
