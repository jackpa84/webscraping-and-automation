import os
from datetime import datetime

from pymongo import MongoClient


def get_mongo_client():
    username = os.getenv('MONGO_INITDB_ROOT_USERNAME', 'admin')
    password = os.getenv('MONGO_INITDB_ROOT_PASSWORD', 'password')
    host = os.getenv('MONGODB_HOST', 'db')
    port = int(os.getenv('MONGODB_PORT', 27017))
    auth_source = os.getenv('MONGO_INITDB_DATABASE', 'juscash')

    uri = f"mongodb://{username}:{password}@{host}:{port}/{auth_source}?authSource=admin"
    client = MongoClient(uri)
    client.admin.command('ping')
    return client


client = get_mongo_client()
db = client['juscash']
collection = db['processes']


def add_process(process):
    # Adiciona os timestamps ao documento
    process['created_at'] = datetime.utcnow()
    process['updated_at'] = datetime.utcnow()

    # Insere o documento no MongoDB
    result = collection.insert_one(process)
    print(f"Inserted process with ID: {result.inserted_id}")
