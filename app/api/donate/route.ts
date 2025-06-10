import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_DONATE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { amount, currency } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("errrr: ", error)
    // handle other errors (e.g. network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    )
  }
}