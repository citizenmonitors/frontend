"use client";
import InputLined from "@/app/components/shared/InputLined";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { email, socials } from "@/app/data/links";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import useFormHandler from "@/app/hooks/useFormHandler";
import { clearAlert, showAlert } from "@/app/redux/features/alertSlice";
import { clearSupportTicket, submitSupportTicket } from "@/app/redux/features/userSlice";
import { Button, Input, Radio } from "antd";
import { MessageCircle, SmsEdit } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";

export default function SupportResources() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  type SupportCategory =
    | "registration"
    | "role-assignment"
    | "coverage-details"
    | "profile-update"
    | "other";

  const initialSupportFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    category: "registration" as SupportCategory,
    message: "",
  };
  const { formData, handleFormInputChange, setFormData } = useFormHandler(initialSupportFormData);

  function clearForm() {
    handleFormInputChange("firstName")({ target: { value: "" } });
    handleFormInputChange("lastName")({ target: { value: "" } });
    handleFormInputChange("email")({ target: { value: "" } });
    handleFormInputChange("phoneNumber")({ target: { value: "" } });
    handleFormInputChange("category")({ target: { value: "registration" } });
    handleFormInputChange("message")({ target: { value: "" } });
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    if (!formData.firstName.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "First Name cannot be empty.",
        })
      );
      return;
    }

    if (!formData.lastName.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Last Name cannot be empty.",
        })
      );
      return;
    }

    if (!formData.email.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Email cannot be empty.",
        })
      );
      return;
    }

    if (!isEmail(formData.email)) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please enter a valid email address.",
        })
      );
      return;
    }

    if (!formData.phoneNumber.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Phone Number cannot be empty.",
        })
      );
      return;
    }

    if (!isMobilePhone(formData.phoneNumber)) {
      dispatch(
        showAlert({
          type: "error",
          message: "Please enter a valid phone number.",
        })
      );
      return;
    }

    if (!formData.message.trim()) {
      dispatch(
        showAlert({
          type: "error",
          message: "Message cannot be empty.",
        })
      );
      return;
    }

    // Submit the support ticket
    dispatch(submitSupportTicket({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      category: formData.category,
      message: formData.message,
    }));
  }

  useEffect(() => {
    const status = userState.status.submitSupportTicket;

    if (status === "rejected") {
      dispatch(
        showAlert({
          message: userState.error.message || "Failed to submit support ticket. Please try again.",
          type: "error",
        })
      );
      dispatch(clearSupportTicket());
      return;
    }

    if (status === "fulfilled") {
      dispatch(
        showAlert({
          message: "Your support ticket has been submitted successfully. We'll get back to you soon.",
          type: "success",
        })
      );
      clearForm();
      dispatch(clearSupportTicket());
      return;
    }
  }, [userState.status.submitSupportTicket]);

  useEffect(() => {
    return () => {
      // Clear any existing alerts
      dispatch(clearAlert());
    };
  }, []);

  return (
    <section className="rounded-xl ring-1 ring-brand-500 overflow-hidden grid grid-cols-12">
      <article className="text-white bg-brand-500 py-12 px-6 col-span-12 lg:col-span-4 flex flex-col">
        <div className="flex flex-col gap-8 mb-8 items-center lg:items-start">
          <div className="xl:hidden">
            <LogoFlat mode="white" size={36} />
          </div>
          <div className="hidden xl:block">
            <LogoFlat mode="white" size={54} />
          </div>
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <h2 className="font-league font-bold leading-[1.1] text-display-xs lg:text-display-sm text-center lg:text-start">
              We Are Here To Help.
            </h2>
            <p className="text-sm lg:text-base text-center lg:text-start">
              At Citizen Monitors, we ensure everyone has a voice. If you have any
              questions, concerns, or need assistance, please don't hesitate to reach out.
            </p>
          </div>
          <Link
            href={`mailto:${email}`}
            className="flex gap-2 items-center font-semibold font-league leading-[1]"
          >
            <SmsEdit variant="Bulk" size={20} />
            <span>{email}</span>
          </Link>
        </div>

        <ul className="flex gap-4 mt-auto justify-center lg:justify-start">
          {socials.map((social) => (
            <Link
              href={social.href}
              key={social.name}
              className="h-7 w-7 rounded-full bg-white hover:bg-brand-100 text-brand-500 grid place-content-center"
            >
              <Image src={social.brandIcon} alt={social.name} height={10} width={10} />
            </Link>
          ))}
        </ul>
      </article>

      <form
        className="relative col-span-12 lg:col-span-8 grid grid-cols-2 gap-10 py-12 px-6 xl:pl-12 xl:pr-16 place-content-start"
        onSubmit={handleSubmit}
      >
        <div className="col-span-2 lg:col-span-1">
          <InputLined
            label="First Name"
            id="support-firstname"
            value={formData.firstName}
            onChange={handleFormInputChange("firstName")}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <InputLined
            label="Last Name"
            id="support-lastname"
            value={formData.lastName}
            onChange={handleFormInputChange("lastName")}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <InputLined
            label="Email"
            id="support-email"
            value={formData.email}
            onChange={handleFormInputChange("email")}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <InputLined
            label="Phone Number"
            id="support-phoneNumber"
            value={formData.phoneNumber}
            onChange={handleFormInputChange("phoneNumber")}
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="support-category"
            className="text-sm font-medium text-gray-500 peer-focus-within:text-brand-500"
          >
            Contact Category
          </label>
          <Radio.Group
            id="support-category"
            value={formData.category}
            onChange={handleFormInputChange("category")}
            className="flex flex-col lg:flex-row gap-6 lg:gap-4 flex-wrap mt-2"
          >
            <Radio value="registration">Registration</Radio>
            <Radio value="role-assignment">Role Assignment</Radio>
            <Radio value="coverage-details">Coverage Details</Radio>
            <Radio value="profile-update">Profile Update</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        </div>

        <div className="col-span-2">
          <InputLined
            textarea
            label="Message"
            id="support-message"
            value={formData.message}
            onChange={handleFormInputChange("message")}
          />
        </div>

        <Button
          className="!h-[60px] mb-12 !px-7 w-fit col-span-2 lg:col-span-1 lg:col-start-2 mx-auto lg:mx-0 lg:ml-auto flex gap-2 items-center"
          size="large"
          type="primary"
          htmlType="submit"
          loading={userState.status.submitSupportTicket === 'pending'}
        >
          <span>Send Message</span>
          <MessageCircle variant="Bulk" size={32} />
        </Button>

        <Image
          className="lg:-translate-x-[64px] sm:translate-x-[64px] md:translate-x-[128px] left-0 lg:left-auto lg:right-0 absolute bottom-0"
          alt="send illustration"
          width={229}
          height={106}
          src={"/assets/resources/support-send.png"}
        />
      </form>
    </section>
  );
}
