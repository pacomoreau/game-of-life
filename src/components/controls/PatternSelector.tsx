import { PATTERNS } from '../../engine/patterns';

type Props = {
  disabled: boolean;
  onSelect: (index: number) => void;
};

export function PatternSelector({ disabled, onSelect }: Props) {
  return (
    <select
      disabled={disabled}
      defaultValue=""
      onChange={(e) => {
        const idx = Number(e.target.value);
        if (!isNaN(idx)) {
          onSelect(idx);
          e.target.value = '';
        }
      }}
    >
      <option value="" disabled>
        Place a pattern...
      </option>
      {PATTERNS.map((p, i) => (
        <option key={p.name} value={i} title={p.description}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
