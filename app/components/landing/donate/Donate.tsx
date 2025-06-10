"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DonateCheckoutForm from "./DonateCheckoutForm";
import DonateForm from "./DonateForm";
import { Elements } from "@stripe/react-stripe-js";
import useFormHandler from "@/app/hooks/useFormHandler";
import getStripe from "@/app/utils/getStripejs";
import axios from "axios";
import convertToSubcurrency from "@/app/utils/convertToSubcurrency";
import { Button, Spin } from "antd";
import { currencyCodes, currencyInfo } from "./donateData";
import Link from "next/link";
import { CurrencyCode } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";

const stripePromise = getStripe();

export default function Donate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage");
  const initialFormData = {
    currency: currencyCodes[0],
    amount: "",
    isAccepted: false,
  };

  const formHandler = useFormHandler(initialFormData);
  const [clientSecret, setClientSecret] = React.useState<string>("");
  async function getClientSecret() {
    const { data } = await axios.post("/api/donate", {
      amount: convertToSubcurrency(Number(formHandler.formData.amount)),
      currency: formHandler.formData.currency,
    });
    setClientSecret(data.clientSecret);
  }

  useEffect(() => {
    if (stage === "checkout") {
      if (formHandler.formData.amount) {
        getClientSecret();
      } else {
        router.replace("/donate");
      }
    }
  }, [stage]);

  return {
    checkout: clientSecret ? (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "stripe" } }}
      >
        <DonateCheckoutForm
          clientSecret={clientSecret}
          amount={Number(formHandler.formData.amount)}
          currency={formHandler.formData.currency.toLowerCase() as any}
        />
      </Elements>
    ) : (
      <div className="w-full h-full pt-16 grid place-items-center">
        <Spin size="large" />
      </div>
    ),
    confirm: (
      <div className="w-full h-full pt-16 flex flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
        Thank you for your support 💚
        <br />
        We have recieved your donation{" "}
        {searchParams.get("donation")?.split("-").length === 2
          ? `of ${
              currencyInfo[searchParams.get("donation")!.split("-").at(1) as CurrencyCode]
                .symbol
            }${formatNumber.commas(searchParams.get("donation")!.split("-").at(0)! as any)}`
          : ""}
        .
        <Link href={"/"} className="mt-4">
          <Button className="" type="primary">
            Back to homepage
          </Button>
        </Link>
      </div>
    ),
    default: <DonateForm formHandler={formHandler} />,
  }[stage || "default"];
}
