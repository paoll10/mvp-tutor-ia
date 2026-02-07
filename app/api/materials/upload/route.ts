import { NextRequest, NextResponse } from 'next/server';
import { uploadMaterial } from '@/server/materials';

// Aumenta o timeout para uploads (Gemini pode demorar para processar PDFs)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadMaterial(formData);

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, material: result.material });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
