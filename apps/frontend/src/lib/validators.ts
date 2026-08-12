import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { Validator } from "@/hooks/useValidation";

export const required =
  (message = "Campo obrigatório"): Validator =>
  (value) =>
    value.trim().length === 0 ? message : null;

export const isCpf =
  (message = "CPF inválido"): Validator =>
  (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 11 && cpfValidator.isValid(digits) ? null : message;
  };

/** Validates a masked field (phone, CEP...) has one of the expected digit counts. */
export const digitsLength =
  (lengths: number[], message: string): Validator =>
  (value) => {
    const digits = value.replace(/\D/g, "");
    return lengths.includes(digits.length) ? null : message;
  };

export const isEmail =
  (message = "E-mail inválido"): Validator =>
  (value) =>
    value.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message;

export const minLength =
  (length: number, message = `Mínimo de ${length} caracteres`): Validator =>
  (value) =>
    value.trim().length === 0 || value.length >= length ? null : message;

/** Runs each validator in order and returns the first error found, if any. */
export function combine(...validators: Validator[]): Validator {
  return (value) => {
    for (const validate of validators) {
      const error = validate(value);
      if (error) return error;
    }
    return null;
  };
}
