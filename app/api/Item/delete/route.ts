import pisma from "@/libs/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try {
        const body = await req.json()
        const id = body.id
        if(!id || typeof(id)!=='string'){
            return NextResponse.json({"Error":"Invalid Id"})
        }
        await prisma?.item.delete({
            where:{
                id:id
            }
        })

        return NextResponse.json({"Error":"Item Deleted"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({"Error":error})
    }
}