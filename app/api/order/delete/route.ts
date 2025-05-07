import { NextResponse } from "next/server"
import prisma from '@/libs/prisma'

export async function POST(req:Request){
    try {
        const body = await req.json();
        const {orderId} = body

        const deletedOrder = await prisma.order.delete({
            where:{
                id:orderId
            }
        })

        return NextResponse.json({"message":"Deleted"})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({"Message":"Internal Server Error"})
    }
}