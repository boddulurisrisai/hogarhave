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
    }, [messages]); // This will run every time the messages array is updated

    // Handle the submit button
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!query.trim()) return;

    //     // Add user message to chat
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true); // Start loading

    //     try {
    //         // Send POST request to the backend API
    //         const res = await fetch('http://127.0.0.1:5000/api/query', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ query }), // Send user input to backend
    //         });

    //         const data = await res.json();

    //         // Check if bot response exists
    //         if (data.bot_response) {
    //             const botResponse = data.bot_response;

    //             if (data.bot_response.includes("Here are some food recommendations")) {
    //                 // Parse food recommendations and display in chat
    //                 const foodItems = JSON.parse(botResponse.split('\n')[1]); // Parse the recommendations part
    //                 const foodMessage = foodItems.map(item => {
    //                     return (
    //                         `<strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/><img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>`
    //                     );
    //                 }).join('<br/>');

    //                 setMessages(prevMessages => [
    //                     ...prevMessages,
    //                     { type: 'bot', text: botResponse, foodItemsHtml: foodMessage }
    //                 ]);
    //             } else {
    //                 setMessages(prevMessages => [
    //                     ...prevMessages,
    //                     { type: 'bot', text: botResponse }
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
    //         setQuery(''); // Clear input
    //         setLoading(false); // Stop loading
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     if (!query.trim()) return;
    
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true);
    
    //     try {
    //         const res = await fetch('http://127.0.0.1:5000/api/query', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ query }),
    //         });
    
    //         const data = await res.json();
    //         const botResponse = data.bot_response || 'No recommendations or information found.';
    
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: botResponse }
    //         ]);
    //     } catch (error) {
    //         console.error('Error fetching bot response:', error);
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { type: 'bot', text: 'Error fetching response. Please try again.' }
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
            const res = await fetch('http://127.0.0.1:5000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
    
            const data = await res.json();
    
            if (data.bot_response) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: data.bot_response }
                ]);
    
                if (data.food_items) {
                    const foodMessage = data.food_items.map(item => `
                        <strong>${item.name}</strong>: ${item.description} - Price: $${item.price} (Spice Level: ${item.spiceLevel})<br/>
                        <img src="${item.imageUrl}" alt="${item.name}" class="food-image"/>
                    `).join('<br/>');
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { type: 'bot', text: data.bot_response, foodItemsHtml: foodMessage }
                    ]);
                }
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'bot', text: 'No recommendations or information found.' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching bot response:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'bot', text: 'Error fetching response. Please try again.' },
            ]);
        } finally {
            setQuery('');
            setLoading(false);
        }
    };    

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     if (!query.trim()) return;
    
    //     // Add the user's query to the chat
    //     setMessages(prevMessages => [...prevMessages, { type: 'user', text: query }]);
    //     setLoading(true); // Show loading indicator
    
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
    
    //         // Handle bot response
    //         if (data.response) {
    //             setMessages(prevMessages => [
    //                 ...prevMessages,
    //                 { type: 'bot', text: data.response } // Update this to correctly parse `response`
    //             ]);
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
    //         setQuery(''); // Clear input field
    //         setLoading(false); // Hide loading indicator
    //     }
    // };    

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
