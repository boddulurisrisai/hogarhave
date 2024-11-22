from .food_recommendation_agent import get_food_recommendations
from .query_agent import handle_food_query
from langchain_openai import ChatOpenAI
import os
from .handle_orders_agent import handle_orders
# Initialize OpenAI model for dynamic responses
llm = ChatOpenAI(
    temperature=0.7,
    model="gpt-4",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def generate_dynamic_response(query: str) -> dict:
    """
    Generates a fallback response using GPT-4 for unrecognized queries.
    :param query: The user's unrecognized query.
    :return: A dictionary containing the dynamically generated response.
    """
    try:
        # Define the system prompt for the assistant
        system_prompt = (
            "You are a helpful and friendly assistant specialized in food and cuisines. "
            "You can answer questions about food recommendations of food items, check order status, fradulent "
            "If someone asks 'What can you do?', explain your capabilities conversationally."
        )

        # Send the query to GPT-4 with the appropriate system and user messages
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]

        # Use invoke to get the response
        response = llm.invoke(messages)

        # Extract the content directly from the response object
        content = response.content if hasattr(response, "content") else response["content"]
        return {"response": content.strip()}
    except Exception as e:
        # Log error (if needed) and return a default fallback response
        print(f"Error generating dynamic response: {e}")
        return {"response": "I'm sorry, I couldn't generate a response. Please try again later."}

def decide_agent(query: str, additional_input=None):

    """
    Decides which agent to invoke based on the query content.
    :param query: The user's query.
    :param additional_input: Optional additional data.
    :return: Response from the selected agent.
    """
    query_lower = query.lower().strip()

    # Handle greetings
    greeting_keywords = ["hi", "hello", "how are you", "hey"]
    if any(keyword in query_lower for keyword in greeting_keywords):
        return {"response": "Hi, Welcome to Cuisine Connect! How may I assist you today?"}

    # Handle food recommendations
    recommendation_keywords = ["recommend", "show", "list", "suggest", "give"]
    if any(keyword in query_lower for keyword in recommendation_keywords):
        return get_food_recommendations(query)

    # # Handle general food-related queries
    # query_keywords = ["allergen", "ingredients", "calories", "health", "explain", "details", "information"]
    # if any(keyword in query_lower for keyword in query_keywords):
    #     return handle_food_query(query)
    
    order_status_keywords = ["order status", "shipping status", "defective", "damaged", "refund", "replace"]
    if any(keyword in query_lower for keyword in order_status_keywords):
        return handle_orders(query)

    # Handle fraudulent transaction queries
    # fraud_keywords = ["fraudulent", "unauthorized", "credit card", "transaction"]
    # if any(keyword in query_lower for keyword in fraud_keywords):
    #     return handle_fraudulent_transaction(query, additional_input)
    
    # place_order_keywords = ["place order", "order now", "buy"]
    # if any(keyword in query_lower for keyword in place_order_keywords):
    #     return store_order_to_db(additional_input)
    # # Dynamic fallback for unrecognized queries
    return generate_dynamic_response(query)