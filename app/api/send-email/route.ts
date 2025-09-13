import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { to_email, from_name, from_email, message, subject } = await request.json();

    // Validate required fields
    if (!to_email || !from_name || !from_email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Using Resend API to send emails
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const emailData = {
      from: 'Deshmukh Properties <noreply@deshmukhproperties.com>',
      to: [to_email],
      subject: subject || 'Contact Form Submission - Deshmukh Properties',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Deshmukh Properties</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Submission</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
              <p style="margin: 10px 0;"><strong style="color: #555;">Name:</strong> ${from_name}</p>
              <p style="margin: 10px 0;"><strong style="color: #555;">Email:</strong> ${from_email}</p>
              <p style="margin: 10px 0;"><strong style="color: #555;">Subject:</strong> ${subject || 'Contact Form Submission'}</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Message</h2>
              <p style="line-height: 1.6; color: #555; white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This email was sent from the Deshmukh Properties contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Deshmukh Properties - New Contact Form Submission
        
        Contact Details:
        Name: ${from_name}
        Email: ${from_email}
        Subject: ${subject || 'Contact Form Submission'}
        
        Message:
        ${message}
        
        ---
        This email was sent from the Deshmukh Properties contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
      `,
    };

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email via Resend');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        emailId: result.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
