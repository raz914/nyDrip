import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import {
  formatMinutesToTime,
  parseTimeToMinutes,
} from "@/lib/bookingRules";
import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";

function mapBlock(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    startMinutes: data.startMinutes,
    endMinutes: data.endMinutes,
    reason: data.reason || "",
    createdBy: data.createdBy || "",
  };
}

export async function GET(request) {
  try {
    await requireAuthenticatedRequest(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    let blocksQuery = getAdminDb().collection("availabilityBlocks");

    if (date) {
      blocksQuery = blocksQuery.where("date", "==", date);
    }

    const snapshot = await blocksQuery.orderBy("date", "asc").get();

    return NextResponse.json({
      ok: true,
      blocks: snapshot.docs.map(mapBlock),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Unavailable blocks could not be loaded.",
      },
      { status: error.message === "Sign in is required." ? 401 : 503 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => ({}));
    const date = String(body.date || "").trim();
    const hasStartMinutes = body.startMinutes !== undefined && body.startMinutes !== "";
    const hasEndMinutes = body.endMinutes !== undefined && body.endMinutes !== "";
    const startMinutes = hasStartMinutes && Number.isFinite(Number(body.startMinutes))
      ? Number(body.startMinutes)
      : parseTimeToMinutes(body.startTime);
    const endMinutes = hasEndMinutes && Number.isFinite(Number(body.endMinutes))
      ? Number(body.endMinutes)
      : parseTimeToMinutes(body.endTime);
    const reason = String(body.reason || "").trim();

    if (!date || startMinutes === null || endMinutes === null) {
      return NextResponse.json(
        { ok: false, message: "Choose a date, start time, and end time." },
        { status: 400 },
      );
    }

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { ok: false, message: "End time must be after start time." },
        { status: 400 },
      );
    }

    const blockRef = await getAdminDb().collection("availabilityBlocks").add({
      date,
      startMinutes,
      endMinutes,
      startTime: formatMinutesToTime(startMinutes),
      endTime: formatMinutesToTime(endMinutes),
      reason: reason || "Staff unavailable",
      createdBy: user.email || user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    const createdBlock = await blockRef.get();

    return NextResponse.json({
      ok: true,
      block: mapBlock(createdBlock),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Unavailable block could not be saved.",
      },
      { status: error.message === "Sign in is required." ? 401 : 503 },
    );
  }
}

export async function DELETE(request) {
  try {
    await requireAuthenticatedRequest(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Choose a block to delete." },
        { status: 400 },
      );
    }

    await getAdminDb().collection("availabilityBlocks").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Unavailable block could not be deleted.",
      },
      { status: error.message === "Sign in is required." ? 401 : 503 },
    );
  }
}
