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

# Configure CORS to allow requests from specific domains
CORS(app)

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With,Origin')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['contact_form_db']
collection = db['submissions']

@app.route('/api/submit-form', methods=['POST', 'OPTIONS'])
def submit_form():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Log request details for debugging
        print(f"Request received from: {request.remote_addr}")
        print(f"Request headers: {request.headers}")

        # Get form data
        form_data = request.form.to_dict()
        print(f"Form data received: {form_data}")

        # Add unique ID and timestamp
        form_data['_id'] = str(uuid.uuid4())
        form_data['timestamp'] = datetime.now().isoformat()

        # Insert into MongoDB
        collection.insert_one(form_data)
        print("Data successfully inserted into MongoDB")

        return jsonify({
            'status': 'success',
            'message': 'Form submitted successfully'
        }), 200

    except Exception as e:
        error_message = str(e)
        print(f"Error: {error_message}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred: {error_message}'
        }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return 'OK', 200

# CORS test endpoint
@app.route('/api/cors-test', methods=['GET', 'POST', 'OPTIONS'])
def cors_test():
    if request.method == 'OPTIONS':
        return '', 200

    # Log request details
    print(f"CORS test request from: {request.remote_addr}")
    print(f"CORS test headers: {request.headers}")

    # Return request details and headers
    return jsonify({
        'status': 'success',
        'message': 'CORS test successful',
        'request': {
            'method': request.method,
            'origin': request.headers.get('Origin', 'No origin'),
            'referer': request.headers.get('Referer', 'No referer'),
            'user_agent': request.headers.get('User-Agent', 'No user agent')
        },
        'server_time': datetime.now().isoformat()
    })

# Server info endpoint
@app.route('/api/info', methods=['GET'])
def server_info():
    return jsonify({
        'status': 'running',
        'version': '1.0.0',
        'cors': 'enabled',
        'allowed_origins': '*',
        'server_time': datetime.now().isoformat()
    })

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
