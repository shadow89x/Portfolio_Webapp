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
import numpy as np
import math
import base64
import os
import sys

# Add the function module to path
sys.path.append('sample/vector_search/app')
from function import *

description = """
# Click image to find similar products
**Enter your query and hit enter**
"""

howto = """
# Vectorized Image Search
Type URL of image or Text(Car) you want to find similar products
"""

def main():
    # Configure Streamlit for iframe
    st.set_page_config(
        page_title="Vector Search",
        page_icon="🔍",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    st.markdown(
        """
        <style>
        .block-container {
            max-width: 1200px;
            padding-top: 1rem;
            padding-bottom: 1rem;
        }
        .main .block-container {
            padding-top: 0;
        }
        #MainMenu {
            visibility: hidden;
        }
        footer {
            visibility: hidden;
        }
        .stDeployButton {
            display: none;
        }
        header {
            display: none;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    # Sidebar for API configuration
    with st.sidebar:
        st.markdown(description)
        azure_endpoint = st.text_input('Azure Computer Vision Endpoint', key='azure_endpoint')
        azure_api_key = st.text_input('Azure Computer Vision API Key', key='azure_api_key', type='password')

    # Main content
    st.markdown(howto)

    # Load data
    try:
        df = load_model()
        st.write(f"Loaded {len(df)} products")
    except Exception as e:
        st.error(f"Error loading data: {e}")
        return

    # Search input
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        if "query" in st.session_state:
            query = st.text_input("", value=st.session_state["query"], key="search_input")
        else:
            query = st.text_input("", value="robot", key="search_input")

    # Process query
    if query:
        # Parse the input text as a URL
        parsed_url = urllib.parse.urlparse(query)
        if_url = 'True' if parsed_url.scheme != "" else 'False'

        if if_url == 'True':
            st.write("Input query is a URL")
            try:
                new_image = tempfile(query)
                st.sidebar.image(new_image, caption="Input Image")
            except Exception as e:
                st.error(f"Error loading image: {e}")
        else:
            st.write("Input query is text.")

        # Process search
        try:
            urls, titles, matching_product = process(df, if_url, query, azure_endpoint, azure_api_key)
            
            if urls and len(urls) > 0:
                st.write(f"Found {len(urls)} similar products")
                
                # Display results
                clicked = clickable_images(
                    [url for url in urls],
                    titles=[title for title in titles],
                    div_style={
                        "display": "flex",
                        "justify-content": "center",
                        "flex-wrap": "wrap",
                    },
                    img_style={"margin": "2px", "height": "200px"},
                )

                if clicked >= 0:
                    change_query = False
                    if "last_clicked" not in st.session_state:
                        change_query = True
                    else:
                        if clicked != st.session_state["last_clicked"]:
                            change_query = True
                    
                    if change_query:
                        url = matching_product.iloc[clicked]['url']
                        st.session_state["query"] = url
                        st.session_state["last_clicked"] = clicked
                        st.rerun()
            else:
                st.warning("No results found")
                
        except Exception as e:
            st.error(f"Error processing search: {e}")

if __name__ == "__main__":
    main() 