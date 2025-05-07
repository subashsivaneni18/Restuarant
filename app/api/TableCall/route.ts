// /app/api/TableCall/route.ts
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import {pusherServer} from '@/libs/pusher'

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { tableNo } = data;

    if (!tableNo || typeof tableNo !== "number") {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const newTableRequest = await prisma.tableRequest.create({
      data: {
        TableNumber: tableNo,
      },
    });

    await pusherServer.trigger("adminTableRequests","newRequestAppeared",newTableRequest)

    return NextResponse.json(newTableRequest, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const AvailableTableRequests = await prisma.tableRequest.findMany({
      where: {
        completedStatus: false,
      },
    });

    return NextResponse.json(AvailableTableRequests);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
