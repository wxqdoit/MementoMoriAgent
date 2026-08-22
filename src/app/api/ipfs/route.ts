import { NextResponse } from 'next/server';
import { generateCID } from '@/lib/filecoin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = typeof body.content === 'string' ? body.content : JSON.stringify(body);
    const cid = generateCID(content);

    return NextResponse.json({
      success: true,
      cid,
      sizeBytes: Buffer.byteLength(content, 'utf-8'),
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
