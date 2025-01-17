import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getPayPalClient } from '@/lib/paypal-client';
import { getFreshUserProfile } from '@/lib/supabase-utils';

const TOKEN_PRICES = {
  10: 2,
  25: 4,
  50: 7,
};

type TokenAmount = keyof typeof TOKEN_PRICES;

export async function POST(req: Request) {
  try {
    const { tokenAmount, userID } = await req.json();
    
    // Validate user exists before creating order
    const userProfile = await getFreshUserProfile(userID);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!tokenAmount || !TOKEN_PRICES[tokenAmount as TokenAmount]) {
      return NextResponse.json(
        { error: 'Invalid token amount' },
        { status: 400 }
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
      }]
    });
    const order = await client.execute(request);
    
    return NextResponse.json({
      id: order.result.id
    });
  } catch (error) {
    console.error('Detailed PayPal Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Error creating order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
