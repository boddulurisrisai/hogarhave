import os
import json
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB client setup
client = MongoClient('mongodb://localhost:27017/')
db = client['Foodservices']  # Replace with your actual database name
fooditems_collection = db['Fooditems']
# Function to fetch food items from MongoDB
# def get_recommendation_from_db(query):
#     """Fetch food recommendations based on user's query from MongoDB."""
#     try:
#         print(f"Fetching food items for query: {query}")  # Debug log
#         food_items = fooditems_collection.find({}, {'name': 1, 'description': 1, 'cuisine': 1, 'price': 1, 'spiceLevel': 1, 'imageUrl': 1})
#         recommendations = []
#         query_lower = query.lower()
        
#         # Filtering food items based on user query (perform this efficiently)
#         for item in food_items:
#             if any(keyword in query_lower for keyword in ['medium', 'mild', 'spicy', item['cuisine'].lower(), item['name'].lower()]):
#                 recommendations.append({
#                     "name": item['name'],
#                     "description": item['description'],
#                     "cuisine": item['cuisine'],
#                     "price": item['price'],
#                     "spiceLevel": item['spiceLevel'],
#                     "imageUrl": item.get('imageUrl', '')
#                 })
#         print(f"Fetched recommendations: {json.dumps(recommendations, indent=4)}")
 
#         return recommendations
#     except Exception as e:
#         print(f"Error fetching recommendations: {e}")
#         return []

def get_recommendation_from_db(query):
    try:
        query_lower = query.lower()
        keywords = query_lower.split()
        # Match any item containing the keywords in name or cuisine
        food_items = fooditems_collection.find({
            "$or": [
                {"name": {"$regex": "|".join(keywords), "$options": "i"}},
                {"cuisine": {"$regex": "|".join(keywords), "$options": "i"}}
            ]
        }, {"name": 1, "description": 1, "cuisine": 1, "price": 1, "spiceLevel": 1, "imageUrl": 1})
        
        recommendations = [
            {
                "name": item['name'],
                "description": item['description'],
                "cuisine": item['cuisine'],
                "price": item['price'],
                "spiceLevel": item.get('spiceLevel', 'Unknown'),
                "imageUrl": item.get('imageUrl', '')
            } for item in food_items
        ]
        # print(f"Recommendations fetched: {recommendations}")
        return recommendations
    except Exception as e:
        print(f"Error in fetching food recommendations: {e}")
        return []


# Define the LangChain Agent with OpenAI LLM
def get_agent():
    """Create and return the LangChain agent for food recommendations."""
    prompt_template = """
    You are a food recommendation bot. Based on the following user query, recommend food items from a MongoDB collection.
    User Query: "{query}"

    Response format:
    [
        {"name": "Food Item Name", "description": "Description", "cuisine": "Cuisine", "price": "Price", "spiceLevel": "Spice Level", "imageUrl": "Image URL"}
    ]
    """
    
    # Initialize the ChatOpenAI model with the API key
    llm = ChatOpenAI(
        temperature=0.7,
        model="gpt-4",
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    # Create the prompt template
    prompt = PromptTemplate(input_variables=["query"], template=prompt_template)

    # Define a Tool for MongoDB recommendation fetching
    tools = [
        Tool(
            name="Food Recommendation",
            func=get_recommendation_from_db,
            description="Fetches food recommendations based on the user's query."
        )
    ]

    # Initialize and return the agent
    agent = initialize_agent(
        tools=tools,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        llm=llm,
        verbose=True
    )

    return agent

# Function to get food recommendations from the agent
# def get_food_recommendations(user_query):
#     """Fetch food recommendations using LangChain agent."""
#     agent = get_agent()
    
#     try:
#         # Ask the agent for food recommendations
#         result = agent.run(user_query)
        
#         # Directly return the data from get_recommendation_from_db
#         food_items = get_recommendation_from_db(user_query)  # Fetch recommendations directly from DB
        
#         if food_items:
#             recommendations_list = [
#                 f"{item['name']} - {item['description']}. Price: ${item['price']} (Spice Level: {item['spiceLevel']}) ![Image]({item['imageUrl']})"
#                 for item in food_items
#             ]
#             return json.dumps({
#                 "user_query": user_query,
#                 "bot_response": "Here are some food recommendations:\n" + "\n".join(recommendations_list)
#             }, indent=4)
#         else:
#             return json.dumps({
#                 "user_query": user_query,
#                 "bot_response": "Sorry, no food recommendations found based on your query."
#             }, indent=4)
    
#     except Exception as e:
#         return json.dumps({
#             "user_query": user_query,
#             "bot_response": f"An error occurred while fetching recommendations: {str(e)}"
#         }, indent=4)
def get_food_recommendations(user_query):
    try:
        food_items = get_recommendation_from_db(user_query)
        if food_items:
            recommendations = [
                {
                    "name": item["name"],
                    "description": item["description"],
                    "price": item["price"],
                    "spiceLevel": item.get("spiceLevel", "Unknown"),
                    "imageUrl": item.get("imageUrl", "")
                }
                for item in food_items
            ]
            return {
                "user_query": user_query,
                "recommendations": recommendations
            }
        return {
            "user_query": user_query,
            "recommendations": [],
            "message": "No recommendations found for your query. Try asking differently!"
        }
    except Exception as e:
        print(f"Error in recommendations: {e}")
        return {
            "user_query": user_query,
            "error": "An error occurred while fetching recommendations. Please try again."
        }
