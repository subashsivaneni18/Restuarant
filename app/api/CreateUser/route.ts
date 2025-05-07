import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function POST(req:Request){
    try {
        const body = await req.json();
        const email = body.email;
        const name = body.name;

        if(!email || !name || typeof(email)!=='string' || typeof(name)!=='string'){
            console.log("Invalid input");
            return NextResponse.json({"Error":"Invalid Input"})
        }

        const newUser = await prisma.user.create({
            data:{
                email:email,
                name:name
            }
        })

        return NextResponse.json(newUser);
    } catch (error) {
        console.log(error);
        return NextResponse.json({"Error":"Internal Server Error"})
    }
}