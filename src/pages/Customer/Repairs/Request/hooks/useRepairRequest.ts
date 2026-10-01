import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import * as repairService from '../../../../../services/repairService';
import type { RepairTicket } from '../../../../../types/repair.types';
import type { RepairRequestDraft, RepairRequestErrors } from '../types/repair-request.types';
import { validateRepairRequest, hasErrors } from '../helpers/repair-request.helpers';
import { getApiError } from '../../../../../utils/apiErrors';
import { translations } from '../../../../../utils/translations';

const t = translations.repairs;

export function useRepairRequest() {
  const [draft, setDraft] = useState<RepairRequestDraft>({
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    problemDescription: '',
  });

  const [errors, setErrors] = useState<RepairRequestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState<RepairTicket | null>(null);
  const alive = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const change = useCallback((field: keyof RepairRequestDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (submitting) return;

      const validationErrors = validateRepairRequest(draft);

      if (hasErrors(validationErrors)) {
        setErrors(validationErrors);
        setError(t.validationError);
        return;
      }

      setSubmitting(true);
      setError('');
      setErrors({});

      try {
        const ticket = await repairService.createRepairTicket({
          device: {
            deviceType: draft.deviceType.trim(),
            brand: draft.brand.trim(),
            model: draft.model.trim(),
            serialNumber: draft.serialNumber.trim() || undefined,
            purchaseDate: draft.purchaseDate.trim() || undefined,
          },
          problemDescription: draft.problemDescription.trim(),
        });

        if (alive.current) {
          setCreatedTicket(ticket);
        }
      } catch (err: unknown) {
        if (alive.current) {
          setError(getApiError(err, t.submitError));
        }
      } finally {
        if (alive.current) {
          setSubmitting(false);
        }
      }
    },
    [draft, submitting],
  );

  return {
    draft,
    errors,
    error,
    submitting,
    createdTicket,
    change,
    submit,
  };
}
