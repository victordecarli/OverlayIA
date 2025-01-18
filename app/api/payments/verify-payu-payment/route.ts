import { NextResponse } from 'next/server';
import { validatePayUResponse } from '@/lib/payu';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In development, skip hash validation if status is success
    const isValidHash = validatePayUResponse(body);

    if (!isValidHash) {
      console.error('Hash validation failed');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Step 2: Verify Payment Status
    if (body.status !== 'success' || body.unmappedstatus !== 'captured') {
      console.error('Payment not successful:', { status: body.status, unmapped: body.unmappedstatus });
      return NextResponse.json(
        { error: body.error_Message || 'Payment was not successful' },
        { status: 400 }
      );
    }

    // Step 3: Process verified payment
    const { txnid, amount, email, productinfo } = body;

    // Get user from email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, tokens_balance')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    // Extract token amount from productinfo (format: "X Tokens")
    const tokenAmount = parseInt(productinfo.split(' ')[0]);

    // Step 4: Insert into user_tokens table
    const { error: insertError } = await supabaseAdmin
      .from('user_tokens')
      .insert({
        user_id: userData.id,
        tokens_purchased: tokenAmount,
        amount_paid: parseFloat(amount),
        purchase_date: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    // Step 5: Update token balance
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        tokens_balance: (userData.tokens_balance || 0) + tokenAmount
      })
      .eq('id', userData.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      status: 'success',
      transactionId: txnid,
      tokenAmount
    });

  } catch (error) {
    console.error('PayU Verification Error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}