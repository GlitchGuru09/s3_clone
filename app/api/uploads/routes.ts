import { NextRequest, NextResponse } from "next/server";
import {S3Client, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});

export async function GET(request: NextRequest) {
    const key = request.nextUrl.searchParams.get("key");
    if (!key) {return NextResponse.json({ error: "Missing 'key' parameter" }, { status: 400 });}
    const command = new GetObjectCommand({
        Bucket: "bucket.private.shreyver.dev",
        Key: key,
    })
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return NextResponse.json({ url });
}

export async function PUT(request: NextRequest) {
    const key = request.nextUrl.searchParams.get("key");
    if (!key) {return NextResponse.json({ error: "Missing 'key' parameter" }, { status: 400 });}
    const command = new PutObjectCommand({
        Bucket: "bucket.private.shreyver.dev",
        Key: key,
    })
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return NextResponse.json({ url });
};
