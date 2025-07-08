
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


description = """
# Click image to find similar products
**Enter your query and hit enter**
"""

howto = """
# Vectorized Image Search
Type URL of image or Text(ex-tshirts) you want to find similar products
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
    st.sidebar.markdown(description)
    st.markdown(howto)

    with st.spinner('Loading data...'):
        df,recipe = load_model()

    _, c, _ = st.columns((1, 3, 1))
    query = c.text_input("", value="Fried Rice with Meat and Vegetables")

    if len(query) > 0:
        st1=str(query)
        text=vectorize_text(st1)
        Dall_e_Vectors = recipe['vector']
        Dall_e_Vectors = [list(map(float, vec[1:-1].split(', '))) if not isinstance(vec, float) else [vec] for vec in Dall_e_Vectors]
        product_name=recipe['product_name']
        most_similar_items = get_most_similar_items(text, Dall_e_Vectors, product_name)


        product_names = ast.literal_eval(most_similar_items)
        product_names = [name.replace(' ', '_') for name in product_names]
        matched_df = df[df['product_name'].isin(product_names)][['product_name', 'final_url', 'price']]

        if matched_df.empty:
            st.warning("No matching product names found.")
        else:
            st.markdown("## Matching images")
            
            urls = list(matched_df['final_url'])
            names = list(matched_df['product_name'])
            prices = list(matched_df['price'])
            cols = st.columns(3)
            
            for i in range(0, len(urls), 3):
                for j in range(3):
                    if i + j < len(urls):
                        cols[j].markdown(f"### {names[i+j].replace('_', ' ')}")
                        cols[j].markdown(f"### ${prices[i+j]}")
                        cols[j].image(urls[i+j], width=200)

if __name__ == "__main__":
    main()