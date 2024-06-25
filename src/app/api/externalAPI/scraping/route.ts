import { NextResponse } from "next/server";
import { spawn } from "child_process";

export const maxDuration = 120;

export function OPTIONS(req: Request) {
	// Set CORS headers
	const headers = {
		"Access-Control-Allow-Origin": "https://web.postman.co", // Modify as needed for your use case
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		// Include any other headers you might need for your requests
	};

	// Return the response with CORS headers and no body
	return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: Request) {
	const startTime = Date.now();

	console.log("=== EXTERNAL SCRAPING API ENDPOINT ===");

	const requestData: any = await req.json();
	const api_key: string = requestData.api_key;

	// Vitalia API key & Telegram Bot API key
	if (
		api_key !== "ak_jTMkA0rfIrMhu0WBkiHzy4YEZiVq82ym" &&
		api_key !== "ak_EjMsYGPJpLHcb48r4uCfP2ZYyrjwL"
	) {
		return NextResponse.json({
			errorMessage: `Invalid API key: ${api_key}`,
			status: 401,
		});
	}

	try {
		// Spawn a child process to run the Python script

		const pythonProcess = spawn("python", [
			"api/externalAPI/scraping/scrapeVitalia.py",
		]);
		console.log("Spawned child process");

		// Handling standard output from the Python script
		pythonProcess.stdout.on("data", (data) => {
			console.log(`stdout: ${data}`);
		});

		// Handling standard error output from the Python script
		pythonProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		// Handling the closing of the child process
		pythonProcess.on("close", (code) => {
			console.log(`child process exited with code ${code}`);
			const endTime = Date.now();
			console.log(`Execution time: ${endTime - startTime} ms`);
		});
		return NextResponse.json({ message: "SDLFKSDJL" });
	} catch (error) {
		//console.error('Error running Python script:', error);
		console.log("Error running Python script:", error);
		return NextResponse.json({
			errorMessage: `Error running Python script: ${error}`,
			status: 500,
		});
	}
}
