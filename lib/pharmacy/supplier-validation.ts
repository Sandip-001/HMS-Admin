// lib/admin/pharmacy/supplier-validation.ts
import type { SupplierFormData, SupplierFormErrors } from "@/types/pharmacy/supplier-types";

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export function validateSupplierForm(data: SupplierFormData): SupplierFormErrors {
  const errors: SupplierFormErrors = {};

  if (!data.supplierName.trim()) {
    errors.supplierName = "Supplier name is required";
  } else if (data.supplierName.trim().length < 3) {
    errors.supplierName = "Supplier name must be at least 3 characters";
  }

  if (!data.contactPerson.trim()) {
    errors.contactPerson = "Contact person is required";
  }

  if (!data.gstNumber.trim()) {
    errors.gstNumber = "GST number is required";
  } else if (!GST_REGEX.test(data.gstNumber.trim().toUpperCase())) {
    errors.gstNumber = "Enter a valid 15-character GST number";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  } else if (data.address.trim().length < 10) {
    errors.address = "Address must be at least 10 characters";
  }

  if (!data.paymentTerms.trim()) {
    errors.paymentTerms = "Payment terms are required";
  }

  return errors;
}

export function hasValidationErrors(errors: SupplierFormErrors): boolean {
  return Object.keys(errors).length > 0;
}