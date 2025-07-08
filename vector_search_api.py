from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import pandas as pd
import numpy as np
import requests
import json
import os
from dotenv import load_dotenv
import math
import urllib.parse
import tempfile
from PIL import Image
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
AZURE_ENDPOINT = os.getenv('AZURE_ENDPOINT')
AZURE_API_KEY = os.getenv('AZURE_API_KEY')

# Load data (this would be your actual data in production)
def load_data():
    """Load the vector data - in production this would be your actual CSV"""
    # For demo purposes, we'll create sample data
    sample_data = {
        'url': [
            'sample/vector_search/app_image1.jpg',
            'sample/vector_search/app_image2.jpg', 
            'sample/vector_search/app_image3.jpg',
            'sample/vector_search/app_image4.jpg',
            'sample/vector_search/app_image5.jpg'
        ],
        'product_name': [
            'Robot Toy Set',
            'Mechanical Robot',
            'Robot Action Figure', 
            'Robot Building Kit',
            'Robot Model Kit'
        ],
        'vector': [
            [0.1, 0.2, 0.3, 0.4, 0.5],  # Sample vectors
            [0.2, 0.3, 0.4, 0.5, 0.6],
            [0.3, 0.4, 0.5, 0.6, 0.7],
            [0.4, 0.5, 0.6, 0.7, 0.8],
            [0.5, 0.6, 0.7, 0.8, 0.9]
        ]
    }
    return pd.DataFrame(sample_data)

def vectorize_image(image_url, azure_endpoint, azure_api_key):
    """Vectorize an image using Azure Computer Vision"""
    if not azure_endpoint or not azure_api_key:
        # Return sample vector for demo
        return [0.1, 0.2, 0.3, 0.4, 0.5]
    
    try:
        api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeImage?api-version=2023-02-01-preview"
        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": azure_api_key
        }
        data = {"url": image_url}
        
        response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        
        response_json = response.json()
        return response_json.get("vector", [0.1, 0.2, 0.3, 0.4, 0.5])
    except Exception as e:
        print(f"Error vectorizing image: {e}")
        return [0.1, 0.2, 0.3, 0.4, 0.5]

def vectorize_text(text, azure_endpoint, azure_api_key):
    """Vectorize text using Azure Computer Vision"""
    if not azure_endpoint or not azure_api_key:
        # Return sample vector for demo
        return [0.1, 0.2, 0.3, 0.4, 0.5]
    
    try:
        api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeText?api-version=2023-02-01-preview"
        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": azure_api_key
        }
        data = {"text": text}
        
        response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        
        response_json = response.json()
        return response_json.get("vector", [0.1, 0.2, 0.3, 0.4, 0.5])
    except Exception as e:
        print(f"Error vectorizing text: {e}")
        return [0.1, 0.2, 0.3, 0.4, 0.5]

def get_cosine_similarity(vector1, vector2):
    """Calculate cosine similarity between two vectors"""
    try:
        dot_product = sum(vector1[i] * vector2[i] for i in range(min(len(vector1), len(vector2))))
        magnitude1 = math.sqrt(sum(x * x for x in vector1))
        magnitude2 = math.sqrt(sum(x * x for x in vector2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0
            
        return dot_product / (magnitude1 * magnitude2)
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0

def get_most_similar_images(query_vector, vectors, urls, product_names, top_k=5):
    """Find most similar images based on cosine similarity"""
    similarities = []
    
    for i, vector in enumerate(vectors):
        similarity = get_cosine_similarity(query_vector, vector)
        similarities.append((similarity, i))
    
    # Sort by similarity (descending)
    similarities.sort(key=lambda x: x[0], reverse=True)
    
    # Return top k results
    results = []
    for similarity, idx in similarities[:top_k]:
        results.append({
            'url': urls[idx],
            'product_name': product_names[idx],
            'similarity': round(similarity * 100, 1)
        })
    
    return results

@app.route('/api/search', methods=['POST'])
def search():
    """API endpoint for vector search"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        is_url = data.get('is_url', False)
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Load data
        df = load_data()
        
        # Parse the input text as a URL
        parsed_url = urllib.parse.urlparse(query)
        if parsed_url.scheme != "":
            is_url = True
        
        # Vectorize query
        if is_url:
            query_vector = vectorize_image(query, AZURE_ENDPOINT, AZURE_API_KEY)
        else:
            query_vector = vectorize_text(query, AZURE_ENDPOINT, AZURE_API_KEY)
        
        # Get similar images
        results = get_most_similar_images(
            query_vector,
            df['vector'].tolist(),
            df['url'].tolist(),
            df['product_name'].tolist()
        )
        
        return jsonify({
            'success': True,
            'results': results,
            'query': query,
            'is_url': is_url
        })
        
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Vector Search API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 