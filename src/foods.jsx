import { useState } from "react";
import { useEffect } from "react";

// Main component for the shopping list
function FoodList() {
    // State for the list of foods. Each food has sn, name, quantity, and amount.
    const [foods, setFoods] = useState([
        { sn: "", name: "", quantity: "", amount: "" },
    ]);
    // State for the input fields
    const [addList, setAddList] = useState("");
    const [quantity, setQuantity] = useState("");
    const [amount, setAmount] = useState("");
    // State for the total amount calculation
    const [totalAmount, setTotalAmount] = useState(0);

    // Add a new item to the foods list
    function handleAddList() {
        if (addList.trim() === "") return; // Prevent adding empty items
        setFoods(f => [
            ...f,
            {
                sn: f.length + 1, // Serial number based on list length
                name: addList,
                quantity: quantity || 1,
                amount: amount || 0
            }
        ]);
        // Reset input fields after adding
        setAddList("");
        setQuantity("");
        setAmount("");
    }

    // Remove an item from the list by index, with confirmation
    function handleRemoveItems(index) {
        if (window.confirm('Are you sure you want to remove this item?'))
            setFoods(prevFoods => {
                const newFoods = prevFoods.filter((_, i) => i !== index);
                return newFoods;
            });
    }

    // Clear the entire list, with confirmation
    function clearList() {
        if (window.confirm('Are you sure you want to clear the entire list?')) {
            setFoods([]);
        }
    }

    // Update totalAmount whenever foods changes
    useEffect(() => {
        const total = foods.reduce(
            (sum, food) => sum + (parseFloat(food.amount) || 0),
            0
        );
        setTotalAmount(total);
    }, [foods]);

    // State for editing rows
    const [editIndex, setEditIndex] = useState(null);
    const [editRow, setEditRow] = useState({ name: "", quantity: "", amount: "" });

    // Start editing a row
    function handleEdit(index) {
        setEditIndex(index);
        setEditRow({
            name: foods[index].name,
            quantity: foods[index].quantity,
            amount: foods[index].amount,
        });
    }

    // Update the row after editing
    function handleUpdate(index) {
        setFoods(foods.map((f, i) =>
            i === index ? { ...f, ...editRow } : f
        ));
        setEditIndex(null);
        setEditRow({ name: "", quantity: "", amount: "" });
    }

    return (
        <>
            <h2>MY SHOPPING LIST</h2>
            {/* Table displaying the list of foods */}
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Amount (₦)</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food, index) => (
                        <tr key={index}>
                            <td>{food.sn}</td>
                            <td>
                                {editIndex === index ? (
                                    // Editable input for name
                                    <input
                                        type="text"
                                        value={editRow.name}
                                        onChange={e => setEditRow({ ...editRow, name: e.target.value })}
                                    />
                                ) : (
                                    food.name
                                )}
                            </td>
                            <td>
                                {editIndex === index ? (
                                    // Editable input for quantity
                                    <input
                                        type="text"
                                        value={editRow.quantity}
                                        onChange={e => setEditRow({ ...editRow, quantity: e.target.value })}
                                    />
                                ) : (
                                    food.quantity
                                )}
                            </td>
                            <td>
                                {editIndex === index ? (
                                    // Editable input for amount
                                    <input
                                        type="number"
                                        value={editRow.amount}
                                        onChange={e => setEditRow({ ...editRow, amount: e.target.value })}
                                    />
                                ) : (
                                    food.amount
                                )}
                            </td>
                            {/* Edit and Delete buttons */}
                            {editIndex === index ? (
                                <button className="editbtn" onClick={() => handleUpdate(index)}>Update</button>
                            ) : (
                                <button className="editbtn" onClick={() => handleEdit(index)}>Edit</button>
                            )}
                            <button className="deletbtn" onClick={() => handleRemoveItems(index)}>Delete</button>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Display the total amount */}
            <h3 className="total">Total Amount: ₦{totalAmount}</h3><br />
            <button onClick={clearList}>Clear List</button>
            
            {/* Form to add new items */}
            <p><b>Add Item(s) to buy Below</b></p>
            <label>
                Items:{" "}
                <input
                    type="text"
                    value={addList}
                    onChange={e => setAddList(e.target.value)}
                    placeholder="Rice, Milk, Fish, Garri etc...."
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleAddList();
                        }
                    }}
                />
                <br />
                Quantity:{" "}
                <input
                    type="any"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="Derica, Pcs, Kg, Paint, etc..."
                    min="1"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleAddList();
                        }
                    }}
                />
                <br />
                Amount: ₦
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter Amount"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleAddList();
                        }
                    }}
                />
            </label>
            <br />
            <button className="Addbtn" onClick={handleAddList}>Add Item</button>
        </>
    );
}

export default FoodList;