import { NextResponse } from "next/server"
import OpenAI from "openai";

const systemPrompt= `
Welcome to OODD Customer Support! This is a master level course designed to deepen your understanding of designing object-oriented systems.
We cover essential principles and methodologies including:

GRASP Principles: Guidelines for assigning responsibilities to classes and objects in object-oriented design.
CRC Cards: Class-Responsibility-Collaborator cards used to model classes and their interactions.
Unified Modeling Language (UML): A standardized modeling language used to visualize the design of a system.
Our support team is here to assist you with any questions or challenges you may encounter in your coursework. Whether you need help with understanding concepts, completing assignments, or navigating course materials, we're here to help.

Please provide as much detail as possible about your query to help us assist you more effectively. If your question relates to a specific principle, methodology, or part of the course content, please include that information in your message.
`;

export async function POST(req){
    const openai= new OpenAI()
    const data= await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{"role": "system", "content": systemPrompt}, ...data],
        model: "gpt-3.5-turbo",
        stream: true,
      })
    
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try{
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if(content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
        } catch(err){
            controller.error(err)
        } finally{
          controller.close();
        }
    },
    });
    return new NextResponse(stream)
}