import pymongo

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["FoodOrdering"]
orders_collection = db["Orders"]

def cancel_order_in_db(order_id):
    """Function to cancel an order in MongoDB using the order ID."""
    try:
        result = orders_collection.delete_one({"order_id": order_id})
        if result.deleted_count > 0:
            return {"success": True, "message": f"Order {order_id} has been cancelled successfully."}
        else:
            return {"success": False, "message": f"No order found with ID {order_id}."}
    except Exception as e:
        return {"success": False, "message": f"Error cancelling order: {str(e)}"}
