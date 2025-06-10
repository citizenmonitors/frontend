import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import convertToSubcurrency from "@/app/utils/convertToSubcurrency";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, Spin } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { currencyInfo } from "./donateData";
import formatNumber from "@/app/utils/formatNumber";

type DonateCheckoutFormProps = {
  amount: number;
  // dollars or pounds or naira
  currency: "usd" | "gbp" | "ngn";
  clientSecret: string;
};
export default function DonateCheckoutForm({
  amount,
  currency,
  clientSecret,
}: DonateCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

  const [processing, setProcessing] = React.useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      dispatch(
        showAlert({
          message:
            submitError.message ||
            "Something went wrong with the payment submission, Please try again later.",
          type: "error",
        })
      );
      setProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env
          .NEXT_PUBLIC_STRIPE_DONATE_RETURN_URL!}?stage=confirm&donation=${
          amount + "-" + currency
        }`,
      },
    });

    if (error) {
      dispatch(
        showAlert({
          message:
            error.message ||
            "Something went wrong with the payment confirmation, Please try again later.",
          type: "error",
        })
      );
    } else {
      // Customer is redirected to return_url
    }
    
    setProcessing(false);
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        htmlType="submit"
        type="primary"
        size="large"
        block
        loading={processing}
        className="mt-6 text-sm md:!text-lg h-[48px] md:h-[70px]"
      >
        Pay {`${currencyInfo[currency].symbol}${formatNumber.commas(Number(amount))}`}
      </Button>
    </form>
  );
}
