import {
	Configuration,
	OpenAIApi,
} from 'openai-edge';
import { createClient } from "@supabase/supabase-js";
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
import { ApplicationError, UserError } from '@/lib/errors';

const openai = new OpenAI({
	apiKey: "placeholder", // defaults to process.env["OPENAI_API_KEY"]
});

export default async function handler(req: NextRequest, res: NextApiResponse) {

	console.log("===========================================");
	console.log("======= Searching- Debug Screen :) ========");
	console.log("===========================================");


	const requestData: any = req.body;
	const similarQuery = requestData.similarQuery;
	openai.apiKey = requestData.openAiKey;
	// CHECK FOR INITIAL ERRORS


	try {
		// API LOGIC HERE
		console.log(" - Searching relevant sections for lawful template");
		const embedding = await getEmbedding(similarQuery);
		console.log("Retrieved embedding");
		const client = createClient('https://jwscgsmkadanioyopaef.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c2Nnc21rYWRhbmlveW9wYWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzE1MTgsImV4cCI6MjAxMTI0NzUxOH0.1QwW9IV1TrMT72xyq2LQcmDr92tmLOEQg07mOPRLDO0');
		const { data, error } = await client.rpc('match_embedding', { query_embedding: embedding, match_threshold: 0.5, match_count: 40 });
		if (error) {
			throw new Error("Error calling match_embeddings in supabase database");
		}

		const sections = data;

		let currentTokens = 0;
		let row = 0;
		const legalText: any[] = [];
		let maxTokens = 50000; // override

		while (currentTokens < maxTokens && row < sections.length) {
			currentTokens += sections[row].contentTokens;
			legalText.push(sections[row]);
			row++;
		}
		// format sql rows
		let result = "";
		const citationList: [string, string, string][] = [];

		for (const row of sections) {

			let content = row.content;
			const citation = `Cal. ${row.code} § ${row.section}`;
			//console.log(citation)
			const link = row.link;
			citationList.push([citation, content, link]);
			result += `\n* ${citation}:\n${content}\n`;

		}
		let legalTextLawful = result.split("\n*").slice(1);

		//  return legalText, citationList
		const searchResponseBody = {
			legalText: legalTextLawful,
			citationList,
			statusMessage: 'Succesfully searched database for legal text!'
		};
		res.status(200);
		res.json(searchResponseBody);
	} catch (error) {
		res.status(400).json({ errorMessage: `An error occurred in searching: ${error}` });
	} finally {
		console.log("Exiting askAbeSearch.ts!");
		res.end();
		return;
	}
}

// Return just the embedding
async function getEmbedding(text: string) {
	const embedding = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input: text,
	});

	return embedding.data[0].embedding;
}