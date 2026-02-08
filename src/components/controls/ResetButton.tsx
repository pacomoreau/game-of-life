type Props = {
  onReset: () => void;
};

export function ResetButton({ onReset }: Props) {
  return (
    <button className="btn btn-danger" onClick={onReset}>
      ✕ Reset
    </button>
  );
}
