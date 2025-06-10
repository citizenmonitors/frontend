"use client";
import useFormHandler from "@/app/hooks/useFormHandler";
import React, { useEffect } from "react";
import AppSelect from "../../shared/Select";
import { Button, Checkbox, Input, InputNumber } from "antd";
import formatNumber from "@/app/utils/formatNumber";
import { useRouter } from "next/navigation";
import { CurrencyCode } from "@/app/redux/types";
import { currencyCodes, currencyInfo } from "./donateData";

type DonateFormProps = {
  formHandler: {
    formData: {
      currency: CurrencyCode;
      amount: string;
      isAccepted: boolean;
    };
    setFormData: React.Dispatch<
      React.SetStateAction<{
        currency: CurrencyCode;
        amount: string;
        isAccepted: boolean;
      }>
    >;
    handleFormInputChange: (
      name: "currency" | "isAccepted" | "amount",
      mode?: "static"
    ) => (event: any) => void;
  };
};
export default function DonateForm({ formHandler }: DonateFormProps) {
  const router = useRouter();
  const { formData, setFormData, handleFormInputChange } = formHandler;

  useEffect(() => {
    setFormData({ ...formData, amount: "" });
  }, [formData.currency]);

  useEffect(() => {
    if (formData.isAccepted) setFormData({ ...formData, isAccepted: false });
  }, [formData.amount]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.replace("/donate?stage=checkout");
  }

  const isValidDonation =
    Number(formData.amount) >= currencyInfo[formData.currency].minAmount;

  return (
    <form action="" className="gap-6 md:gap-12 grid md:py-12" onSubmit={handleSubmit}>
      <div>
        <AppSelect
          value={formData.currency}
          noPlaceholder
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value as CurrencyCode })
          }
          options={currencyCodes.map((c) => ({
            label: `${c.toUpperCase()} (${currencyInfo[c].symbol})`,
            value: c,
          }))}
        />
      </div>

      <div>
        <InputNumber
          size="large"
          placeholder="Input Amount"
          className="w-full h-[48px] md:h-[70px] md:px-6 !text-display-xs"
          value={formData.amount}
          onChange={handleFormInputChange("amount", "static")}
          prefix={
            <span className="text-gray-500 text-base mr-1">
              {currencyInfo[formData.currency].symbol}
            </span>
          }
          formatter={(value) => formatNumber.commas(Number(value))}
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-5 md:gap-8">
        {currencyInfo[formData.currency].suggestions.map((value) => {
          const defaultClass =
            "text-gray-500 ring-gray-300 hover:!bg-brand-25 hover:!ring-brand-500 hover:!text-brand-500";
          const activeClass = "!bg-brand-25 !ring-brand-500 !text-brand-500";

          return (
            <Button
              key={value}
              size="large"
              type="text"
              className={`!text-sm md:!text-lg h-[48px] md:h-[70px] ring-1 ${
                Number(formData.amount) === value ? activeClass : defaultClass
              }`}
              onClick={() => setFormData({ ...formData, amount: `${value}` })}
            >
              {currencyInfo[formData.currency].symbol}
              {formatNumber.commas(value)}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6">
        <div className="flex gap-2 md:items-center">
          <div>
            <Checkbox
              checked={formData.isAccepted}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isAccepted: e.target.checked }))
              }
              disabled={!isValidDonation}
            />
          </div>
          <p className="text-xs md:text-sm text-gray-700">
            Yes, I’ll generously make a donation{" "}
            {isValidDonation &&
              `of ${currencyInfo[formData.currency].symbol}${formatNumber.commas(
                Number(formData.amount)
              )}`}{" "}
            to support the work done at Citizen Monitors.
          </p>
        </div>

        <div>
          <p className="text-xs md:text-sm text-error-500 ml-6">
            Your donation to <b>Citizen Monitors</b> is processed anonymously and
            securely, without any involvement of domestic or African banking institutions,
            ensuring your privacy and trust.
          </p>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className="text-sm md:!text-lg h-[48px] md:h-[70px]"
        disabled={!formData.isAccepted || !isValidDonation}
        htmlType="submit"
      >
        Donate{" "}
        {isValidDonation &&
          `${currencyInfo[formData.currency].symbol}${formatNumber.commas(
            Number(formData.amount)
          )}`}
      </Button>
    </form>
  );
}
