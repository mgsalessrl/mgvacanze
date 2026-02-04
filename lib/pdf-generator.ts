import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

interface QuoteData {
  customer_name: string
  customer_address?: string
  start_date: string
  end_date: string
  boat_name: string
  guests: number
  rental_price: number
  discount: number
  discount_type: 'fixed' | 'percent'
  extras: Array<{ name: string; price: number }>
  total_price: number
  quote_number: string // e.g. "2024-001"
}

export async function generateQuotePDF(data: QuoteData): Promise<Uint8Array> {
  const filePath = path.join(process.cwd(), 'carta intestata mg vacanze.pdf')
  
  // Fallback if file doesn't exist (dev environment without file)
  let pdfDoc: PDFDocument
  try {
    const existingPdfBytes = fs.readFileSync(filePath)
    pdfDoc = await PDFDocument.load(existingPdfBytes)
  } catch (e) {
    console.warn("Carta intestata non trovata, creo nuovo PDF vuoto", e)
    pdfDoc = await PDFDocument.create()
    pdfDoc.addPage([595.28, 841.89]) // A4
  }

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pages = pdfDoc.getPages()
  let page = pages[0]
  const { width, height } = page.getSize()

  // Layout Constants
  const marginLeft = 60
  const marginRight = 60
  const contentWidth = width - marginLeft - marginRight
  const lineVal = 20
  let y = height - 200 // Start content y-position (assuming header takes top 200px)

  // Helper to draw text and advance cursor
  const drawLine = (text: string, font = helveticaFont, size = 11, color = rgb(0,0,0)) => {
    page.drawText(text, { x: marginLeft, y, size, font, color })
    y -= lineVal
  }

  const drawLabelValue = (label: string, value: string) => {
    page.drawText(label, { x: marginLeft, y, size: 11, font: helveticaBold })
    page.drawText(value, { x: marginLeft + 120, y, size: 11, font: helveticaFont })
    y -= lineVal
  }

  // --- CONTENT ---

  // Title
  y -= 20
  page.drawText('PREVENTIVO DI NOLEGGIO', { 
    x: marginLeft, 
    y, 
    size: 18, 
    font: helveticaBold, 
    color: rgb(0, 0, 0.5) // Dark Blue
  })
  y -= 40

  // Info Box
  drawLabelValue('Preventivo N°:', data.quote_number)
  drawLabelValue('Data:', new Date().toLocaleDateString('it-IT'))
  drawLabelValue('Cliente:', data.customer_name)
  if (data.customer_address) drawLabelValue('Indirizzo:', data.customer_address)
  y -= 20

  // Boat Details
  page.drawText('Dettagli Noleggio', { x: marginLeft, y, size: 14, font: helveticaBold })
  y -= 25
  
  drawLabelValue('Imbarcazione:', data.boat_name)
  drawLabelValue('Periodo:', `${new Date(data.start_date).toLocaleDateString('it-IT')} - ${new Date(data.end_date).toLocaleDateString('it-IT')}`)
  drawLabelValue('Ospiti:', data.guests.toString())
  y -= 20

  // Pricing Table
  y -= 10
  const colPriceX = width - marginRight - 100
  
  // Header
  page.drawRectangle({ x: marginLeft, y: y - 5, width: contentWidth, height: 25, color: rgb(0.95, 0.95, 0.95) })
  page.drawText('Descrizione', { x: marginLeft + 5, y: y + 2, size: 10, font: helveticaBold })
  page.drawText('Importo', { x: colPriceX, y: y + 2, size: 10, font: helveticaBold })
  y -= 30

  // Items
  // 1. Rental
  page.drawText(`Noleggio ${data.boat_name}`, { x: marginLeft + 5, y, size: 10, font: helveticaFont })
  page.drawText(`€ ${data.rental_price.toFixed(2)}`, { x: colPriceX, y, size: 10, font: helveticaFont })
  y -= 20

  // 2. Extras
  data.extras.forEach(extra => {
    page.drawText(extra.name, { x: marginLeft + 5, y, size: 10, font: helveticaFont })
    page.drawText(`€ ${extra.price.toFixed(2)}`, { x: colPriceX, y, size: 10, font: helveticaFont })
    y -= 20
  })

  // 3. Discount
  if (data.discount > 0) {
    const discountLabel = data.discount_type === 'percent' 
      ? `Sconto (${data.discount}%)` 
      : 'Sconto'
    const discountValue = data.discount_type === 'percent'
      ? (data.rental_price * data.discount / 100)
      : data.discount

    page.drawText(discountLabel, { x: marginLeft + 5, y, size: 10, font: helveticaFont, color: rgb(0.8, 0, 0) })
    page.drawText(`- € ${discountValue.toFixed(2)}`, { x: colPriceX, y, size: 10, font: helveticaFont, color: rgb(0.8, 0, 0) })
    y -= 20
  }

  // Divider Line
  page.drawLine({
    start: { x: marginLeft, y: y + 10 },
    end: { x: width - marginRight, y: y + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })
  
  // Total
  y -= 10
  page.drawText('TOTALE', { x: colPriceX - 60, y, size: 12, font: helveticaBold })
  page.drawText(`€ ${data.total_price.toFixed(2)}`, { x: colPriceX, y, size: 12, font: helveticaBold })

  // Footer/Terms (if space allows)
  y -= 80
  if (y < 100) {
    page = pdfDoc.addPage([595.28, 841.89])
    y = height - 100
  }

  page.drawText('Note e Condizioni:', { x: marginLeft, y, size: 10, font: helveticaBold })
  y -= 15
  page.drawText('Il presente preventivo ha validità di 7 giorni.', { x: marginLeft, y, size: 9, font: helveticaFont })
  y -= 12
  page.drawText('La prenotazione si intende confermata al ricevimento della caparra.', { x: marginLeft, y, size: 9, font: helveticaFont })

  return await pdfDoc.save()
}
