import { NextRequest, NextResponse } from "next/server";
import {S3Client, ListObjectsV2Command} from "@aws-sdk/client-s3";

const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});

export async function GET(request: NextRequest) {
    const prefix = request.nextUrl.searchParams.get("prefix") || undefined;
    const command = new ListObjectsV2Command({
        Bucket: "bucket.private.shreyver.dev",
        Delimiter: '/',
        Prefix: prefix
    });
    const response = await client.send(command);

    //To display root files
    const rootFiles = response.Contents?.map((e) => ({
        Key: e.Key,
        Size: e.Size,
        LastModified: e.LastModified})
    );

    //To display root folders
    const rootFolders = response.CommonPrefixes?.map((e) => e.Prefix);

    return NextResponse.json({ files: rootFiles, folders: rootFolders });
}