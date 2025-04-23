from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder=os.path.abspath('.'))
CORS(app)  # Enable CORS for all routes

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['contact_form_db']
collection = db['submissions']

@app.route('/api/submit-form', methods=['POST'])
def submit_form():
    try:
        # Get form data
        form_data = request.form.to_dict()

        # Add unique ID and timestamp
        form_data['_id'] = str(uuid.uuid4())
        form_data['timestamp'] = datetime.now().isoformat()

        # Insert into MongoDB
        collection.insert_one(form_data)

        return jsonify({
            'status': 'success',
            'message': 'Form submitted successfully'
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while processing your request'
        }), 500

# Serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Serve index.html
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Server starting at http://localhost:5000")
    print("API endpoint available at http://localhost:5000/api/submit-form")
    print("MongoDB URI:", mongo_uri)
    print("Working directory:", os.getcwd())
    print("Static folder:", app.static_folder)

    try:
        # Test MongoDB connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {str(e)}")

    app.run(debug=True, port=5000)
