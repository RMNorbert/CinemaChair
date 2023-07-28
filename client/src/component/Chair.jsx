import { useState, useEffect } from "react";

export const Chair = ({ chairData, customerId }) => {
    const [isHidden, setIsHidden] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [email, setEmail] = useState('');
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    let timeoutId;    

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const reserve = async (id, changeStatusTo) => {
        setIsHidden(true);
        const data = { status: changeStatusTo };
        await fetch("/chairs/reserve/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        timeoutId = setTimeout(() => {
              if(!purchased){
                changeStatus(id, "free");
            }
        }, "12000");
    };

    const changeStatus = async (id, updateStatus) => {
        const data = { status: updateStatus };
        await fetch("/chairs/status/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setIsHidden(false);
    };

    useEffect(() => {
        return () => {clearTimeout(timeoutId);}
    });

    const purchase = async (customer, chairId, providedEmail) => {
        const emailValidation = emailRegex.test(email); 
        if(emailValidation){
            const data = {
                customer: customer,
                chair: chairId,
                email: providedEmail,
            };

        changeStatus(chairId, "purchased");
        
        await fetch("/chairs/reserve/" + chairId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setPurchased(true);
        }else {
            console.log("Invalid email.");
        }
    };

    if(!purchased){
    return (
        <div>
            {chairData &&
                        <div
                            key={chairData.chair}
                        >
                            <div>
                            <h1>Chair: {chairData.chair}</h1>
                            </div>
                            <h2>Status: {chairData.status}</h2>
                            <button
                            onClick={() => reserve(chairData.chair, "reserved")}
                            >
                                Reserve
                            </button>
                            <div
                                style={{ display: !isHidden ?  "none" : "block"}}
                            >
                            <button
                                onClick={() => changeStatus(chairData.chair, "free")}
                            >
                                Cancel
                            </button>
                            <input
                            value={email}
                            placeholder="Provide a valid email to purchase"
                            onChange={handleEmailChange}
                            />
                            <button
                            onClick={() => purchase(customerId, chairData.chair, email)}
                            >
                                Purchase
                            </button>
                            </div>
                        </div>      
            }
        </div>
    );
    } else {
        <></>
    }
};
