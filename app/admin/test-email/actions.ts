'use server'

import { sendEmail } from '@/lib/mail'

export async function sendTestAdminEmail() {
  try {
    // Dati finti per il test
    const bookingId = 'TEST-BOOKING-123'
    const boatName = 'Elyvian Dream (TEST)'
    const customerEmail = 'cliente.test@example.com'
    const amount = 1500.00

    await sendEmail({
      to: 'info@mgvacanze.com', // Indirizzo admin
      subject: `💰 [TEST] Nuovo Pagamento Ricevuto: Prenotazione #${bookingId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
            <h1 style="color: #011640;">Pagamento Confermato (Simulazione)</h1>
            <p>È stato ricevuto un nuovo pagamento tramite Stripe.</p>
            <ul style="background: #f9f9f9; padding: 15px; list-style: none;">
                <li><strong>Booking ID:</strong> ${bookingId}</li>
                <li><strong>Barca:</strong> ${boatName}</li>
                <li><strong>Cliente:</strong> ${customerEmail}</li>
                <li><strong>Importo:</strong> €${amount.toFixed(2)}</li>
            </ul>
            <p>Questa è una mail di test generata dal pannello admin.</p>
        </div>
      `
    })
    return { success: true, message: 'Email inviata! Controlla Ethereal.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, message: 'Errore invio: ' + error.message }
  }
}
