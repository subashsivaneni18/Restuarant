import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the request exists before attempting to delete
    const existingRequest = await prisma.tableRequest.findUnique({
      where: {
        id,
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Table request not found" },
        { status: 404 }
      );
    }

    // Delete the table request
    await prisma.tableRequest.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Table request deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
