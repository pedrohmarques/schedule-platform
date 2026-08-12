"use client";

import { useState } from "react";

export type Validator = (value: string) => string | null;

interface UseValidationResult {
  error: string | null;
  isInvalid: boolean;
  handleBlur: () => void;
}

/**
 * Generic field-validation hook. Shows an error once the field has been
 * touched (blurred once) — so errors don't show up while the user is still
 * typing it for the first time — OR when `forceShow` is true, which lets a
 * parent form reveal every field's error at once (e.g. on a failed submit
 * attempt), even for fields the user never focused.
 */
export function useValidation(value: string, validate?: Validator, forceShow = false): UseValidationResult {
  const [touched, setTouched] = useState(false);
  const shouldValidate = touched || forceShow;

  const error = shouldValidate && validate ? validate(value) : null;

  function handleBlur() {
    setTouched(true);
  }

  return { error, isInvalid: Boolean(error), handleBlur };
}
