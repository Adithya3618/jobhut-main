import { NextResponse } from 'next/server';
import { getPublicApiConfigs } from '../../lib/apiHelpers';

export async function GET() {
  try {
    const apis = await getPublicApiConfigs();
    return NextResponse.json({ success: true, apis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 