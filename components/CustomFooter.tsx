interface Props { }

export const CustomFooter: React.FC<Props> = () => {
    return (
        <footer className=" mt-20 flex">
            <div className="grid grid-cols-1 gap-5">
                <div id="how-to">
                    <h2 className="text-3xl font-semibold text-center">Using Ask Abe</h2>
                    <div className="bg-[#1A1B26] p-5 rounded-lg">
                        <h3 className="text-xl font-medium">Step 1: Provide OpenAI API Key</h3>
                        <ul className="list-disc pl-5">
                            <li><strong>Why</strong>: Abe utilizes GPT-4, GPT-3.5, and Ada-02 Embeddings powered by OpenAI. We would like to provide free trials, but due to current OpenAI rate limiting user provided keys are necessary.</li>
                            <li><strong>Note</strong>: Your API key is not stored. Youll need to provide it for each session due to our strict non-storage policy to ensure user privacy and security. Please see <a href="#security"className="underline text-blue-500 hover:text-blue-700">Security Policy</a> for more information.</li>
                        </ul>
                        <h3 className="text-xl font-medium">Step 2: Pose Your Legal Question</h3>
                        <ul className="list-disc pl-5">
                            <li>Ensure your question is <a href="#question-optimization"className="underline text-blue-500 hover:text-blue-700">"well-formed"</a> and <strong>has at least some legal basis</strong> in the California Legal Code <a href="https://leginfo.legislature.ca.gov/faces/codes.xhtml"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500 hover:text-blue-700">
                                statutes
                            </a>.</li>
                        </ul>
                        <h3 className="text-xl font-medium">Step 3: Let Abe Cook</h3>
                        <ul className="list-disc pl-5">
                            <li>Answers can take up to 180 seconds to process.</li>
                        </ul>
                        <h3 className="text-xl font-medium">Step 4: Instantly Verify Abes Answer with Citations</h3>
                        <ul className="list-disc pl-5">
                            <li>Abe will display his answer with inline well-formatted citations, as often as possible for unique thoughts/topics within his answer.</li>
                            <li>Clicking a citation in the answer will open the side-by-side view of legal citations.</li>
                            <li>Each legal citation will provide a link to visit the CA.gov website as well as the direct source text.</li>
                            <li>Check Abes work! You can instantly see the accuracy and legitimacy of a given answer.</li>
                        </ul>
                    </div>
                </div>
                <div id="question-optimization">
                    <h2 className="text-3xl font-semibold text-center">Optimizing Your Question For Best results</h2>
                    <div  className="bg-[#1A1B26] p-5 rounded-lg">
                        <p>While not necessary, refining a basic question to be more specific and targeted has been shown in our testing to greatly improve Abes responses.</p>
                        <ul className="list-disc pl-5">
                            <li><strong>Direct & Specific</strong>: Clearly articulate what youre seeking. For instance, instead of "What do I do if someone owes me money?", opt for "What are the small claims court processes in California for recovering debts?"</li>
                            <li><strong>Include Legal Terms</strong>: If youre aware of specific legal terminology related to your query, include it. For instance, "What is the statute of limitations for personal injury claims in California?"</li>
                            <li><strong>Grounded in CA Legal Code</strong>: Ensure your question pertains to laws and statutes within the jurisdiction of Californias legal code.</li>
                            <li><strong>Pose as a Singular Question</strong>: Refrain from asking multiple consecutive simple questions in one ask. A <strong>detailed, multi-layered, and expressive single question</strong> is much better.</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-semibold text-center">Project Limitations</h2>
                    <div className="bg-[#1A1B26] p-5 rounded-lg">
                        <ol className="list-decimal pl-5">
                            <li><strong>Accuracy Depends On Your Input</strong>: The precision of Abes responses hinges substantially on the quality and specificity of the posed question. Broad questions that lack specific details will perform much worse than an ideal "well-formed" question.</li>
                            <li><strong>Response Time</strong>: Engaging multiple APIs in the process, Abe can take up to 180 seconds to generate a response. Patience is appreciated.</li>
                            <li><strong>Limited Legal Scope</strong>: Currently, only California Legal Statutes are understood by Abe. I will add more jurisdictions, but have been really focused on improving the basic functionality on a specific dataset first.</li>
                            <li><strong>LLM Formatting Issues</strong>: The process chains multiple OpenAI chat completions, and occasionally, formatting errors might propagate throughout the response.</li>
                            <li><strong>Monetary Consideration</strong>: Each question posed to Abe can cost approximately 15 to 30 cents due to the utilization of OpenAIs API. This cost is directly borne by the user through the use of their API key.</li>
                            <li><strong>Legal Disclaimer</strong>: Ask Abe is not intended to give legal advice or replace a licensed professional. Abe is designed as an LLM tool to help with legal research and improve the crediblity of generative AI in legal use cases. </li>
                        </ol>
                    </div>
                </div>
                <div id="security">
                    <h2 className="text-3xl font-semibold text-center">Security and Privacy Policy</h2>
                    <div  className="bg-[#1A1B26] p-5 rounded-lg">
                        <p>We prioritize your privacy and security. Therefore, we consciously chose not to store API keys to prevent any misuse or unauthorized access. Each session requires a fresh API key input, ensuring that your usage of OpenAIs API is always secure and under your control.</p>
                        <ol className="list-decimal pl-5">
                            <li>We do <strong>NOT store your API Key</strong> in our database or backend. There are plans to introduce user authentication but as of now we believe its best to require key inputs for every session.</li>
                            <li>Please do not include personally identifiable and private information in your question. We do store user questions and Abes answers for debugging purposes.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-semibold mt-5 text-center">Thank You</h2>
                    <div className="bg-[#1A1B26] p-5 rounded-lg">
                        <p>We appreciate your understanding and are open to any feedback regarding user experience and security. Please fill out our feedback
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSf3d_18c8ABLBTRJTFYMLflMgSCCFjarlK_gRn6ulNCBn_DUw/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500 hover:text-blue-700">
                                form
                            </a>. Thank you.
                        </p>

                        <ul>
                            <li>
                                <a href="https://www.linkedin.com/in/will-diamond-b1724520b/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-500 hover:text-blue-700">
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="https://discord.gg/ZRm8f85W"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-500 hover:text-blue-700">
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};
