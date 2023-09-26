import psycopg2
import openai
import os
import utilityFunctions as util
from utilityFunctions import get_embedding
from utilityFunctions import supabase_connect


def main():
    pass
    
# Return most relevant content embeddings
def compare_content_embeddings(user_query, match_threshold=0.5, match_count=5):
    embedding = get_embedding(user_query)
    supa = supabase_connect()
    
    result = supa.functions("match_embedding", ['{}'.format(embedding), match_threshold, match_count]).execute()
    return result

# Format one row of the table in a string, adding universal citation (State Code § Section #)
def format_sql_rows(list_of_rows, embedding_type="content"):
    result =""
    # Match Function returns row format:
    #  0,          1,    2,        3,     4,    5,       6,       7,       8,       9,          10,        11             12                13
    # ID, Similarity, code, division, title, part, chapter, article, section, content, definitions, titlePath, contentTokens, definitionTokens
    #print("\nFormatting rows for type: {}".format(embedding_type))
    citation_list = []
    for row in list_of_rows:
        result += "\n*"
        content = row[9]
        if embedding_type == "definitions":
            content = row[10]
        elif embedding_type == "title_path":
            content = row[11]
        citation = "Cal. {} § {}".format(row[2],row[8])
        link = row[14]
        citation_list.append((citation, content, link))
        result += "{}:\n{}\n".format(citation, content)
    result += "\n"
    result_list = result.split("*")
    result_list = result_list[1:]
    return result_list, citation_list

if __name__ == "__main__":
    main()