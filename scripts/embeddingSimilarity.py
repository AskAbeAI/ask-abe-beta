import psycopg2
import openai
import os
import utilityFunctions as util
from utilityFunctions import get_embedding
from utilityFunctions import supabase_connect


def main():
    user_embedding_search()
    
# Internal tool for testing embedding similarity
def user_embedding_search(show_explanation=False):
    if show_explanation:
        print("=== Welcome to the user embedding search function! ===")
        print("-This function allows the user to input some user generated text and receive the closest \"match\" found in the California Legal Code.")
        print("-User generated text is converted into vector embeddings using OpenAI's text-embedding-ada-002 model.")
        print("-This vector embedding is compared to a database of embedding for the entire legal code using cosine similarity search.")
        print("-Please try inputting more complex phrases and questions. The more verbiose language you use the better testing I get!.")
    print()

    user_text = ""
    while True:
        print("You will be prompted to enter some parameters. Enter\'q\' any time to exit the function:")
        
        user_text = input("  1. A user query to compare to PSQL:\n")
        if user_text == "q":
            exit(0)
        while True:
            try:
                user_match_threshold = float(input("  2. A match threshold between [0 to 1.0]. Higher values means a stricter search. Defaults to 0.5.\n"))
                if user_match_threshold >= 1 or user_match_threshold <= 0:
                    print("Please put a valid float in the range [0,1] exclusive.")
                    continue
                break
            except:
                if user_text == "q":
                    exit(0)
                print("Please put a valid float from [0,1] exclusive.")
        while True:
            try:
                user_match_count = int(input("  3. The number of maximum match_counts you would like to see (1-20).\n"))
                if user_match_count > 20 or user_match_count <= 0:
                    print("Please put a valid int in the range (1, 20) inclusive.")
                    continue
                break
            except:
                if user_match_count == "q":
                    exit(0)
                print("Please put a valid int in the range (1, 20) inclusive.")
        print()
        compare_content_embeddings(user_text, True, user_match_threshold, user_match_count)
        #compare_definition_embeddings(user_text, True, user_match_threshold, user_match_count)
        #compare_title_path_embeddings(user_text, True, user_match_threshold, user_match_count)
        print()

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