import psycopg2
import requests
from bs4 import BeautifulSoup
import os
import json
import urllib.request
import re
from openai import OpenAI
from supabase import create_client, Client

DIR = os.path.dirname(os.path.realpath(__file__))
BASE_URL = "https://wiki.vitalia.city"
SUPABASE_URL="https://jwscgsmkadanioyopaef.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0"
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key="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",
)

def main():
    read_urls_to_list()
    read_urls_to_file()
    
    
    file = open(f"{DIR}/urls.txt", "r")
    url = ""
    title = ""
    for i, line in enumerate(file):
        print(line)
        if i % 2 == 0:
            url = line
        else:
            title = line
            cleaned_title = title.strip()
            print(cleaned_title)

            scrape_title(url, cleaned_title)
        
    
def read_urls_to_list():
    response = urllib.request.urlopen("https://wiki.vitalia.city/")
    data = response.read()      # a `bytes` object
    text = data.decode('utf-8') # a `str`; 
    soup = BeautifulSoup(text)
    all_urls = soup.find_all("a")
    with open(f"{DIR}/urls.txt","w") as write_file:
        for url in all_urls:
            print(url.get_text())
            link = url['href']
            print(link)
            if ("https" not in link):
                write_file.write(BASE_URL + link + "\n")
                cleaned_title = url.get_text().strip()  
                cleaned_title = cleaned_title.replace(" ", "_")
                cleaned_title = cleaned_title.replace("__", "_")
                cleaned_title = cleaned_title.replace("“", "")
                cleaned_title = cleaned_title.replace("”", "")
                write_file.write(cleaned_title + "\n")
    
    write_file.close()

def read_urls_to_file():
    file = open(f"{DIR}/urls.txt", "r")

    url = ""
    title = ""
    for i, line in enumerate(file):
        if i % 2 == 0:
            url = line
        else:
            title = line
            print("Url: ", url)
            print("Title: ", title)
            
            read_top_level_title_to_file(url, title)


def read_top_level_title_to_file(url, top_level_title):
    response = urllib.request.urlopen(url)
    data = response.read()      # a `bytes` object
    text = data.decode('utf-8') # a `str`; 
    soup = BeautifulSoup(text)
    cleaned_title = top_level_title.strip()
    cleaned_title = cleaned_title.replace(" ", "_")
    pretty = soup.prettify()
    with open(f"{DIR}/{cleaned_title}.txt","w") as write_file:
        write_file.write(pretty)
    write_file.close()

def scrape_title(url, top_level_title):
    print("in scrape title!")
    with open(f"{DIR}/{top_level_title}.txt","r") as read_file:
        raw_soup = BeautifulSoup(read_file, 'html.parser')
        
        soup = raw_soup.find('article', {'class': 'notion-root'})
        if soup is None:
            print("Soup was none!")
            soup = raw_soup.find('article', {'class': 'notion-root full-width'})

        
        
        node_id = None
        node_top_level_title = top_level_title
        node_type = "content"
        node_level_classifier="SECTION"
        node_text = []
        node_text_embedding = []
        node_citation = f"{top_level_title}/Introduction"
        node_link = ""
        node_addendum = ""
        node_name = "Introduction"
        node_name_embedding = None
        node_summary = None
        node_summary_embedding = None
        node_hyde = None
        node_hyde_embedding = None
        node_parent = None
        node_direct_children = None
        node_siblings = None
        node_references = None
        node_incoming_references = None
        node_tags = None
        
        specific_link = ""
        # Iterate over all html elements until you find a new <h1> tag
        for tag in soup.find_all(recursive=False):
            # Add all text content of non h1 tags to the section
            if tag.name == "h1" or tag.name == "h2" or tag.name == "h3":
                node_id = f"vitalia/wiki/{top_level_title}/{node_name}"
                if (specific_link ==""):
                    node_link = url.strip()
                else:
                    node_link = url.strip() + "#" + specific_link.strip()
                aggregated_text = "".join(node_text)
                
                node_text_embedding = create_embedding(aggregated_text)
                row_data = {"node_id": node_id, 
                    "node_top_level_title": top_level_title,
                    "node_type": node_type,
                    "node_level_classifier": node_level_classifier,
                    "node_text": node_text,
                    "node_text_embedding": node_text_embedding,
                    "node_citation": node_citation,
                    "node_link": node_link,
                    "node_addendum": node_addendum,
                    "node_name": node_name,
                    "node_name_embedding": node_name_embedding,
                    "node_summary": node_summary,
                    "node_summary_embedding": node_summary_embedding,
                    "node_hyde": node_hyde,
                    "node_hyde_embedding": node_hyde_embedding,
                    "node_parent": node_parent,
                    "node_direct_children": node_direct_children,
                    "node_siblings": node_siblings,
                    "node_references": node_references,
                    "node_incoming_references": node_incoming_references,
                    "node_tags": node_tags}
                for i in range(2, 10):
                    try:
                        response = insert_row_to_supabase("vitalia_node", row_data)
                        break
                    except:
                        # Remove all characters from row_data.node_id after "-version"
                        temp = row_data["node_id"]
                        if("-version" in row_data["node_id"]):
                            temp = row_data["node_id"].split("-version")[0]

                        row_data["node_id"] = temp + f"-version_{i}"
                        
                specific_link = tag['id']
                node_name = tag.get_text().strip()
                node_text = []
                node_text_embedding = []
                node_citation = f"{top_level_title}/{node_name}"
                node_addendum = ""
                node_name_embedding = None
                node_summary = None
                node_summary_embedding = None
                node_hyde = None
                node_hyde_embedding = None
                node_parent = None
                node_direct_children = None
                node_siblings = None
                node_references = None
                node_incoming_references = None
                node_tags = None
            else:
                text = tag.get_text().strip()
                cleaned_text = re.sub(r'\s+', ' ', text).strip()
                node_text.append(cleaned_text)
                

        node_id = f"vitalia/wiki/{top_level_title}/{node_name}"
        if (specific_link ==""):
            node_link = url.strip()
        else:
            node_link = url.strip() + "#" + specific_link.strip()
        
        aggregated_text = "".join(node_text)
        
        node_text_embedding = create_embedding(aggregated_text)
        row_data = {"node_id": node_id, 
                    "node_top_level_title": top_level_title,
                    "node_type": node_type,
                    "node_level_classifier": node_level_classifier,
                    "node_text": node_text,
                    "node_text_embedding": node_text_embedding,
                    "node_citation": node_citation,
                    "node_link": node_link,
                    "node_addendum": node_addendum,
                    "node_name": node_name,
                    "node_name_embedding": node_name_embedding,
                    "node_summary": node_summary,
                    "node_summary_embedding": node_summary_embedding,
                    "node_hyde": node_hyde,
                    "node_hyde_embedding": node_hyde_embedding,
                    "node_parent": node_parent,
                    "node_direct_children": node_direct_children,
                    "node_siblings": node_siblings,
                    "node_references": node_references,
                    "node_incoming_references": node_incoming_references,
                    "node_tags": node_tags}
        for i in range(2, 10):
            try:
                response = insert_row_to_supabase("vitalia_node", row_data)
                break
            except:
                # Remove all characters from row_data.node_id after "-version"
                temp = row_data["node_id"]
                if("-version" in row_data["node_id"]):
                    temp = row_data["node_id"].split("-version")[0]

                row_data["node_id"] = temp + f"-version_{i}"
        




if __name__ == "__main__":
    main()


def create_embedding(input_text):
    """Create an embedding from a string of text."""
    response = client.embeddings.create(
        input=input_text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def insert_row_to_supabase(table_name, row_data):
    """
    Insert a row into any table in supabase
    """
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        data, count = supabase.table(table_name).insert(row_data).execute()
        return data
    except Exception as e:
        print(f"An error occurred: {e}")