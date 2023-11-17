import OpenAI from "openai";

// id='file-g6yJjkTAKzGlF78Q3gODwQII', bytes=419424681, created_at=1699320197, filename='us_code_of_federal_regulations_part_1.jsonl', object='file', purpose='assistants', status='processed', status_details=None)
// id='file-dDzYq7jr6OdZi84nhgDSZsrN', bytes=419428800, created_at=1699320516, filename='us_code_of_federal_regulations_part_2.jsonl', object='file', purpose='assistants', status='processed', status_details=None)
// id='file-rfnmApC5A3j1JuE6uIjAolX8', bytes=419429514, created_at=1699320836, filename='us_code_of_federal_regulations_part_3.jsonl', object='file', purpose='assistants', status='processed', status_details=None)
// id='file-r3jY3Qc3HYKyocPeDaUrgdb5', bytes=280681392, created_at=1699321051, filename='us_code_of_federal_regulations_part_4.jsonl', object='file', purpose='assistants', status='processed', status_details=None)


const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

// async function performSearchAssistantQuery(query: string): Promise<string> {




//   const thread = await openai.beta.threads.create({
//     messages: [
//       {
//         "role": "user",
//         "content": "Can I smoke cannabis recreationally if it is legal in my state?",
//       }
//     ]
//   });
//   const run = await openai.beta.threads.runs.create(
//     thread.id,
//     { assistant_id: assistant.id }
//   );
// }

async function testAssistants(): Promise<void> {

  const searchAssistant = await openai.beta.assistants.create({
    name: "Legal Text Search Assistant",
    instructions: "You are a well-educated intern at a Law Firm who helps screen potential customers before sending them to a legal professional.\nAs an intern, you will receive legal questions from a potential customer. You are a research aide who searches through the Code of Federal Regulations, and find the most similar section to the customer's question. You will be given a legal question provided by a customer, and files which contain legal text (sourced from the legal_document) that the expert believes might be useful in constructing an answer to the legal question. Your job is to do vector similarity search on the content of the legal document. Each file provided has sections of legal text in JSON format. The node_text field contains the actual text of each section. Return the id and node text of the top 100 most similar sections.",
    tools: [{ type: "retrieval" }],
    model: "gpt-4-1106-preview",
    file_ids: ['file-g6yJjkTAKzGlF78Q3gODwQII', 'file-dDzYq7jr6OdZi84nhgDSZsrN', 'file-rfnmApC5A3j1JuE6uIjAolX8', 'file-r3jY3Qc3HYKyocPeDaUrgdb5']
  });
  console.log(searchAssistant);


  // const assistant = await openai.beta.assistants.create({
  //   name: "Clarification Assistant",
  //   instructions: "You are a well-educated intern at a Law Firm who helps screen potential customers before sending them to a legal professional.\nAs an intern, you will receive legal questions from a potential customer, as well as a list of clarifying questions the legal professional asked the customer and the customer's response to each clarifying question.\nYou help the customer by helping to refine their original legal question, using the legal professional's clarifying questions and the respective response by the customer.\nStart by creating a response called \"message_to_customer\". Here you will summarize the answers to the clarifying questions, and briefly explain how that is incorporated with the original question to create a new \"refined_question\". Next, return the new \"refined_question\", which should modify the original question to incorporate the customer's response to the clarifying question. Ensure that the refined question retains the same language from the original question. Return both in JSON Format: {\"message_to_customer\": \"\", \"refined_question\": \"\"}",
  //   tools: [{ type: "retrieval" }],
  //   model: "gpt-4-1106-preview",
  //   file_ids: ['file-g6yJjkTAKzGlF78Q3gODwQII', 'file-dDzYq7jr6OdZi84nhgDSZsrN', 'file-rfnmApC5A3j1JuE6uIjAolX8', 'file-r3jY3Qc3HYKyocPeDaUrgdb5']
  // });

  // Thread - Huge (128k tokens)

  // ContentList [User Question, Question Assistant, User clarification, Clarification Assistant]



}
