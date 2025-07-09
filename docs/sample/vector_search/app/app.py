
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
from function import *
import ast
import logging
import os
description = """
# Click image to find similar products
**Enter your query and hit enter**
"""

howto = """
# Vectorized Image Search
Type URL of image or Text(Car) you want to find similar products
"""


def main():
    st.markdown(
        """
              <style>
              .block-container{
                max-width: 1200px;
              }
              div.row-widget.stRadio > div{
                flex-direction:row;
                display: flex;
                justify-content: center;
              }
              section.main>div:first-child {
                padding-top: 0px;
              }
              section:not(.main)>div:first-child {
                padding-top: 30px;
              }
              div.reportview-container > section:first-child{
                max-width: 320px;
              }
              #MainMenu {
                visibility: hidden;
              }
              footer {
                visibility: hidden;
              }
              </style>""",
        unsafe_allow_html=True,
    )

    azure_endpoint = st.sidebar.text_input('Azure Computer Vision Endpoint')  # added this line
    azure_api_key = st.sidebar.text_input('Azure Computer Vision API Key')  # added this line
    
    st.sidebar.markdown(description)
    st.markdown(howto)


    df= load_model()
    print(len(df))
    _, c, _ = st.columns((1, 3, 1))
    if "query" in st.session_state:
        query = c.text_input("", value=st.session_state["query"])
        
    else:

        query = c.text_input("", value="robot")

    

    # Parse the input text as a URL
    parsed_url = urllib.parse.urlparse(query)

    # Check if the scheme component of the URL is not empty, indicating that it is a valid URL
    if parsed_url.scheme != "":
        st.write("Input query is a URL")
        if_url='True'
    else:
        st.write("Input query is text.")
        print("Input query is text")
        if_url='False'

    if query and if_url == 'True':
    # Save the image from URL to a temporary directory
        new_image=tempfile(query)
        st.sidebar.image(new_image, caption="Input Image")

    if len(query) > 0:
        urls,titles,matching_product=process(df,if_url,query,azure_endpoint,azure_api_key)
        # images = []
        # for file in urls:
        #     with open(file, "rb") as image:
        #         encoded = base64.b64encode(image.read()).decode()
        #         images.append(f"data:image/jpeg;base64,{encoded}")
        print(urls[0])
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
                st.experimental_rerun()


if __name__ == "__main__":
    main()