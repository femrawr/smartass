import fs from 'fs/promises';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default {
    context: '',

    async giveContext() {
        if (this.context !== '') return;

        this.context = await fs.readFile('context.txt', 'utf-8');
    },

    async submit(text, model) {
        await this.giveContext();

        const prompt = `
            Here is some background context: ${this.context}

            Now Answer this question: "${text}"
        `;

        try {
            const res = await ai.models.generateContent({
                model: model,
                contents: prompt
            });

            return res.text;
        } catch (e) {
            return e;
        }
    }
};