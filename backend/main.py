# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from Login import auth_blueprint
# from Checkout import checkout_blueprint
# from Orders import orders_blueprint
# from Agents.decision_agent import decide_agent
#
# # Initialize Flask app
# app = Flask(__name__)
# CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
#
# # Register blueprints for modular routes
# app.register_blueprint(auth_blueprint, url_prefix='/api')
# app.register_blueprint(checkout_blueprint, url_prefix='/api')
# app.register_blueprint(orders_blueprint, url_prefix='/api')
#
#
# # General query route that uses decision_agent
# @app.route('/api/query', methods=['POST'])
# def query_route():
#     """
#     Handles decision-making agent requests.
#     Expects a JSON payload with 'query' and optionally 'additional_input'.
#     """
#     try:
#         # Parse user input from JSON
#         user_data = request.get_json()
#         user_query = user_data.get("query", "").strip()
#         additional_input = user_data.get("additional_input", None)
#
#         if not user_query:
#             return jsonify({"error": "Query field is required"}), 400
#
#         # Pass the query and additional input to the decision agent
#         response = decide_agent(user_query, additional_input)
#
#         # Return the agent's response
#         return jsonify({"response": response}), 200
#     except Exception as e:
#         print(f"Error in /api/query: {e}")
#         return jsonify({"error": str(e)}), 500
#
#
# # Main entry point
# if __name__ == '__main__':
#     try:
#         app.run(debug=True)
#     except Exception as e:
#         print(f"Error starting the Flask app: {e}")

from flask import Flask, request, jsonify
from flask_cors import CORS
from Login import auth_blueprint
from Checkout import checkout_blueprint
from Orders import orders_blueprint
from Agents.decision_agent import decide_agent


# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Register blueprints for modular routes
app.register_blueprint(auth_blueprint, url_prefix='/api')
app.register_blueprint(checkout_blueprint, url_prefix='/api')
app.register_blueprint(orders_blueprint, url_prefix='/api')

# General query route
# @app.route('/api/query', methods=['POST'])
# def query_route():
#     """
#     Handles decision-making agent requests.
#     Expects a JSON payload with 'query' and optionally 'additional_input'.
#     """
#     try:
#         user_data = request.get_json()
#         user_query = user_data.get("query", "").strip()
#         additional_input = user_data.get("additional_input", None)
#
#         if not user_query:
#             return jsonify({"error": "Query field is required"}), 400
#
#         response = decide_agent(user_query, additional_input)
#         return jsonify({"response": response}), 200
#     except Exception as e:
#         print(f"Error in /api/query: {e}")
#         return jsonify({"error": str(e)}), 500

@app.route('/api/query', methods=['POST'])
def query_route():
    try:
        data = request.get_json()
        query = data.get("query", "").strip()
        chat_history = data.get("chat_history", [])

        if not query:
            return jsonify({"response": "Query cannot be empty"}), 400

        # Pass chat history to decide_agent
        response = decide_agent(query, chat_history)
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"Error in /api/query: {e}")
        return jsonify({"response": "Internal server error"}), 500

# Main entry point
if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error starting the Flask app: {e}")