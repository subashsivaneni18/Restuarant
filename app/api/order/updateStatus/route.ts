import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"
import {pusherServer} from '@/libs/pusher'

export async function POST(req:Request){
    try {
        const body = await req.json()
        const orderId = body.id

        const order = await prisma.order.findUnique({
            where:{
                id:orderId
            }
        })

        if (!order?.paymentStatus) {
           return NextResponse.json({
             "message":"Payment Not Completed",
             "sucess":false
           })
        }
        const currentOrder = await prisma.order.update({
            where:{
                id:orderId
            },
            data:{
                completedStatus:true
            }
        })

        pusherServer.trigger(
          "order-updates",
          "updateOrderStatus",
          currentOrder
        );

        return NextResponse.json(currentOrder)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}