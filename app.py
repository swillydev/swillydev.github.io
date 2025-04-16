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

# Configure CORS to allow requests from your website domain
cors = CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "https://swillydev.github.io", "https://haleys-solicitors.co.uk"]
    }
})

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
    # Get port from environment variable (Render sets this) or use 5000 as default
    port = int(os.environ.get('PORT', 5000))

    # Only print debug info when running locally
    if port == 5000:
        print("Server starting at http://localhost:5000")
        print("API endpoint available at http://localhost:5000/api/submit-form")
        print("Working directory:", os.getcwd())
        print("Static folder:", app.static_folder)

        try:
            # Test MongoDB connection
            client.admin.command('ping')
            print("MongoDB connection successful!")
        except Exception as e:
            print(f"MongoDB connection failed: {str(e)}")

        # Debug mode only in development
        app.run(host='0.0.0.0', debug=True, port=port)
    else:
        # Production mode
        app.run(host='0.0.0.0', port=port)
