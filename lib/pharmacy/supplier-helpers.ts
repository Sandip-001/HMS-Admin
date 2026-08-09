// lib/pharmacy/supplier-helpers.ts

import type { SupplierFormData, SupplierFormErrors } from "@/types/pharmacy/supplier-types";

export function validateSupplierForm(data: SupplierFormData): SupplierFormErrors {
  const errors: SupplierFormErrors = {};

  if (!data.supplierName.trim()) {
    errors.supplierName = "Supplier name is required";
  } else if (data.supplierName.length < 3) {
    errors.supplierName = "Supplier name must be at least 3 characters";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  } else if (data.address.length < 10) {
    errors.address = "Please enter a complete address";
  }

  if (!data.supplierType) {
    errors.supplierType = "Supplier type is required";
  }

  if (!data.drugLicenseNumber.trim()) {
    errors.drugLicenseNumber = "Drug license number is required";
  }

  if (!data.gst.trim()) {
    errors.gst = "GST number is required";
  } else if (data.gst.length !== 15) {
    errors.gst = "GST must be 15 characters";
  }

  if (!data.pan.trim()) {
    errors.pan = "PAN is required";
  } else if (data.pan.length !== 10) {
    errors.pan = "PAN must be 10 characters";
  }

  if (!data.bankDetails.trim()) {
    errors.bankDetails = "Bank details are required";
  }

  if (!data.ifsc.trim()) {
    errors.ifsc = "IFSC code is required";
  } else if (data.ifsc.length !== 11) {
    errors.ifsc = "IFSC must be 11 characters";
  }

  if (!data.creditLimit.trim()) {
    errors.creditLimit = "Credit limit is required";
  } else {
    const limit = Number(data.creditLimit);
    if (isNaN(limit) || limit < 0) {
      errors.creditLimit = "Credit limit must be a positive number";
    }
  }

  if (!data.creditDays.trim()) {
    errors.creditDays = "Credit days is required";
  } else {
    const days = Number(data.creditDays);
    if (isNaN(days) || days < 0 || days > 365) {
      errors.creditDays = "Credit days must be between 0 and 365";
    }
  }

  if (!data.paymentTerms) {
    errors.paymentTerms = "Payment terms are required";
  }

  if (!data.performanceRating.trim()) {
    errors.performanceRating = "Performance rating is required";
  } else {
    const rating = Number(data.performanceRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      errors.performanceRating = "Rating must be between 0 and 5";
    }
  }

  if (!data.lastPurchaseDate) {
    errors.lastPurchaseDate = "Last purchase date is required";
  }

  if (!data.activeStatus) {
    errors.activeStatus = "Active status is required";
  }

  return errors;
}

export function hasErrors(errors: SupplierFormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}