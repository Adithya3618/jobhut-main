import { NextResponse } from 'next/server'
import mammoth from 'mammoth'
import PDFParser from 'pdf2json';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let text = ''

    // Log file info for debugging
    console.log('Uploaded file info:', { name: file.name, type: file.type, size: file.size })

    try {
      if (file.type === 'application/pdf') {
        // Use pdf2json for PDF parsing
        text = await new Promise((resolve, reject) => {
          const pdfParser = new PDFParser();
          pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
          pdfParser.on('pdfParser_dataReady', pdfData => {
            // Defensive check for structure
            if (!pdfData.formImage || !pdfData.formImage.Pages) {
              console.error('pdf2json: Unexpected PDF structure:', JSON.stringify(pdfData, null, 2));
              reject(new Error('This PDF format is not supported for text extraction. Please try a different PDF or convert to DOCX.'));
              return;
            }
            // Extract text from all pages
            const allText = pdfData.formImage.Pages.map(page =>
              page.Texts.map(t => decodeURIComponent(t.R.map(r => r.T).join(''))).join(' ')
            ).join('\n');
            resolve(allText);
          });
          pdfParser.parseBuffer(buffer);
        });
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
      } else {
        return NextResponse.json({ success: false, error: 'Unsupported file type. Please upload a PDF or DOCX resume.' }, { status: 400 })
      }
    } catch (parseError) {
      console.error('Error parsing file:', parseError)
      let userMessage = 'Failed to parse file. '
      if (parseError.message && parseError.message.includes('password')) {
        userMessage += 'The file appears to be password-protected or encrypted. Please upload an unprotected file.'
      } else if (parseError.message && parseError.message.includes('Unexpected')) {
        userMessage += 'The file format may be corrupted or not a valid PDF/DOCX. Please check your file.'
      } else {
        userMessage += 'Please ensure your file is a valid, unencrypted PDF or DOCX. If the problem persists, try converting your resume to a different format.'
      }
      return NextResponse.json({ success: false, error: userMessage, details: parseError.message, stack: parseError.stack }, { status: 400 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'No text content found in file' }, { status: 400 })
    }

    return NextResponse.json({ success: true, text })
  } catch (error) {
    console.error('Error in file upload:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

