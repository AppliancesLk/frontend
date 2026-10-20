import { useId } from 'react';
import type {
  SpecificationDraft,
  SpecificationEntryDraft,
} from '../types/product-edit.types';
import { defaultSpecificationValue } from '../helpers/product-edit.helpers';
import { translations } from '../../../../../utils/translations';
const t = translations.productEdit;
const kinds: { value: SpecificationDraft['kind']; label: string }[] = [
  { value: 'text', label: t.text },
  { value: 'number', label: t.number },
  { value: 'boolean', label: t.boolean },
  { value: 'group', label: t.group },
  { value: 'list', label: t.list },
  { value: 'empty', label: t.empty },
];
function SpecificationValue({
  draft,
  onChange,
}: {
  draft: SpecificationDraft;
  onChange: (value: SpecificationDraft) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <div>
          <label className="auth-label" htmlFor={`${id}-type`}>
            {t.type}
          </label>
          <select
            id={`${id}-type`}
            className="ui-field auth-input"
            value={draft.kind}
            onChange={(event) => {
              const selected = kinds.find(
                (kind) => kind.value === event.target.value,
              );
              if (selected) onChange(defaultSpecificationValue(selected.value));
            }}
          >
            {draft.kind === 'preserved' && (
              <option value="preserved">{t.keepExisting}</option>
            )}
            {kinds.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </div>
        {(draft.kind === 'text' || draft.kind === 'number') && (
          <div>
            <label className="auth-label" htmlFor={`${id}-value`}>
              {t.value}
            </label>
            <input
              id={`${id}-value`}
              type={draft.kind === 'number' ? 'number' : 'text'}
              step={draft.kind === 'number' ? 'any' : undefined}
              required={draft.kind === 'number'}
              className="ui-field auth-input"
              value={draft.text}
              onChange={(event) =>
                onChange({ ...draft, text: event.target.value })
              }
            />
          </div>
        )}
        {draft.kind === 'boolean' && (
          <div>
            <label className="auth-label" htmlFor={`${id}-value`}>
              {t.value}
            </label>
            <select
              id={`${id}-value`}
              className="ui-field auth-input"
              value={String(draft.value)}
              onChange={(event) =>
                onChange({
                  kind: 'boolean',
                  value: event.target.value === 'true',
                })
              }
            >
              <option value="true">{translations.productDetails.yes}</option>
              <option value="false">{translations.productDetails.no}</option>
            </select>
          </div>
        )}
        {draft.kind === 'empty' && (
          <p className="self-end py-3 text-sm text-fg-muted">{t.empty}</p>
        )}
        {draft.kind === 'preserved' && (
          <p className="self-end py-3 text-sm text-fg-muted">
            {t.specificationDepth}
          </p>
        )}
      </div>
      {draft.kind === 'group' && (
        <SpecificationEntries
          entries={draft.entries}
          onChange={(entries) => onChange({ kind: 'group', entries })}
        />
      )}
      {draft.kind === 'list' && (
        <div className="space-y-3 border-l-2 border-line pl-3 sm:pl-5">
          {draft.items.map((item, index) => (
            <div
              key={index}
              className="rounded-sm border border-line bg-surface p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-fg-muted">
                  {t.listItem} {index + 1}
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-danger hover:text-danger"
                  aria-label={`${t.remove}: ${t.listItem} ${index + 1}`}
                  onClick={() =>
                    onChange({
                      ...draft,
                      items: draft.items.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                >
                  {t.remove}
                </button>
              </div>
              <SpecificationValue
                draft={item}
                onChange={(value) =>
                  onChange({
                    ...draft,
                    items: draft.items.map((current, itemIndex) =>
                      itemIndex === index ? value : current,
                    ),
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="auth-secondary h-auto min-min-h-11 max-w-full whitespace-normal py-2 text-center"
            onClick={() =>
              onChange({
                ...draft,
                items: [...draft.items, { kind: 'text', text: '' }],
              })
            }
          >
            {t.addItem}
          </button>
        </div>
      )}
    </div>
  );
}
export function SpecificationEntries({
  entries,
  onChange,
}: {
  entries: SpecificationEntryDraft[];
  onChange: (entries: SpecificationEntryDraft[]) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="rounded-sm border border-line bg-page p-3 sm:p-4"
        >
          <div className="mb-4 flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <label className="auth-label" htmlFor={`${id}-${index}-name`}>
                {t.property}
              </label>
              <input
                id={`${id}-${index}-name`}
                required
                className="ui-field auth-input"
                value={entry.name}
                onChange={(event) =>
                  onChange(
                    entries.map((current, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, name: event.target.value }
                        : current,
                    ),
                  )
                }
              />
            </div>
            <button
              type="button"
              className="mb-2 text-sm font-medium text-danger hover:text-danger"
              aria-label={`${t.remove}: ${entry.name || t.property}`}
              onClick={() =>
                onChange(
                  entries.filter((_, entryIndex) => entryIndex !== index),
                )
              }
            >
              {t.remove}
            </button>
          </div>
          <SpecificationValue
            draft={entry.value}
            onChange={(value) =>
              onChange(
                entries.map((current, entryIndex) =>
                  entryIndex === index ? { ...entry, value } : current,
                ),
              )
            }
          />
        </div>
      ))}
      <button
        type="button"
        className="auth-secondary h-auto min-min-h-11 max-w-full whitespace-normal py-2 text-center"
        onClick={() =>
          onChange([
            ...entries,
            { name: '', value: { kind: 'text', text: '' } },
          ])
        }
      >
        {t.addSpecification}
      </button>
    </div>
  );
}
