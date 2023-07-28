import "./App.css";
import { useState, useEffect } from "react";
import { Chair } from "./component/Chair.jsx";
function App() {
    const [customerDetails, setCustomerDetails] = useState(null);
    const [roomDetails, setRoomDetails] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const getCustomerDetails = async () => {
        const data = { username: username, password: password };
        const response = await fetch("/customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const customerData = await response.json();
        setCustomerDetails(customerData);
    };

    const getRoomDetails = async () => {
        try {
            const response = await fetch("/chairs");
            const data = await response.json();
            setRoomDetails(data);
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };

    const registerCustomer = async () => {
        const data = { username: registerUsername, password: registerPassword };
        await fetch("/customer/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleRegisterUsernameChange = (event) => {
        setRegisterUsername(event.target.value);
    };
    const handleRegisterPasswordChange = (event) => {
        setRegisterPassword(event.target.value);
    };

    useEffect(() => {
        if (customerDetails) {
            getRoomDetails();
        }
    }, [customerDetails]);

    return (
        <div className="App">
            <div>
                <div style={{ display: customerDetails && "none" }}>
                    <div>Log in:</div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button type="submit" onClick={getCustomerDetails}>
                        Log in
                    </button>
                <div className="register">Register:</div>
                <label>Username</label>
                <input
                    type="text"
                    value={registerUsername}
                    onChange={handleRegisterUsernameChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={registerPassword}
                    onChange={handleRegisterPasswordChange}
                />
                <button type="submit" onClick={registerCustomer}>
                    Register
                </button>
                </div>
            </div>
            {customerDetails && (
                <div>
                    {roomDetails.map((element, index) => (
                        <div key={index}>
                            <Chair
                                chairData={element}
                                customerId={customerDetails[0].id}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
