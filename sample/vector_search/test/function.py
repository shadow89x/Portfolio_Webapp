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
    container_name = "contoso-cg-shopping"
    # Create a BlobServiceClient object using the connection string
    blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=retailcontosoclothing;AccountKey=VxS15O/wK8ChhYqc98fTPUuvarsosYumDND83IQufXh2j168ExcWnmYJvPyYyNkifWlehyg7gA9z+AStSxNAAg==;EndpointSuffix=core.windows.net")

    # Get the blob client for your CSV file
    blob_client = blob_service_client.get_blob_client(container=container_name, blob="Coles_products.csv")
    # Download the CSV file as a string
    csv_string = blob_client.download_blob().content_as_text()
    # Convert the CSV string to a pandas DataFrame

    df = pd.read_csv(io.StringIO(csv_string),index_col=[0])

    # Get the blob client for your CSV file
    blob_client = blob_service_client.get_blob_client(container=container_name, blob="recipe.csv")
    # Download the CSV file as a string
    csv_string = blob_client.download_blob().content_as_text()
    # Convert the CSV string to a pandas DataFrame
    recipe = pd.read_csv(io.StringIO(csv_string),index_col=[0])
    return df, recipe

def vectorize_image(image_url):
    # Set API endpoint and subscription key
    api_endpoint = "https://eastus.cognitiveservices.azure.com/computervision/retrieval:vectorizeImage?api-version=2023-02-01-preview"
    subscription_key = "3db11cb901f146db83293d0598176f51"

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


def vectorize_images(image_urls,text):
    # Set API endpoint and subscription key
    api_endpoint = "https://eastus.cognitiveservices.azure.com/computervision/retrieval:vectorizeImage?api-version=2023-02-01-preview"
    subscription_key = "3db11cb901f146db83293d0598176f51"

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

def vectorize_text(text):
    # Set API endpoint and subscription key
    api_endpoint = "https://eastus.cognitiveservices.azure.com/computervision/retrieval:vectorizeText?api-version=2023-02-01-preview"
    subscription_key = "3db11cb901f146db83293d0598176f51"

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

def vectorize_texts(texts):
    # Set API endpoint and subscription key
    api_endpoint = "https://eastus.cognitiveservices.azure.com/computervision/retrieval:vectorizeText?api-version=2023-02-01-preview"
    subscription_key = "3db11cb901f146db83293d0598176f51"

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
    max_similarity_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)[:15]

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

def process(df,recipe,query):

    dalle_url = df['final_url']

    Dall_e_Vectors = df['vector']

    # Convert the input vectors to lists of floats
    Dall_e_Vectors = [list(map(float, vec[1:-1].split(', '))) if not isinstance(vec, float) else [vec] for vec in Dall_e_Vectors]
    # text,desc = image_desc(image_url)

    real_vector = vectorize_text(query)

    real_vector = list(map(float, real_vector))

    most_similar_image_urls = get_most_similar_images(real_vector, Dall_e_Vectors, dalle_url)
    # Create a dictionary with most_similar_image_urls as keys and their corresponding indices as values
    url_indices = {url: i for i, url in enumerate(most_similar_image_urls)}

    # st.success(desc)

    # Create a boolean mask for the rows where the 'value/img_url' matches with 'most_similar_image_urls'
    mask = df['final_url'].isin(most_similar_image_urls)

    # Get the values of the 'value/productID' column for the matching rows using the boolean mask
    matching_product_ids = df.loc[mask, 'product_name'].tolist()

    # Sort the matching_product_ids based on the index values obtained from the url_indices dictionary
    matching_product_ids = sorted(matching_product_ids, key=lambda x: url_indices[df.loc[df['product_name'] == x, 'value/img_url'].iloc[0]])

    # Create a boolean mask for the rows where the 'value/productID' matches with 'matching_product_ids'
    mask2 = recipe['product_name'].isin(matching_product_ids)

    # Sort the matching_product dataframe based on the order of matching_product_ids
    matching_product = recipe.loc[mask2].sort_values(by=['product_name'])
    urls = matching_product['final_url']
    titles=matching_product['product_name']
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