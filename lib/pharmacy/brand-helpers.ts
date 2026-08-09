// lib/pharmacy/brand-helpers.ts

import type { BrandFormData, BrandFormErrors } from "@/types/pharmacy/category-brand-types";

export function validateBrandForm(data: BrandFormData): BrandFormErrors {
  const errors: BrandFormErrors = {};

  if (!data.brandName.trim()) {
    errors.brandName = "Brand name is required";
  } else if (data.brandName.length < 2) {
    errors.brandName = "Brand name must be at least 2 characters";
  }

  if (!data.manufacturer.trim()) {
    errors.manufacturer = "Manufacturer is required";
  }

  if (!data.country) {
    errors.country = "Country is required";
  }

  if (!data.website.trim()) {
    errors.website = "Website is required";
  } else if (!isValidUrl(data.website)) {
    errors.website = "Please enter a valid URL (e.g., https://example.com)";
  }

  if (!data.licenseNumber.trim()) {
    errors.licenseNumber = "License number is required";
  }

  if (!data.gst.trim()) {
    errors.gst = "GST percentage is required";
  } else {
    const gst = Number(data.gst);
    if (isNaN(gst) || gst < 0 || gst > 100) {
      errors.gst = "GST must be between 0 and 100";
    }
  }

  if (!data.supportContact.trim()) {
    errors.supportContact = "Support contact is required";
  }

  if (!data.status) {
    errors.status = "Status is required";
  }

  return errors;
}

export function hasErrors(errors: BrandFormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}