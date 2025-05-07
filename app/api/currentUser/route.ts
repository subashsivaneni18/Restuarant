import { NextResponse } from "next/server"
import prisma from "@/libs/prisma";

export async function POST(req:Request){
    try {
        const body = await req.json()
        const email = body.email

        if(!email || typeof(email)!=='string'){
            return NextResponse.json({"Error":"Invalid Email"})
        }
        const currentUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        return NextResponse.json(currentUser)
    } catch (error) {
        console.log(error)
        return NextResponse.json({"error":error})
    }
}