"use client";

import { FormHTMLAttributes, useRef } from "react";

type Actionable = (form: FormData) => Promise<void>;

export function Form(
  props: Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & {
    action?: Actionable;
  }
) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
    className="flex flex-col gap-2 mb-4"
      ref={ref}
      {...props}
      action={async (form) => {
        if (typeof props.action !== "function") return;

        await props.action(form);
        ref.current?.reset();
      }}
    />
  );
}
