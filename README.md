## Project Priorities and To-Do List:
1. Clean up the existing code base. Remove old repositories, supabase projects, other implementations. Create a dedicated github repository with a main (production) branch and other (testing or development) branches. Do some basic cleaning and documentation.
2. Integrate supabase user authentication with the website for sign in.
3. Complete a security check. Remove any local keys or links (especially supabase) and move them to a dedicated .env file or .env.vault file.
4. Scrape and gather some more datasets for testing. MICA, US Federal Code, some other states, maybe an international jurisdiction.
5. Add functionality to switch the jurisdiction you’re searching for. This will involve a comprehensive test of current prompt engineering, see if what we have for California still works for other jurisdictions.
5. Build a chatbot helper to interact with the user initially, helping guide them to find what they’re looking for. The chatbot should help define which jurisdictions a user is looking for, as well as help refine the wording and scope of their question. (More specific is better). Once the chatbot is done, send the refined question to the system for answering.


## Proposed Back-End Overhaul
I am proposing a new system for storing legal data. Instead of using a row database, I propose using a graph database to better model the structure of actual legal statutes.
### Root Nodes: 
Root nodes are the highest level structure nodes for a given legal text. For example, California splits up it's legal text into 30 Codes. Some example codes include Health and Safety, Civil Code, Penal Code, Vehical Code, etc... By definition, root nodes include one and only one description node called "General Provisions". "General Provisions" is a node that includes general information about the content found in root node, as well as define legal definitions with an "entire root" scope. Root nodes contain:
1. An array of pointers to children nodes. Children nodes must be structure nodes.
2. An array of pointers to description nodes. Description nodes at the root level are generally labeled "GENERAL PROVISIONS" in California
### Structure Nodes: 
These nodes may not contain actual legal text content, but are used to split up and structure different topics covered in a root code. Looking at the HSC root node, it has many children structure nodes which are called "Divisions". Each structure node must contain:
1. A pointer to its parent node. Parent nodes must either be a Root Node or another Structure Node.
2. An array of pointers to children nodes. Children nodes can be structure or content nodes.
3. An array of pointers to description nodes that govern this scope.
4. A range of unique identifiers for all its children. If it's first child is section 1 and last child is section 15.2, all sections within (1 to 15.2) must be its children.
5. A title and a name. Example: DIVISION 10. UNIFORM CONTROLLED SUBSTANCES ACT
### Content Nodes: 
Content nodes are the "leaf nodes" of our tree. Content nodes in California are labeled sections, and have a unique identifier that cannot be repeated in the entire root scope. Content nodes must include:
1. Unique Identifier: Example: 11362.1
2. A pointer to its parent node. Parent node must be a "Structure Node"
3. Some legal text.
4. A list of references to other content nodes (which live under the same root) cited inside the legal text.
5. A list of references to other content nodes (under a DIFFERENT root) cited inside the legal text.
6. A vector embedding of the legal text.
7. A link to the .gov source where it lives.
8. Optional: Any legal definitions found in the text and their scope. (needs research)
9. Optional: An array of pointers to description nodes that govern this scope.
### Description Nodes: 
Description nodes are a special type of "Content Node". Description nodes are for legal text which do not have content related to actual laws and regulations, but instead provide information relevant to a scope or explain the purpose of a Structure Node. All description nodes must have:
1. Unique Identifier: Example: 11000
2. A title and Name
3. Some legal text: This division shall be known as the “California Uniform Controlled Substances Act.”
4. A classification for the type of description: (interpretation instructions, legal definitions, alternative naming)
5. A pointer to its parent node. Parent node must be a "structure Node"
6. some legal text
7. A link to the .gov source where it lives
This proposed reorganization of scraped legal data will more accurately represent the true legal structure of statutes. I believe this will give several benefits to our current searching system. It will be easier to traverse the graph structure in a more meaninful way. Each "level" of the tree that isn't a root node should contain a structure node which gaves information on what contents are contained in its children. Each level can keep track of its children, and also have attached description nodes which give relevant information or legal definitions that apply to this specific scope.
