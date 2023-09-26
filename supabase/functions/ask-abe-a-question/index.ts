// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

// Starts one "run" of the project
const msg = new TextEncoder().encode("data: hello")

serve((_) => {
  let timerId: number | undefined;
  const body = new ReadableStream({
    start(controller) {
      timerId = setInterval(() => {
        controller.enqueue(msg);
      }, 1000);

    }, cancel() {
      if (typeof timerId === "number") {
        clearInterval(timerId);
      }
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream"
    },
  })
}

)
async function askAbe(
  userQuery: string, 
  openAiKey: string | boolean,
  printSections: boolean,
  doTesting: boolean,
  doStream: boolean
) {
  
  console.log("================================");
  console.log("======= Debug Screen :) ========");     
  console.log("================================");
  console.log("Initializing instance of Abe...");
  console.log(`User Query:\n ${userQuery}`);
      
  const [similarQueriesList, questionListRaw] = await processingStage(userQuery);

  const questionList: string[] = [];
  
  for (const question of questionListRaw) {
    if (question !== "") {
      questionList.push(question);
    }
  }
  
  const [similarContentList, legalTextList, legalTextTokens, citationList] = 
    await searchingStage(similarQueriesList);
    
  const [summaryTemplate, legalDocumentation, question] = 
    await answeringStage(questionList, legalTextList, userQuery);
    
  for (const message of answer.populateSummaryTemplate(question, legalDocumentation, summaryTemplate)) {
    if (message.includes("[FULL]")) {
      const finalAnswer = message.substring(6); 
      yield message; 
    }
  }
  const [citedSections, finalAnswer] = findSectionsCited(citationList, finalAnswer);
  yield citedSections;
}

function findSectionsCited(citationList: any[], finalAnswer: string) {

  let citedSections = "";

  for (const tup of citationList) {
    const citation = tup[0];
    if (!finalAnswer.includes(citation)) { 
      continue;
    }

    const content = tup[1];
    const link = tup[2];

    const sectionCitation = `<a href="${link}" target="_blank" id="${citation}">${citation}</a>\n<p>${content}</p>\n`;

    citedSections += sectionCitation;
  }

  return [citedSections, finalAnswer];
}

function linkAnswerToCitations(citationList: any[], finalAnswer: string) {

  for (const tup of citationList) {
    const citation = tup[0];
    if (!finalAnswer.includes(citation)) {
      continue; 
    }

    const newCitation = `<a href="#${citation}">${citation}</a>`;
    finalAnswer = finalAnswer.replace(citation, newCitation);
  }

  return finalAnswer;
}


main();
serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'



async function answeringStage(
  questionList: string[],
  legalText: string[],
  userQuery: string
) {

  console.log("Starting answering stage...");

  const responsesList = await separateAnswer(
    questionList[2], 
    legalText[2], 
    "gpt-3.5-turbo-16k"
  );

  const begin = time.now();

  console.log(" - Creating answer template with GPT 4");

  const summaryTemplate = await createSummaryTemplate(
    questionList[2], 
    responsesList
  );

  const end = time.now();

  console.log(`* Total time: ${end.minus(begin).seconds()}`);

  return [summaryTemplate, responsesList, questionList[2]];

}

async function separateAnswer(
  question: string,
  legalText: string[],
  model: string
) {

  const messageList: string[] = [];
  const responseList: string[] = [];  

  let promptTokens = 0;
  let completionTokens = 0;
  let totalTokens = 0;

  for (const section of legalText) {
    messageList.push(prompts.getPromptSimpleAnswer(section, question));
  }
  
  const begin = time.now();

  const results = await util.getCompletionList(messageList, 100, model);

  for (const completion of results) {

    //promptTokens += completion["usage"]["prompt_tokens"];
    //completionTokens += completion["usage"]["completion_tokens"];
    //totalTokens += completion["usage"]["total_tokens"];

    responseList.push(completion.choices[0].message.content);
  }

  //const totalCost = util.calculatePromptCost(model, promptTokens, completionTokens);

  let responseStr = "";

  for (const response of responseList) {
    if (response.includes("[IGNORE]")) continue;

    totalTokens += util.numTokensFromString(response);
    
    responseStr += "====\n" + response + "\n";
  }

  const end = time.now();

  //console.log(`* Total time: ${end.minus(begin).seconds()}, Total Tokens: ${totalTokens}, Total Cost: $${totalCost}`);

  return responseStr;

}

async function createSummaryTemplate(
  question: string,
  legalDocumentation: string
) {

  const promptSummarize = getPromptSummaryTemplate(question, legalDocumentation);
  
  const chatCompletion = await util.createChatCompletion(
    "gpt-4", 
    [promptSummarize],
    1,
    "will",
    true
  );

  return chatCompletion.choices[0].message.content;

}

async function* populateSummaryTemplate(
  question: string,
  legalDocumentation: string,
  template: string
) {

  const promptPopulate = getPromptPopulateSummaryTemplate(question, template, legalDocumentation);

  for (const message of util.streamChatCompletion(
    "gpt-3.5-turbo-16k",
    promptPopulate,
    0,
    "will",
    true
  )) {
    yield message;
  }

}

async function answerOneQuestion(
  promptFinalAnswer: string[],
  useGpt4: boolean
) {

  let model = "gpt-3.5-turbo-16k";
  if (useGpt4) {
    model = "gpt-4";
  }

  const who = "will";

  const chatCompletion = await util.createChatCompletion(
    model,
    promptFinalAnswer,
    0.2,
    who
  );

  const resultStr = chatCompletion.choices[0].message.content;

  const promptTokens = chatCompletion.usage.prompt_tokens;
  const completionTokens = chatCompletion.usage.completion_tokens;

  const cost = calculatePromptCost(model, promptTokens, completionTokens);

  return [resultStr, promptTokens, completionTokens, cost];

}

export {
  answeringStage,
  separateAnswer,
  createSummaryTemplate,
  populateSummaryTemplate,
  answerOneQuestion
};



async function processingStage(userQuery: string) {

  console.log("Starting processing stage...");

  // Get similar queries by calling GPT 3.5, maybe Google BARD instead
  const similarQueriesList: string[] = [];

  console.log(" - Converting query to list of questions using template");
  
  const questionList = await convertQueryToQuestionList(userQuery, "gpt-3.5-turbo");

  console.log(" - Generating similar search queries for questions");

  similarQueriesList = await getSimilarQueries(questionList, userQuery);

  return [similarQueriesList, questionList];

}

async function convertQueryToQuestionList(userQuery: string, usedModel: string) {

  const questionList = getOriginalUniversalAnswerTemplate(userQuery);
  
  const promptConvertQuestion = getPromptConvertQuestion(questionList);

  const chatCompletion = await createChatCompletion(
    usedModel, 
    "will",
    promptConvertQuestion,
    0
  );

  const convertedQuestions = chatCompletion.choices[0].message.content;

  return convertedQuestions.split("\n");

}

async function getSimilarQueries(questionList: string[], userQuery: string) {

  const contentList: string[] = [];

  const lawful = getPromptSimilarQueriesLawful(userQuery);

  //const unlawful = prompts.getPromptSimilarQueriesUnlawful(userQuery);

  const lawfulChat = await createChatCompletion(
    "gpt-4", 
    lawful,
    0,
    true
  );

  const lawfulResult = lawfulChat.choices[0].message.content;

  //const unlawfulChat = await util.createChatCompletion(
  //  "gpt-4",
  //  unlawful,
  //  0,
  //  true
  //);

  //const unlawfulResult = unlawfulChat.choices[0].message.content;

  const lawfulDct = JSON.parse(lawfulResult);
  const lawfulQueries = lawfulDct["queries"].join(" ");

  //const unlawfulDct = JSON.parse(unlawfulResult);
  //const unlawfulQueries = unlawfulDct["queries"].join(" ");

  const unlawfulQueries = null;

  const similarQueriesList = [
    lawfulQueries, 
    lawfulQueries, 
    lawfulQueries, 
    unlawfulQueries, 
    unlawfulQueries
  ];

  return similarQueriesList;

}


async function searchingStage(similarQueriesList: string[][]) {

  console.log("Starting search stage...");

  const similarContentRows: any[] = [];
  const legalTextList: string[] = [];
  const legalTextTokensList: number[] = [];

  console.log(" - Searching relevant sections for lawful template");
  
  const begin = time.now();

  const lawful = await searchSimilarContentSections(similarQueriesList[0], 40);

  const [legalText, legalTextTokens] = await accumulateLegalTextFromSections(lawful, "gpt-3.5-turbo-16k");

  const [legalTextLawful, citationList] = embeddingSimilarity.formatSqlRows(legalText);

  const end = time.now();

  console.log(`* Total time for vector similarity: ${end.minus(begin).seconds()}`);

  legalTextTokensList = [
    legalTextTokens,
    legalTextTokens,
    legalTextTokens,
    legalTextTokens,
    legalTextTokens    
  ];

  similarContentRows = [
    lawful, 
    lawful, 
    lawful,
    null,
    null
  ];

  legalTextList = [
    legalTextLawful,
    legalTextLawful,
    legalTextLawful,
    null, 
    null
  ];

  return [similarContentRows, legalTextList, legalTextTokensList, citationList];

}

async function searchSimilarContentSections(modifiedUserQuery: string, matches = 20) {

  // Get cosine similarity score of related queries to all content embeddings
  return compareContentEmbeddings(modifiedUserQuery, matches);

}

async function accumulateLegalTextFromSections(sections: any[], model: string) {

  let currentTokens = 0;
  let row = 0;
  const legalText: any[] = [];

  let maxTokens = 12000; // gpt-3.5-turbo-16k default

  if (model === "gpt-4-32k") {
    maxTokens = 24000; 
  } else if (model === "gpt-4") {
    maxTokens = 5000;
  } else if (model === "gpt-3.5-turbo") {
    maxTokens = 2000;
  }

  maxTokens = 24000; // override

  while (currentTokens < maxTokens && row < sections.length) {

    currentTokens += sections[row][12];
    legalText.push(sections[row]);
    row++;
  }

  return [legalText, currentTokens];

}


interface Row {
  id: number;
  similarity: number;
  code: string;
  division: string;
  title: string;
  part: string;
  chapter: string;
  article: string;
  section: string;
  content: string;
  definitions: string;
  titlePath: string;
  contentTokens: number;
  definitionTokens: number;
  link: string;
}

// Return most relevant content embeddings
async function compareContentEmbeddings(
  userQuery: string,
  matchThreshold = 0.5,
  matchCount = 5
) {

  const embedding = getEmbedding(userQuery);

  const supa = supabaseConnect();

  const result = await supa.functions("match_embedding", [
    embedding, 
    matchThreshold,
    matchCount
  ]).execute();

  return result;

}

// Format one row of the table in a string, adding universal citation (State Code § Section #)
function formatSqlRows(rows: Row[], embeddingType: 'content' | 'definitions' | 'title_path') {

  let result = "";

  const citationList: [string, string, string][] = [];

  for (const row of rows) {
    
    let content = row.content;

    if (embeddingType === "definitions") {
      content = row.definitions;
    } else if (embeddingType === "title_path") {
      content = row.titlePath;
    }

    const citation = `Cal. ${row.code} § ${row.section}`;
    const link = row.link;

    citationList.push([citation, content, link]);

    result += `\n* ${citation}:\n${content}\n`;

  }

  result = result.split("\n*").slice(1);

  return [result, citationList];

}


interface Message {
  role: 'system' | 'user';
  content: string; 
}

// Apply prompts to generic chatCompletion with a system and user, returns chatCompletion.messages
function applyToGeneric(system: string, user: string): Message[] {
  return [
    {role: 'system', content: system},
    {role: 'user', content: user}
  ];
}

// PRE PROCESSING PROMPTS ===============================================

// Generates an array of similar search queries
function getPromptSimilarQueriesLawful(userQuery: string): Message[] {

  const system = `You are a helpful legal assistant that rephrases a user's legal question into many legal statements that include key terms. The goal is to generate 16 new legal statements that have the same terminology and format as actual legislation.

Generate legal statements that follow these criteria:
1. Include similar meaning of the original question. 
2. Include variation of related keywords from this list ["Lawful", "legal", "valid", "warranted", "legitimate", "permissible", "rights", "privileges", "authority", "as authorized by", "as otherwise provided by law", "shall not be a violation of state or local law", "shall be lawful"]

Return in JSON format: {"queries": ["query_1", "query_2", "query_3"]}`;

  const user = `User question: ${userQuery}`;

  return applyToGeneric(system, user);
}

function getPromptSimilarQueriesUnlawful(userQuery: string): Message[] {

  const system = `You are a helpful legal assistant that rephrases a user's legal question into many legal statements that include key terms. The goal is to generate 16 new legal statements that have the same terminology and format as actual legislation.

Generate legal statements that follow these criteria:  
1. Include similar meaning of the original question.
2. Include variation of related keywords from this list ["unlawful", "criminal", "illicit", "prohibited", "illegitimate", "against the law", "shall be punished", "guilty of", "restrictions", "does not permit", "violation", "the offense"]

Return in JSON format: {"queries": ["query_1", "query_2", "query_3"]}`;

  const user = `User question: ${userQuery}`;

  return applyToGeneric(system, user);
}

// ANSWER PROMPTS ===============================================

// Using legal text as input, answer all questions from a specific answer template

function getPromptSummaryTemplate(
  question: string,
  legalDocumentation: string
): Message[] {
  
  // 201 tokens in system message
  const system = `Using the supplied legal question and its corresponding legal documentation, produce a markdown structure that outlines the essential themes and ideas. This structure will guide a legal expert in answering the posed question.

**Input Description:**

- **Question**: A distinct legal query needing expert interpretation.
- **Legal Documentation**: The reference material that a legal expert will use to formulate an answer.  

**Instructions:**

1. Start by dissecting the question to understand its primary themes and key concerns.
2. Delve into the legal documentation, extracting the principal ideas and related concepts that will aid in answering the question.
3. While structuring the markdown:
   - Use "#" for principal ideas taken from the legal documentation.
   - For each main idea, establish secondary points and label them using "##".
   - Beneath each secondary point, highlight any tertiary points with "###".  
   - For each detail or specific concept which applies to an idea, write ">" and guidance to the legal expert on how to answer the legal question, as well as legal citations from where this answer may come from.
4. Keep the guidance concise, especially for the ">" level. Avoid placeholders or lengthy notes. The emphasis should be on clear headers and brief guidance.  

The first main idea should always be a rephrasing of the question followed by a sub-idea called TLDR, which has guidance on giving a simple and short answer to the user question.

**Output:**

A carefully curated markdown blueprint with clear titles, headers, and succinct guidance. This blueprint should seamlessly guide a legal expert in their endeavor to comprehensively address the posed question using the supplied legal documentation.`;

  const user = JSON.stringify({
    Question: question,
    LegalDocumentation: legalDocumentation
  });

  return applyToGeneric(system, user);
}

function getPromptPopulateSummaryTemplate(
  question: string,
  template: string,
  legalDocumentation: string
) {

  const user = JSON.stringify({
    Template: template,
    LegalDocumentation: legalDocumentation, 
    Question: question
  });

  const system = `Using the provided markdown template and the associated legal documentation, improve the initial guidance from the legal expert to become a full answer with pertinent details and in line citations. 

**Input Description:**

- **Template**: A structured markdown outline utilizing various levels of headers (#, ##, ###, ####). The ">" symbol in the template signifies guidance from a legal expert, which should be improved and refined.
  
- **Legal Documentation**: Your primary reference material containing all necessary information to address the legal inquiry. Use this document to derive content to replace the guidance after the ">" in the template.
  
- **Question**: The specific legal inquiry that will be answered using the populated template and the legal documentation.

**Instructions:**

1. Thoroughly acquaint yourself with the template. Note areas marked by the ">" symbol; these are pointers from the legal expert that should be improved and refined with content and citations.
  
2. Delve into the legal documentation, sourcing information that aligns with the ">" pointers and the related headers.
  
3. In the sections with ">", substitute the expert's guidance with relevant content from the legal documentation, ensuring to include legal citations in line.
  
4. Emphasize accuracy and integrity, ensuring that the content reflects the essence and specifics of the original legal documentation. 

**Output:**

A refined markdown template where guidance after the ">" symbol has been seamlessly refined with content from the legal documentation, resulting in a well-structured response to the legal inquiry.`

  return applyToGeneric(system, user);
}


function getPromptSimpleAnswer(
  legalText: string,
  question: string
): Message[] {

  const system = `As a helpful legal assistant, your goal is to answer a user's question by referencing information in a legal document. Your answer should be brief, concise, and provide a simple response to the question. Once you have answered the question accurately, exit the conversation. All provided legal documentation is verified to be up to date, legally accurate, and not subject to change.
    Include a citation of any relevant legal principles or statutes from the legal text that support the answer given.
    Citation Format Example: (Cal. HSC § 11362.785)
        
    Ensure the generated answer directly addresses the question asked by the user.
    If absolutely none of the legal text does not specifically address the question, return "[IGNORE]" at the end of your answer.`;

  const user = `Read the entire legal documentation and answer the following question from the documentation:
    Question: ${question}
    Legal documentation:${legalText}`;

  return applyToGeneric(system, user);
}

function getPromptUpdateAnswer(
  legalText: string,
  question: string  
): Message[] {

  const system = `As a helpful legal assistant, answer a legal question in a simple and concise manner. You will be provided with a legal question and accompanying legal documentation.

Follow these guidelines:  
1. Ensure the answer directly addresses the legal question and is easy to understand.
2. Include a clear citation to the specific legal section that supports the answer. 
3. Keep the answer concise, and answer the question in 1 topic sentence.
4. If you can answer yes or no to the question, include yes or no in your answer.`;

  const user = `question: ${question}
    documentation: ${legalText}`;

  return applyToGeneric(system, user);
}


// SCORING PROMPTS ===============================================

// Score questions on a) relevancy of legal text (sections) to user's question, b) quality of generated answer based on legal text
function getPromptScoreQuestions(
  legalText: string,
  templateQuestions: string[],
  generatedAnswers: string[]
): Message[] {

  const system = `You are LawProfessorGPT, a witheringly critical legal scholar who reviews answers to legal questions to ensure that they are comprehensive and grounded entirely in the provided legal text.

    You will be provided pairs of questions and answers to score.
    For each pair, answer the following questions and output a score in the format [(Relevance_score 1, Answer_score 1), (), (), (), ()].
        Relevance_score: Based on the provided legal text, how relevant are the given sections of legal text to the user's question (on a scale from 0 to 100)?
        Answer_score: How well does the provided answer address the user's question based on the legal text (on a scale from 0 to 100)?`;

  const user = `Legal Text: ${legalText}\n\n
    (Question 1: ${templateQuestions[0]}, Answer 1: ${generatedAnswers[0]})\n  
    (Question 2: ${templateQuestions[1]}, Answer 2: ${generatedAnswers[1]})\n
    (Question 3: ${templateQuestions[2]}, Answer 3: ${generatedAnswers[2]})\n
    (Question 4: ${templateQuestions[3]}, Answer 4: ${generatedAnswers[3]})\n
    (Question 5: ${templateQuestions[4]}, Answer 5: ${generatedAnswers[4]})\n`;

  return applyToGeneric(system, user);
}

// Combine and rephrase all template questions to ask about specific topics in a user query
function getPromptConvertQuestion(questionList: string[]): Message[] {

  let systemFormat = '';

  for (let i = 0; i < questionList.length - 1; i++) {
    systemFormat += `QUESTION ${i+1}:`;
  }

  const system = `You will be provided with a user query and generic questions.

    Rephrase all questions by applying the topics in the user_query. Keep question 1 and 2 in their original phrasing.

    Output should be in a single string with the following format:
    ${systemFormat}`;
  
  const user = questionList;

  return applyToGeneric(system, user);

}


// UNIVERSAL ANSWER TEMPLATES ===============================================

// USE THIS
function getOriginalUniversalAnswerTemplate(userQuery: string): string[] {

  return [
    `User_Query: ${userQuery}\n`,
    `QUESTION 1: What is the simple answer to ${userQuery}?\n`, 
    `QUESTION 2: What is the exact legal text that answers ${userQuery}?\n`,
    `Question 3: What rights and privileges does a user have relating to TOPICS?\n`,
    `Question 4: What are restrictions, caveats, and conditions to TOPICS?\n`,
    `Question 5: What are any penalties, punishments, or crimes which apply to violating restrictions of TOPICS?`
  ];

}

// DECORATORS

// Debug decorator specifically for gpt completions
function gptWrapper(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  
  const original = descriptor.value;

  descriptor.value = function(...args: any[]) {

    let printDebug = false;

    if (args[0].hasOwnProperty('debugPrint')) {
      printDebug = args[0].debugPrint;
    }

    if (printDebug) {
      console.log(`## Before openAI create_chat_completion:
        ## Used Model: ${args[0].usedModel}
        ## Function Input: ${JSON.stringify(args[0].promptMessages)}`);
    }

    const begin = Date.now();

    const result = original.apply(this, args);
    
    const end = Date.now();

    if (printDebug) {

      const promptTokens = result.usage.promptTokens;
      const completionTokens = result.usage.completionTokens;
      const totalTokens = promptTokens + completionTokens;

      const totalCost = calculatePromptCost(
        args[0].usedModel, 
        promptTokens,
        completionTokens
      );

      console.log(`  * Total time in ${original.name}: ${end - begin} ms, 
        Total Tokens: ${totalTokens}, 
        Total Cost: $${totalCost.toFixed(2)}`);
    }

    return result;

  };

  return descriptor;

}

// General debug decorator
function debug(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  
  const original = descriptor.value;

  descriptor.value = function(...args: any[]) {

    console.log(`Calling ${original.name} with args: ${JSON.stringify(args)}`);
    
    const begin = Date.now();

    const result = original.apply(this, args);

    const end = Date.now();

    console.log(`${original.name} ran in ${end - begin} ms.`);
    console.log(`${original.name} returned: ${JSON.stringify(result)}`);

    return result;

  };

  return descriptor;

}


// UTILITY FUNCTIONS

function numTokensFromString(text: string) {
  // TODO: implement tokenization
  return text.length; 
}


// Create embeddings, previously embedCodes.py

async function getEmbeddingAndToken(text: string, model = "text-embedding-ada-002") {
  const embed = await openai.embedding.create({
    input: text,
    model  
  });

  return [embed.data[0].embedding, embed.usage.totalTokens];
}

// Return just the embedding
async function getEmbedding(text: string, model = "text-embedding-ada-002") {
  const result = await openai.embedding.create({
    input: text,
    model
  });

  return result.data[0].embedding;
}


// PSQL Access Functions, previously getPSQLConn.py

async function supabaseConnect() {
  // connect to supabase
  return supabaseClient; 
}

async function selectAndFetchRows(conn: any, query: string) {
  const { data, error } = await conn
    .from('table')
    .select()
    .order('id');

  return data;  
}


// OPENAI API FUNCTIONS

interface CompletionOptions {
  model?: string;
  promptMessages?: string[];
  debugPrint?: boolean;
  temperature?: number;
  topP?: number;
  n?: number;
  stream?: boolean;
  stop?: string[];
  presencePenalty?: number;
  frequencyPenalty?: number;  
}

@gptWrapper
async function createChatCompletion({
  model = "gpt-3.5-turbo",
  promptMessages,
  debugPrint = false,
  temperature = 0.4,
  topP = 1,
  n = 1,
  stream = false,
  stop,
  presencePenalty = 0,
  frequencyPenalty = 0  
}: CompletionOptions) {

  const completion = await openai.createChatCompletion({
    model,
    messages: promptMessages,
    temperature,
    topP, 
    n,
    stream,
    stop,
    presencePenalty,
    frequencyPenalty
  });

  return completion;

}

async function* streamChatCompletion({
  model = "gpt-3.5-turbo",
  promptMessages,
  temperature = 0.4,
  topP = 1,
  n = 1,
  stream = true,
  stop,
  presencePenalty = 0,
  frequencyPenalty = 0
}: CompletionOptions) {

  const completion = await openai.createChatCompletion({
    model,
    messages: promptMessages,
    temperature,
    topP,
    n,
    stream,
    stop,
    presencePenalty,
    frequencyPenalty
  });

  for await (const chunk of completion) {
    yield chunk.choices[0].delta; 
  }

}

// Prompt cost calculations
function calculatePromptCost(model: string, promptTokens: number, completionTokens: number) {

  const rates = {
    "gpt-3.5-turbo": [0.0015, 0.002],
    "gpt-3.5-turbo-16k": [0.003, 0.004],
    "gpt-4": [0.03, 0.06],
    "gpt-4-32k": [0.06, 0.12]
  };

  const promptRate = rates[model][0];
  const completionRate = rates[model][1];

  const cost = (promptRate * promptTokens) + (completionRate * completionTokens);

  return cost;

}


// BATCH COMPLETIONS

class ProgressLog {

  total: number;
  done = 0;
  model: string;

  constructor(total: number, model: string) {
    this.total = total;
    this.model = model;
  }

  increment() {
    this.done++;
  }

  toString() {
    return `OpenAI ${this.model} API call ${this.done}/${this.total}.`;
  }

}

async function getCompletion(
  content: string[], 
  session: any,
  semaphore: any,
  progressLog: ProgressLog,
  model: string
) {

  const response = await session.post('https://api.openai.com/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${openai.key}`
    },
    json: {
      model,
      messages: content,
      temperature: 0  
    }
  });

  const json = await response.json();

  progressLog.increment();
  console.log(progressLog.toString());

  return json;

}

async function getCompletionList(
  contents: string[][],
  maxParallel: number,
  model = "gpt-3.5-turbo"
) {

  const semaphore = new Semaphore(maxParallel);
  const progress = new ProgressLog(contents.length, model);

  const session = new OpenAISession({
    apiKey: openai.key
  });

  const results = await Promise.all(
    contents.map(content => getCompletion(content, session, semaphore, progress, model))
  );

  return results;

}

