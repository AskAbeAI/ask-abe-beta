import {
    Configuration,
    OpenAIApi,
} from 'openai-edge';
import { createClient } from "@supabase/supabase-js";
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
import { ApplicationError, UserError } from '@/lib/errors';



export default async function handler(req: NextRequest, res: NextApiResponse) {

    console.log("===========================================");
    console.log("======= TEMPLATE - Debug Screen :) ========");
    console.log("===========================================");


    const requestData: any = req.body;
    // CHECK FOR INITIAL ERRORS


    try {
        // API LOGIC HERE

        res.status(200).json({ statusMessage: 'SUCCESS MESSAGE!' });
    } catch (error) {
        res.status(400).json({ errorMessage: `An error occurred in FILE: ${error}` });
    } finally {
        console.log("Exiting FILENAME.ts!");
        res.end();
        return;
    }
}