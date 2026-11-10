"use client";
import LogoFlat from "@/app/components/shared/svg/LogoFlat";
import { Alert, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NewsletterLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFinish(values: { username: string; password: string }) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Could not log in.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-gray-50 px-4">
      <section className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <LogoFlat size={34} />
          <h1 className="font-league text-display-xs font-semibold text-gray-800">Newsletter</h1>
          <p className="text-sm text-gray-500">Newsletter and News &amp; Insight publishing</p>
        </div>

        {!configured && (
          <Alert
            className="mb-4"
            type="warning"
            showIcon
            message="Newsletter page login isn't set up on this server yet."
          />
        )}
        {error && <Alert className="mb-4" type="error" showIcon message={error} />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} disabled={!configured}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Enter your username" }]}
          >
            <Input size="large" autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Log in
          </Button>
        </Form>
      </section>
    </main>
  );
}
