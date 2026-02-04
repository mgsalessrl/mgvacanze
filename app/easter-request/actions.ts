'use server'

import { sendEmail } from '@/lib/mail'

export async function sendEasterRequest(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const postalCode = formData.get('postalCode') as string
  const guests = formData.get('guests') as string
  const preferredSea = formData.get('preferredSea') as string
  const dates = formData.get('dates') as string
  const message = formData.get('message') as string

  // boat is removed as per prompt
  
  if (!name || !email || !phone) {
    return { error: 'Please complete all required fields.' }
  }

  const html = `
    <div style="font-family: sans-serif;">
      <h2>New Lead Request (Easter Page)</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Postal Code:</strong> ${postalCode || 'Not specified'}</p>
      <p><strong>Number of Guests:</strong> ${guests || 'Not specified'}</p>
      <p><strong>Preferred Sea:</strong> ${preferredSea || 'Not specified'}</p>
      <p><strong>Preferred Dates:</strong> ${dates || 'Not specified'}</p>
      
      <h3>Message:</h3>
      <p style="white-space: pre-wrap; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">${message}</p>
    </div>
  `

  try {
    // Send to info@mgvacanze.com as requested
    await sendEmail({
      to: 'info@mgvacanze.com',
      subject: `New Request from EASTER LANDING: ${name}`,
      html
    })
    return { success: true, message: 'Request sent successfully! We will contact you shortly.' }
  } catch (error) {
    console.error('Mail error:', error)
    return { error: 'Error sending request. Please try again later or contact us directly.' }
  }
}
