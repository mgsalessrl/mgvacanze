import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }[];
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials are missing from environment variables.');
    throw new Error('SMTP configuration missing. Please check .env file.');
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"MG Vacanze" <noreply@mgvacanze.com>',
      to,
      subject,
      html,
      attachments,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


const BANK_DETAILS = {
  beneficiary: "MGSALES SRL",
  iban: "IT26T0306971617100000004303",
  bankName: "Banca Monte dei Paschi di Siena" // Optional, adds credibility
};

export async function sendDepositRequestEmail({ 
  to, 
  booking, 
  amount 
}: { 
  to: string, 
  booking: any, 
  amount: number 
}) {
  const subject = `Conferma Prenotazione #${booking.id} - Richiesta Acconto`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Richiesta Acconto Prenotazione</h2>
      <p>Gentile ${booking.customer_name},</p>
      <p>Siamo felici di confermare la tua richiesta di prenotazione per <strong>${booking.boat_name || 'la barca'}</strong>.</p>
      
      <p>Per bloccare la prenotazione, ti chiediamo gentilmente di versare un acconto di <strong>€ ${amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong> tramite bonifico bancario.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Coordinate Bancarie:</h3>
        <p><strong>Beneficiario:</strong> ${BANK_DETAILS.beneficiary}</p>
        <p><strong>IBAN:</strong> ${BANK_DETAILS.iban}</p>
        <p><strong>Causale:</strong> Prenotazione #${booking.id}</p>
        <p><strong>Importo:</strong> € ${amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
      </div>

      <p>La prenotazione resterà in attesa fino alla ricezione della copia del bonifico o dell'accredito.</p>
      <p>Inviaci pure la contabile a questa email per velocizzare la procedura.</p>
      
      <p>Cordiali saluti,<br>Il team di MG Vacanze</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}


export async function sendBalanceRequestEmail({ 
  to, 
  booking, 
  amount 
}: { 
  to: string, 
  booking: any, 
  amount: number 
}) {
  const subject = `Saldo Prenotazione #${booking.id} - MG Vacanze`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Richiesta Saldo Prenotazione</h2>
      <p>Gentile ${booking.customer_name},</p>
      <p>Ti ricordiamo che è necessario effettuare il saldo per la tua prenotazione #${booking.id}.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Dettagli per il Bonifico:</h3>
        <p><strong>Beneficiario:</strong> ${BANK_DETAILS.beneficiary}</p>
        <p><strong>IBAN:</strong> ${BANK_DETAILS.iban}</p>
        <p><strong>Causale:</strong> Saldo Prenotazione #${booking.id}</p>
        <p><strong>Importo da Saldare:</strong> € ${amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
      </div>

      <p>Restiamo a disposizione per qualsiasi chiarimento.</p>
      
      <p>Cordiali saluti,<br>Il team di MG Vacanze</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendNewBookingNotification({ 
  booking 
}: { 
  booking: any 
}) {
  const adminEmail = 'info@mgvacanze.com'; 
  const subject = `Nuova Richiesta WEB #${booking.id} - ${booking.customer_name}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0d47a1;">Nuova Richiesta Ricevuta!</h2>
      <p>Hai ricevuto una nuova richiesta di prenotazione dal sito.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #1f2937;">Dettagli Richiesta:</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0;"><strong>ID:</strong> #${booking.id}</li>
            <li style="padding: 5px 0;"><strong>Cliente:</strong> ${booking.customer_name}</li>
            <li style="padding: 5px 0;"><strong>Email:</strong> <a href="mailto:${booking.customer_email}">${booking.customer_email}</a></li>
            <li style="padding: 5px 0;"><strong>Telefono:</strong> ${booking.customer_phone || 'N/A'}</li>
            <li style="padding: 5px 0;"><strong>Periodo:</strong> ${booking.start_date} - ${booking.end_date}</li>
            <li style="padding: 5px 0;"><strong>Ospiti:</strong> ${booking.guests}</li>
            <li style="padding: 5px 0;"><strong>Totale Stimato:</strong> € ${booking.total_price.toLocaleString('it-IT')}</li>
        </ul>
        ${booking.message ? `<p style="margin-top: 15px;"><strong>Messaggio Cliente:</strong><br/><i>${booking.message}</i></p>` : ''}
      </div>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}


export async function sendCancellationNotification({ 
  booking 
}: { 
  booking: any 
}) {
  const adminEmail = 'info@mgvacanze.com';
  const subject = `Prenotazione #${booking.id} ANNULLATA dall'Utente`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Prenotazione Annullata</h2>
      <p>L'utente ha annullato la seguente prenotazione:</p>
      
      <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fca5a5;">
        <h3 style="margin-top: 0; color: #991b1b;">Dettagli Booking:</h3>
        <ul style="list-style: none; padding: 0; margin: 0; color: #7f1d1d;">
            <li style="padding: 5px 0;"><strong>ID:</strong> #${booking.id}</li>
            <li style="padding: 5px 0;"><strong>Cliente:</strong> ${booking.customer_name}</li>
            <li style="padding: 5px 0;"><strong>Periodo:</strong> ${booking.start_date} - ${booking.end_date}</li>
            <li style="padding: 5px 0;"><strong>Importo Perso:</strong> € ${booking.total_price.toLocaleString('it-IT')}</li>
        </ul>
      </div>

      <p>Lo stato della prenotazione è stato aggiornato automaticamente a "cancelled".</p>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}

// Deprecated Stripe Function - Kept as stub/commented
export async function sendPaymentRequestEmail({ to, booking, amount, type, paymentLink }: any) {
    // Legacy function, replaced by explicit bank transfer emails
    console.warn('sendPaymentRequestEmail is deprecated. Use sendDepositRequestEmail or sendBalanceRequestEmail instead.');
}

export async function sendCustomQuoteEmail({ 
  to, 
  booking, 
  newPrice,
  notes
}: { 
  to: string, 
  booking: any, 
  newPrice: number,
  notes: string
}) {
  const subject = `Proposta Personalizzata per Prenotazione #${booking.id}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Nuova Proposta di Preventivo</h2>
      <p>Gentile ${booking.customer_name},</p>
      <p>A seguito della tua richiesta per <strong>${booking.boat_name || 'la barca'}</strong>, abbiamo elaborato una proposta personalizzata.</p>
      
      <p>Il nuovo prezzo totale è <strong>€ ${newPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong>.</p>
      
      ${notes ? `<p><strong>Note dall'amministratore:</strong><br>${notes}</p>` : ''}

      <p>Se accetti questa proposta, puoi procedere con il pagamento alle seguenti coordinate:</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Coordinate Bancarie:</h3>
        <p><strong>Beneficiario:</strong> ${BANK_DETAILS.beneficiary}</p>
        <p><strong>IBAN:</strong> ${BANK_DETAILS.iban}</p>
        <p><strong>Causale:</strong> Prenotazione #${booking.id}</p>
      </div>
      
      <p>Rispondi a questa email per confermare o chiedere ulteriori informazioni.</p>
      
      <p>Cordiali saluti,<br>Il team di MG Vacanze</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendDepositConfirmationEmail({ 
  to, 
  booking 
}: { 
  to: string, 
  booking: any
}) {
  const subject = `Conferma Ricezione Acconto - Prenotazione #${booking.id}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Acconto Ricevuto con Successo</h2>
      <p>Gentile ${booking.customer_name},</p>
      <p>Ti confermiamo di aver ricevuto il pagamento dell'acconto per la tua prenotazione per <strong>${booking.boat_name || 'la barca'}</strong>.</p>
      
      <p>La tua prenotazione è ora confermata.</p>
      <p>Ti invieremo una richiesta per il saldo prima della data di partenza.</p>
      
      <p>Cordiali saluti,<br>Il team di MG Vacanze</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendBookingCompletedEmail({ 
  to, 
  booking 
}: { 
  to: string, 
  booking: any
}) {
  const subject = `Prenotazione Completata #${booking.id} - MG Vacanze`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Pagamento Saldo Confermato</h2>
      <p>Gentile ${booking.customer_name},</p>
      <p>Ti confermiamo di aver ricevuto il saldo per la tua prenotazione #${booking.id}.</p>
      
      <p><strong>La tua prenotazione è completa!</strong></p>
      <p>Non vediamo l'ora di averti a bordo di <strong>${booking.boat_name || 'la barca'}</strong>.</p>
      
      <p>A breve riceverai ulteriori dettagli per il check-in.</p>
      
      <p>Cordiali saluti,<br>Il team di MG Vacanze</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}


