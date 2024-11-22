from langchain_openai import ChatOpenAI
from langchain.agents import Tool, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import format_to_openai_tool_messages
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from dotenv import load_dotenv
import os

# Import the handle_food_query function
from .decision_agent import handle_food_query  # Update this import path to the actual file location

# Test the function
def test_handle_food_query():
    # Sample queries to test
    queries = [
        "What are some popular foods in America?",
        "Tell me about Italian cuisine.",
        "How do I make pancakes?",
        "What allergens are in sushi?",
    ]

    for query in queries:
        print(f"Testing query: {query}")
        response = handle_food_query(query)
        print(f"Response: {response['response']}\n")

if __name__ == "__main__":
    test_handle_food_query()