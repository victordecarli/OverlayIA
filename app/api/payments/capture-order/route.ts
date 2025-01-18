import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getPayPalClient } from '@/lib/paypal-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { orderID, userID, tokenAmount } = await req.json();
    if (!orderID || !userID || !tokenAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await client.execute(request);

    if (capture.result.status === 'COMPLETED') {
      const amountPaid = parseFloat(
        capture.result.purchase_units[0].payments.captures[0].amount.value
      );

      try {
        // Step 1: Insert into user_tokens table
        const { error: insertError } = await supabaseAdmin
          .from('user_tokens')
          .insert({
            user_id: userID,
            tokens_purchased: tokenAmount,
            amount_paid: amountPaid,
            purchase_date: new Date().toISOString()
          });

        if (insertError) throw insertError;

        // Step 2: Get current token balance
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('tokens_balance')
          .eq('id', userID)
          .single();

        if (profileError) throw profileError;

        // Step 3: Update tokens_balance in profiles
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ 
            tokens_balance: (profile?.tokens_balance || 0) + tokenAmount 
          })
          .eq('id', userID);

        if (updateError) throw updateError;

        return NextResponse.json({
          status: 'success',
          orderID: capture.result.id
        });
      } catch (error) {
        console.error('Critical: Payment successful but token allocation failed:', {
          error,
          userID,
          orderID: capture.result.id,
          tokenAmount,
          amountPaid
        });

        return NextResponse.json({
          status: 'success',
          orderID: capture.result.id,
          message: 'Payment processed but token allocation delayed. Please contact support if tokens are not received within 5 minutes.'
        });
      }
    }

    throw new Error('Payment not completed');
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Error capturing payment' },
      { status: 500 }
    );
  }
}
