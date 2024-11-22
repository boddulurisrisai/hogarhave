from flask import Flask, request, jsonify
from pymongo import MongoClient
import re

app = Flask(__name__)

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')  # Connect to your MongoDB server
db = client['Foodservices']  # Use the 'Foodservices' database
orders_collection = db['Orders']  # Use the 'Orders' collection


def handle_orders(query):
    # Check if order ID is mentioned in the query
    order_id = None
    order_id_match = re.search(r'order\s*#?(\d+)', query)  # Looks for phrases like "order #43790" or "order 43790"
    
    if order_id_match:
        order_id = '#' + order_id_match.group(1)  # Extract and format the order ID to match your data
    
    if order_id:
        # Fetch the order based on order_id (use the correct field name `order_id`)
        order = orders_collection.find_one({"order_id": order_id})
        
        if order:
            order_details = {
                "orderId": order.get("order_id"),
                "firstName": order.get("Name"),  # Assuming 'Name' is the field for the customer's name
                "phoneNumber": order.get("phone_number"),
                "email": order.get("email"),
                "productName": order.get("fooditem_name"),
                "quantity": order.get("quantity"),
                "deliveryAddress": order.get("delivery_address"),
                "creditCard": order.get("creditcard"),
                "status": "Order found"  # You can add any other status based on your requirements
            }
            return {"orderDetails": order_details}
        else:
            return {"response": "No order found with the provided order ID."}
    
    return {"response": "Order ID not found in the query."}
