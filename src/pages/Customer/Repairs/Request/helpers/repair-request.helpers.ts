import { translations } from '../../../../../utils/translations';
import type { RepairRequestDraft, RepairRequestErrors } from '../types/repair-request.types';

const t = translations.repairs;

export function validateRepairRequest(draft: RepairRequestDraft): RepairRequestErrors {
  const errors: RepairRequestErrors = {};

  // Device type validation
  if (!draft.deviceType.trim()) {
    errors.deviceType = t.deviceTypeRequired;
  } else if (draft.deviceType.length > 100) {
    errors.deviceType = t.fieldTooLong;
  }

  // Brand validation
  if (!draft.brand.trim()) {
    errors.brand = t.brandRequired;
  } else if (draft.brand.length > 100) {
    errors.brand = t.fieldTooLong;
  }

  // Model validation
  if (!draft.model.trim()) {
    errors.model = t.modelRequired;
  } else if (draft.model.length > 100) {
    errors.model = t.fieldTooLong;
  }

  // Serial number validation (optional)
  if (draft.serialNumber && draft.serialNumber.length > 100) {
    errors.serialNumber = t.fieldTooLong;
  }

  // Purchase date validation (optional)
  if (draft.purchaseDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(draft.purchaseDate)) {
      errors.purchaseDate = t.invalidDate;
    } else {
      const date = new Date(draft.purchaseDate);
      if (isNaN(date.getTime())) {
        errors.purchaseDate = t.invalidDate;
      }
    }
  }

  // Problem description validation
  if (!draft.problemDescription.trim()) {
    errors.problemDescription = t.problemDescriptionRequired;
  } else if (draft.problemDescription.trim().length < 10) {
    errors.problemDescription = 'Problem description must be at least 10 characters.';
  } else if (draft.problemDescription.length > 2000) {
    errors.problemDescription = 'Problem description is too long (max 2000 characters).';
  }

  return errors;
}

export function hasErrors(errors: RepairRequestErrors): boolean {
  return Object.keys(errors).length > 0;
}
