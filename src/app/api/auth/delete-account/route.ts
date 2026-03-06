import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Delete user's shop and related data first (cascade)
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { shop: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete shop if exists (this will cascade delete inventory and orders)
    if (user.shop) {
      await db.shop.delete({
        where: { id: user.shop.id },
      });
    }

    // Delete user's orders
    await db.order.deleteMany({
      where: { buyerId: userId },
    });

    // Finally delete the user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
