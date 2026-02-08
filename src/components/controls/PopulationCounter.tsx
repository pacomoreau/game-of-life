type Props = {
  population: number;
};

export function PopulationCounter({ population }: Props) {
  return (
    <div className="stat">
      <div className="stat-value">{population.toLocaleString()}</div>
      <div className="stat-label">Population</div>
    </div>
  );
}
