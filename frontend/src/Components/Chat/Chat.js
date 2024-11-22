import React, { useState, useEffect, useRef } from 'react';
import './Chat.css'; // Import the Chat component CSS

const Chat = () => {
    const [query, setQuery] = useState(''); // For storing user input
    const [messages, setMessages] = useState([]); // To store both user and bot messages
    const [loading, setLoading] = useState(false); // For handling loading state
    const chatWindowRef = useRef(null); // Ref for the chat window

    // Scroll to the bottom of the chat window when messages are added
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]); // Runs whenever messages are updated

    // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!query.trim()) return;

    //     // Add the user's query to the chat
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true);

    //     try {
    //         // Fetch response from the backend
    //         const res = await fetch('http://127.0.0.1:5000/api/query', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ query }),
    //         });

    //         const data = await res.json();

    //         // Parse the response from the backend
    //         if (data.response) {
    //             const botMessage = { type: 'bot', text: data.response };

    //             if (data.food_items) {
    //                 // Create a formatted HTML string for food recommendations
    //                 const foodItemsHtml = data.food_items.map(item => `
    //                     <strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/>
    //                     <img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>
    //                 `).join('<br/>');
                    
    //                 // Add the HTML to the bot's message
    //                 botMessage.foodItemsHtml = foodItemsHtml;
    //             }

    //             // Add the bot's response to the chat
    //             setMessages(prevMessages => [...prevMessages, botMessage]);
    //         } else {
    //             // Handle missing response gracefully
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { type: 'bot', text: 'No recommendations or information found.' },
    //             ]);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching bot response:', error);
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: 'Error fetching response. Please try again.' },
    //         ]);
    //     } finally {
    //         setQuery(''); // Clear input field
    //         setLoading(false); // Stop loading spinner
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     if (!query.trim()) return;
    
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true);
    
    //     try {
    //         // Fetch response from backend
    //         const res = await fetch('http://127.0.0.1:5000/api/query', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ query }),
    //         });
    
    //         const data = await res.json();
    //         console.log('Backend response:', data);
    //         // Extract and handle the response
    //         if (data.bot_response) {
    //             const botResponse = data.bot_response
    //             // typeof data.response === 'string'
    //             // ? data.response // Use the string directly
    //             // : JSON.stringify(data.response);
                
    //             // const botResponse_trim = botResponse.replace('{"response":"', '').replace('"}', '');

    //             // Add bot response to messages
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { type: 'bot', text: botResponse }
    //             ]);
    
    //             // Handle food items if available
    //             if (data.food_items) {
    //                 const foodMessage = data.food_items.map(item => `
    //                     <strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/>
    //                     <img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>
    //                 `).join('<br/>');
    
    //                 setMessages(prevMessages => [
    //                     ...prevMessages,
    //                     { type: 'bot', text: botResponse, foodItemsHtml: foodMessage }
    //                 ]);
    //             }
    //         } else {
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { type: 'bot', text: 'No recommendations or information found.' },
    //             ]);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching bot response:', error);
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: 'Error fetching response. Please try again.' },
    //         ]);
    //     } finally {
    //         setQuery('');
    //         setLoading(false);
    //     }
    // };  
    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     if (!query.trim()) return;
    
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true);
    
    //     try {
    //         // Fetch response from backend
    //         const res = await fetch('http://127.0.0.1:5000/api/query', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ query }),
    //         });
    
    //         const data = await res.json();
    //         console.log('Backend response:', data);
    
    //         // Extract the actual bot response text from nested structure
    //         const botResponse = data.response?.bot_response || 'No recommendations or information found.';
    
    //         // Add bot response to messages
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: botResponse }
    //         ]);
    
    //         // Handle food items if available
    //         if (data.food_items) {
    //             const foodMessage = data.food_items.map(item => `
    //                 <strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/>
    //                 <img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>
    //             `).join('<br/>');
    
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { type: 'bot', text: botResponse, foodItemsHtml: foodMessage }
    //             ]);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching bot response:', error);
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: 'Error fetching response. Please try again.' },
    //         ]);
    //     } finally {
    //         setQuery('');
    //         setLoading(false);
    //     }
    // };  
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!query.trim()) return;
    
        setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
        setLoading(true);
    
        try {
            // Fetch response from the backend
            const res = await fetch('http://127.0.0.1:5000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
    
            // Parse the response as JSON
            const data = await res.json();
    
            // Log the full JSON data to the chat (as a string)
            // setMessages(prevMessages => [
            //     ...prevMessages,
            //     { type: 'bot', text: JSON.stringify(data, null, 2) } // Adding the raw JSON response here
            // ]);
    
            // Dynamically handle different response structures
            const botResponse = 
                data.response?.bot_response ||
                data.response?.response;
    
            // Add the bot response to the chat
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'bot', text: botResponse }
            ]);

            if (data.response?.orderDetails) {
                const { orderDetails } = data.response; // Correctly accessing orderDetails
                const orderDetailsMessage = `
                    <strong>Order ID:</strong> ${orderDetails.orderId} <br />
                    <strong>Name:</strong> ${orderDetails.firstName} <br />
                    <strong>Phone:</strong> ${orderDetails.phoneNumber} <br />
                    <strong>Email:</strong> ${orderDetails.email} <br />
                    <strong>Product Name:</strong> ${orderDetails.productName} <br />
                    <strong>Quantity:</strong> ${orderDetails.quantity} <br />
                    <strong>Delivery Address:</strong> ${orderDetails.deliveryAddress} <br />
                    <strong>Credit Card:</strong> ${orderDetails.creditCard} <br />
                    <strong>Status:</strong> ${orderDetails.status} <br />
                `;
            
                // Add the detailed order information to the chat
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: botResponse, orderDetailsHtml: orderDetailsMessage }
                ]);
            }

            // Handle food items if available
            if (data.response?.recommendations) {
                const recommendationsMessage = data.response.recommendations.map(item => `
                    <strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/>
                    <img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>
                `).join('<br/>');
            
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: botResponse, recommendationsHtml: recommendationsMessage }
                ]);
            }
        } catch (error) {
            console.error('Error fetching bot response:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'bot', text: 'Error fetching response. Please try again.' },
            ]);
        } finally {
            setQuery(''); // Clear the input field
            setLoading(false); // Stop loading spinner
        }
    };
    

    return (
        <div className="chat-container">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            message.type === 'user' ? 'user-message' : 'bot-message'
                        }`}
                    >
                                                <div className="message-content">
                            {message.text && <p>{message.text}</p>}
                            {/* Display the food items HTML if available */}
                            {message.foodItemsHtml && (
                                <div dangerouslySetInnerHTML={{ __html: message.foodItemsHtml }} />
                            )}
                            {message.recommendationsHtml && (
                        <div dangerouslySetInnerHTML={{ __html: message.recommendationsHtml }} />
                    )}
                            {message.orderDetailsHtml && (
                        <div dangerouslySetInnerHTML={{ __html: message.orderDetailsHtml }} />
                    )}
                        </div>

                    </div>
                ))}
                {loading && (
                    <div className="bot-message">
                        <div className="message-content">Bot is typing...</div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask me about food, recommendations, or ingredients..."
                    className="chat-input"
                    disabled={loading} // Disable input while loading
                />
                <button type="submit" className="send-button" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;