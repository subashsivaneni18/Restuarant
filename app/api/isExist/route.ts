import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req:Request){
    try {
        const body = await req.json();
        const email = body.email;

        if(!email || typeof(email)!=='string'){
            return NextResponse.json({"Error":"Invalid Email"});
        }

        const isExist = await  prisma?.user.findUnique({
            where:{
                email:email
            }
        })

        

        if(isExist!==null){
            return NextResponse.json({"message":"True"});
        }
        else{
            return NextResponse.json({"message":"False"});
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({"Message":"Internal Server Error"});
    }
}