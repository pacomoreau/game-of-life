type Props = {
  disabled: boolean;
  onRandomize: () => void;
};

export function RandomizeButton({ disabled, onRandomize }: Props) {
  return (
    <button className="btn" onClick={onRandomize} disabled={disabled}>
      🎲 Randomize
    </button>
  );
}
