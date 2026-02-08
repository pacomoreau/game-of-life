type Props = {
  running: boolean;
  onToggle: () => void;
};

export function PlayPauseButton({ running, onToggle }: Props) {
  return (
    <button className={`btn ${running ? 'btn-primary' : 'btn-primary'}`} onClick={onToggle}>
      {running ? '⏸ Pause' : '▶ Play'}
    </button>
  );
}
