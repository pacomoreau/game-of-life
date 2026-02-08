type Props = {
  disabled: boolean;
  onStep: () => void;
};

export function StepButton({ disabled, onStep }: Props) {
  return (
    <button className="btn" onClick={onStep} disabled={disabled}>
      ⏭ Step
    </button>
  );
}
