from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import json_util

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
print("MongoDB URI:", mongo_uri)

client = MongoClient(mongo_uri)
db = client['contact_form_db']
collection = db['submissions']

# Find all documents in the collection
documents = list(collection.find())
print(f"Found {len(documents)} documents in the collection.")

# Print each document
for i, doc in enumerate(documents):
    # Convert MongoDB document to JSON string
    json_doc = json.loads(json_util.dumps(doc))
    print(f"\nDocument {i+1}:")
    print(json.dumps(json_doc, indent=2))

print("\nQuery completed successfully!")
