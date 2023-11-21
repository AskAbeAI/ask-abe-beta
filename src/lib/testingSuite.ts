import OpenAI from 'openai';
import { calculateQuestionClarityScore, generateBasicQueryRefinement, generateQueryExpansion, generateEmbedding, convertGroupedRowsToTextCitationPairs, generateDirectAnswer } from './helpers';
import { jurisdiction_similarity_search_all_partitions, generate_node_keys, get_sibling_rows, aggregateSiblingRows, insert_testing_suite_question_results } from '@/lib/database';
import { node_key, node_as_row, GroupedRows } from '@/lib/types';
const openAiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiKey,
});

export async function testingSuite() {
  const testing_question_list = [
    // Will's Questions
    "Can a student on an F1 visa take equity of a startup company as a cofounder even if they can't work for the startup immediately?",
    "What are the requirements for a business to be able to have an f1 visa holder work for them under an OPT program?",
    "Can an f1 visa student invest in a startup company and recieve dividends from equity?",
    "Can I smoke cannabis recreationally?",
    // Sean Diamond's Questions
    "Can I fly my aircraft without a function exhaust gas Temperature (EGT)  probe?",
    "Do I need my landing lights to fly for-hire ?",
    "Can I fly my plane over open water ?",
    // Madeline's Questions
    "Do I have to pull over for emergency vehicles?",
    "Am I allowed to pass a public bus when they stop at a bus stop?",
    "If I'm driving on a road where the speed limit isn't posted. What is illegal speed I can go?",
    // Doug's Questions
    "How are non CPL holders in California supposed to transport firearms in their vehicles? Does the glove compartment count as a locked container?",
    "What is the difference when transporting a firearm as a CPL holder vs a non CPL holder?",
    "Does California have firearms declaration during a traffic stop?",
    "Does California have speed racing laws? Are there subsections for car racing and motorcycle racing?",
    "Can you drift legally in california?",
    "Is it legal to collect rainwater? What can you do with collected rainwater?",
    "Are you allowed to grow edible food plants in the suburbs of California? Are there restrictions to this?",
    "What car modifications are illegal in California?",
    "Can you be pulled over for driving with the lights off in low visibility conditions?",
    "When is it considered 'unlawful assembly' on state property?",
    "Are there restrictions on where you can and cannot have security cameras on your property?",
    "What import items from China have been banned in California?",
    // Best Apes Questions
    "How do I become an agent for an artist?",
    // Sean Grove's Questions
    "How are a Californian non-profit's board of directors chosen?",
    "Who are the members of a Californian non-profit's board of directors legally accountable to?",
    // Antonio & Krystel questions
    ""
  ];
  const all_question_results = [];
  for(const question of testing_question_list) {
    console.log(question);
    const quality_score = await calculateQuestionClarityScore(openai, question);

    const res_0 = await generateBasicQueryRefinement(openai, question);
    const specific_questions = res_0.specific_questions;

    const legal_statements = await generateQueryExpansion(openai, specific_questions);
    const embedded_expansion_query = JSON.stringify(await generateEmbedding(openai, legal_statements));

    const rows = await jurisdiction_similarity_search_all_partitions("ca", embedded_expansion_query, 0.8, 20, 60, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    const sibling_node_keys: node_key[] = generate_node_keys(rows);

    // Given a list of sibling_node keys, retrieve all actual rows from the database
    const combined_rows: node_as_row[] = await get_sibling_rows("ca", sibling_node_keys, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    // Get a set of all unique parent_nodes in combinedRows variable
    const combined_parent_nodes: GroupedRows = await aggregateSiblingRows(combined_rows);

    const text_citation_pairs = convertGroupedRowsToTextCitationPairs(combined_parent_nodes);

    const direct_answer = await generateDirectAnswer(openai, question, "The user is a resident of California, and asking the legal question for themselves. They're looking for a general overview. Include general regulations, penalties, lawful use cases, and unlawful use cases.", text_citation_pairs);
    await insert_testing_suite_question_results(question, quality_score, specific_questions, direct_answer, process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
    console.log(direct_answer);
  }
};
testingSuite();