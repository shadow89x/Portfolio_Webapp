from st_clickable_images import clickable_images
import streamlit as st
from PIL import Image
import json
import io
import tempfile
import requests
import math
import pandas as pd
import azure.ai.vision as visionsdk
from azure.storage.blob import BlobServiceClient
import urllib.parse
@st.cache_data
def load_model():

    df = pd.read_csv('./toy_data.csv',index_col=[0])
    return df

def vectorize_image(image_url,azure_endpoint,azure_api_key):
    # Set API endpoint and subscription key
    api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeImage?api-version=2023-02-01-preview"
    subscription_key = azure_api_key

    # Set request headers
    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key
    }

    # Set request body
    data = {
        "url": image_url
    }

    # Send POST request with headers and data
    response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))

    # Parse response JSON and extract vector
    response_json = response.json()
    real_vector = response_json.get("vector")

    return real_vector


def vectorize_images(image_urls,text,azure_endpoint,azure_api_key):
    # Set API endpoint and subscription key
    api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeImage?api-version=2023-02-01-preview"
    subscription_key = azure_api_key

    # Set request headers
    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key
    }

    # Initialize empty list for results
    Dall_e_Vectors = []

    # Vectorize each image URL and store result in list
    for i, (image_url, text) in enumerate(zip(image_urls, texts)):
        # Set request body
        data = {
            "url": image_url,
            "text": text
        }

        # Send POST request with headers and data
        response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))

        # Parse response JSON and extract vector
        response_json = response.json()
        real_vector = response_json.get("vector")

        # Append vector to list
        Dall_e_Vectors.append(real_vector)
        
        print(f"Processed image {i+1} of {len(image_urls)}")

    return Dall_e_Vectors

def vectorize_text(text,azure_endpoint,azure_api_key):
    # Set API endpoint and subscription key
    api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeText?api-version=2023-02-01-preview"
    subscription_key = azure_api_key

    # Set request headers
    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key
    }

    # Set request body
    data = {
        "text": text
    }

    # Send POST request with headers and data
    response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))

    # Parse response JSON and extract vector
    response_json = response.json()
    real_vector = response_json.get("vector")

    return real_vector

def vectorize_texts(texts,azure_endpoint,azure_api_key):
    # Set API endpoint and subscription key
    api_endpoint = f"{azure_endpoint}/computervision/retrieval:vectorizeText?api-version=2023-02-01-preview"
    subscription_key = azure_api_key

    # Set request headers
    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key
    }
    Dall_e_Vectors = []

    # Vectorize each image URL and store result in list
    for i, text in enumerate(texts):
        # Set request body
        data = {
            "text": text
        }

        # Send POST request with headers and data
        response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))

        # Parse response JSON and extract vector
        response_json = response.json()
        real_vector = response_json.get("vector")

        # Append vector to list
        Dall_e_Vectors.append(real_vector)
        
        print(f"Processed image {i+1} of {len(texts)}")

    return Dall_e_Vectors

def get_cosine_similarity(vector1, vector2):
    dot_product = sum(vector1[i] * vector2[i] for i in range(min(len(vector1), len(vector2))))
    magnitude1 = math.sqrt(sum(x * x for x in vector1))
    magnitude2 = math.sqrt(sum(x * x for x in vector2))
    return dot_product / (magnitude1 * magnitude2)

def get_most_similar_images(real_vector, Dall_e_Vectors, image_urls):
    # Calculate cosine similarity between real_vector and each vector in Dall_e_Vectors
    similarities = [get_cosine_similarity(real_vector, vector) for vector in Dall_e_Vectors]

    # Find indices of Dall_e_Vectors with the highest similarities
    max_similarity_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)[:5]

    # Return URLs of most similar images
    return [image_urls[i] for i in max_similarity_indices]

def get_most_similar_image(real_vector, Dall_e_Vectors, image_urls):
    # Calculate cosine similarity between real_vector and each vector in Dall_e_Vectors
    similarities = [get_cosine_similarity(real_vector, vector) for vector in Dall_e_Vectors]

    # Find index of Dall_e_Vectors with the highest similarity
    max_similarity_index = similarities.index(max(similarities))

    # Return URL of most similar image
    return image_urls[max_similarity_index]

def get_most_similar_items(real_vector, Dall_e_Vectors, product_name):
    # Calculate cosine similarity between real_vector and each vector in Dall_e_Vectors
    similarities = [get_cosine_similarity(real_vector, vector) for vector in Dall_e_Vectors]

    # Find index of Dall_e_Vectors with the highest similarity
    max_similarity_index = similarities.index(max(similarities))

    # Return URL of most similar image
    return product_name[max_similarity_index]

def process(df,if_url,query,azure_endpoint,azure_api_key):
    image_url = df['url']
    Vectors = df['vector']

    # Convert the input vectors to lists of floats
    Vectors = [list(map(float, vec[1:-1].split(', '))) if not isinstance(vec, float) else [vec] for vec in Vectors]

    # assume that vectorize_text and get_most_similar_images are defined elsewhere
    if if_url=='True':
        print(if_url)
        print(query)
        real_vector = vectorize_image(query,azure_endpoint,azure_api_key)
        real_vector = list(map(float, real_vector))

        most_similar_image_urls = get_most_similar_images(real_vector, Vectors, image_url)

        # Create a boolean mask for the rows where the 'image_path' matches with 'most_similar_image_urls'
        matching_product = df[df['url'].isin(most_similar_image_urls)]

        # Order the dataframe according to most_similar_image_urls
        matching_product = matching_product.set_index('url').loc[most_similar_image_urls].reset_index()

        urls = matching_product['url']
        titles = matching_product['product_name']
    else:
        print(if_url)
        print(query)
        real_vector = vectorize_text(query,azure_endpoint,azure_api_key)
        real_vector = list(map(float, real_vector))
        print(len(real_vector))
        most_similar_image_urls = get_most_similar_images(real_vector, Vectors, image_url)

        # Create a boolean mask for the rows where the 'image_path' matches with 'most_similar_image_urls'
        matching_product = df[df['url'].isin(most_similar_image_urls)]

        # Order the dataframe according to most_similar_image_urls
        matching_product = matching_product.set_index('url').loc[most_similar_image_urls].reset_index()

        urls = matching_product['url']
        titles = matching_product['product_name']

    return urls,titles,matching_product


def tempfile(query):
    import tempfile
    response = requests.get(query)
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
        temp_file.write(response.content)
        image_path = temp_file.name
    img = Image.open(image_path)
    new_image = img.resize((300, 400))
    return new_image