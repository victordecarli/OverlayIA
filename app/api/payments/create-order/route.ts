import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getPayPalClient } from '@/lib/paypal-client';
import { getFreshUserProfile } from '@/lib/supabase-utils';
import { generateNonce } from '@/lib/nonce';

const TOKEN_PRICES = {
  5: 1,
  10: 2,
  25: 4,
  50: 7,
};

type TokenAmount = keyof typeof TOKEN_PRICES;

// Add this helper function at the top
function getBaseUrl(req: Request) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function POST(req: Request) {
  const nonce = generateNonce();
  const baseUrl = getBaseUrl(req);
  
  const headers = new Headers({
    'Content-Security-Policy': [
      "default-src 'self' https://*.paypal.com",
      "script-src 'self' 'unsafe-inline' https://*.paypal.com https://*.paypalobjects.com",
      "frame-src 'self' https://*.paypal.com https://www.paypal.com",
      "connect-src 'self' https://*.paypal.com https://api.paypal.com",
      "form-action 'self' https://*.paypal.com",
      "style-src 'self' 'unsafe-inline' https://*.paypal.com",
      "img-src 'self' data: https: blob: https://*.paypal.com",
      "frame-ancestors 'none'"
    ].join('; '),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  try {
    const { tokenAmount, userID } = await req.json();
    
    // Validate user exists before creating order
    const userProfile = await getFreshUserProfile(userID);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers }
      );
    }

    if (!tokenAmount || !TOKEN_PRICES[tokenAmount as TokenAmount]) {
      return NextResponse.json(
        { error: 'Invalid token amount' },
        { status: 400, headers }
      );
    }

    const price = TOKEN_PRICES[tokenAmount as TokenAmount];
    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: price.toString(),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: price.toString()
            }
          }
        },
        description: `${tokenAmount} Image Generation Tokens`,
        items: [{
          name: `Image Generation Tokens`,
          description: `Package of ${tokenAmount} tokens`,
          quantity: '1',
          unit_amount: {
            currency_code: 'USD',
            value: price.toString()
          }
        }]
      }],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/pay?success=true`,
        cancel_url: `${baseUrl}/pay?success=false`
      }
    });
    
    const order = await client.execute(request);
    
    return NextResponse.json({
      id: order.result.id,
      nonce: nonce
    }, { headers });
  } catch (error) {
    console.error('Detailed PayPal Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Error creating order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers }
    );
  }
}
