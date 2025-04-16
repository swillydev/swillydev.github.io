from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import uuid
import json
from datetime import datetime
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder=os.path.abspath('.'))

# Configure CORS to allow requests from specific domains
CORS(app, resources={
    r"/*": {
        "origins": ["*"],  # Allow all origins
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept", "X-Requested-With", "Origin"],
        "supports_credentials": False,
        "max_age": 86400  # Cache preflight requests for 24 hours
    }
})

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    # Allow requests from any origin
    response.headers.add('Access-Control-Allow-Origin', '*')

    # Allow specific headers
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With,Origin')

    # Allow specific methods
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

    # Cache preflight requests for 24 hours
    response.headers.add('Access-Control-Max-Age', '86400')

    # Don't allow credentials (cookies, etc.)
    response.headers.add('Access-Control-Allow-Credentials', 'false')

    return response

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')

# Initialize MongoDB client with proper SSL configuration
try:
    client = MongoClient(
        mongo_uri,
        ssl=True,
        ssl_cert_reqs='CERT_NONE',  # Don't verify the server's certificate
        connectTimeoutMS=30000,     # Increase connection timeout
        socketTimeoutMS=30000,      # Increase socket timeout
        serverSelectionTimeoutMS=30000  # Increase server selection timeout
    )
    # Test connection
    client.admin.command('ping')
    print("MongoDB connection successful!")

    # Set up database and collection
    db = client['contact_form_db']
    collection = db['submissions']

    # MongoDB connection status for health checks
    mongodb_connected = True
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")
    # Set a flag to indicate MongoDB connection failure
    mongodb_connected = False
    # Create dummy objects for graceful failure
    db = None
    collection = None

@app.route('/api/submit-form', methods=['POST', 'OPTIONS'])
def submit_form():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200

    # Check if MongoDB is connected
    if not mongodb_connected:
        # Use fallback storage method
        return store_submission_fallback(request)

    try:
        # Log request details for debugging
        print(f"Request received from: {request.remote_addr}")
        print(f"Request headers: {request.headers}")
        print(f"Content-Type: {request.content_type}")

        # Get data from request
        if request.content_type and 'application/json' in request.content_type:
            # Handle JSON data
            print("Handling JSON data")
            data = request.get_json()
        else:
            # Handle form data
            print("Handling form data")
            data = request.form.to_dict()

        print(f"Data received: {data}")

        # If data is empty, try to get raw data
        if not data:
            print("Data is empty, trying to get raw data")
            try:
                raw_data = request.get_data()
                print(f"Raw data: {raw_data}")
            except Exception as e:
                print(f"Error getting raw data: {str(e)}")
                return jsonify({
                    'status': 'error',
                    'message': f'Error processing form data: {str(e)}'
                }), 400  # Bad Request

        # Add unique ID and timestamp
        submission_data = data.copy() if data else {}
        submission_data['_id'] = str(uuid.uuid4())
        submission_data['timestamp'] = datetime.now().isoformat()

        # Try to insert into MongoDB
        try:
            collection.insert_one(submission_data)
            print("Data successfully inserted into MongoDB")
        except Exception as mongo_error:
            print(f"MongoDB insertion error: {str(mongo_error)}")
            return jsonify({
                'status': 'error',
                'message': f'Database error: {str(mongo_error)}'
            }), 500  # Internal Server Error

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
    # Check MongoDB connection
    mongo_status = "Connected" if mongodb_connected else "Disconnected"

    # Return detailed health information
    return jsonify({
        'status': 'OK' if mongodb_connected else 'Degraded',
        'mongodb': mongo_status,
        'server_time': datetime.now().isoformat()
    }), 200

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
        'mongodb_connected': mongodb_connected,
        'server_time': datetime.now().isoformat(),
        'environment': 'production' if int(os.environ.get('PORT', 5000)) != 5000 else 'development'
    })

# Serve static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Fallback function to store submissions when MongoDB is down
def store_submission_fallback(request):
    try:
        print("Using fallback storage method")

        # Get data from request
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        # If data is empty, try to get raw data
        if not data:
            try:
                raw_data = request.get_data()
                print(f"Raw data: {raw_data}")
                return jsonify({
                    'status': 'error',
                    'message': 'Empty form data received'
                }), 400
            except Exception as e:
                print(f"Error getting raw data: {str(e)}")
                return jsonify({
                    'status': 'error',
                    'message': f'Error processing form data: {str(e)}'
                }), 400

        # Add unique ID and timestamp
        submission_data = data.copy()
        submission_data['_id'] = str(uuid.uuid4())
        submission_data['timestamp'] = datetime.now().isoformat()

        # Store in a local file
        fallback_file = os.path.join(os.getcwd(), 'fallback_submissions.json')

        # Read existing submissions
        try:
            if os.path.exists(fallback_file):
                with open(fallback_file, 'r') as f:
                    submissions = json.load(f)
            else:
                submissions = []
        except Exception as e:
            print(f"Error reading fallback file: {str(e)}")
            submissions = []

        # Add new submission
        submissions.append(submission_data)

        # Write back to file
        try:
            with open(fallback_file, 'w') as f:
                json.dump(submissions, f, indent=2)
            print(f"Submission saved to fallback file: {fallback_file}")
        except Exception as e:
            print(f"Error writing to fallback file: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': f'Error saving submission: {str(e)}'
            }), 500

        return jsonify({
            'status': 'success',
            'message': 'Form submitted successfully (using fallback storage)'
        }), 200

    except Exception as e:
        print(f"Fallback storage error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred in fallback storage: {str(e)}'
        }), 500

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
