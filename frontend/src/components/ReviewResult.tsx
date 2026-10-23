import type { EvidenceItem, ReviewAnalysis } from '../types';

type ReviewResultProps = {
  result: ReviewAnalysis;
};

const categoryLabels = [
  ['Required skills', 'requiredSkills'],
  ['Relevant work experience', 'relevantWorkExperience'],
  ['Responsibilities and seniority', 'responsibilitiesAndSeniority'],
  ['Projects', 'projects'],
  ['Education and certifications', 'educationAndCertifications'],
  ['Preferred skills', 'preferredSkills'],
] as const;

function interpolateColor(start: string, end: string, amount: number) {
  const startRgb = start.match(/\w\w/g)?.map((value) => parseInt(value, 16)) ?? [];
  const endRgb = end.match(/\w\w/g)?.map((value) => parseInt(value, 16)) ?? [];
  const clampedAmount = Math.max(0, Math.min(1, amount));

  const channels = startRgb.map((channel, index) =>
    Math.round(channel + (endRgb[index] - channel) * clampedAmount),
  );

  return `rgb(${channels.join(', ')})`;
}

function getMatchColors(score: number) {
  const clampedScore = Math.max(0, Math.min(100, score));

  if (clampedScore <= 75) {
    return {
      backgroundColor: interpolateColor('#b91c1c', '#fecaca', clampedScore / 75),
      color: clampedScore >= 56 ? '#1d1d1f' : '#fff',
    };
  }

  return {
    backgroundColor: interpolateColor(
      '#bbf7d0',
      '#166534',
      (clampedScore - 76) / 24,
    ),
    color: clampedScore <= 87 ? '#1d1d1f' : '#fff',
  };
}

export function ReviewResult({ result }: ReviewResultProps) {
  const matchColors = getMatchColors(result.matchScore);

  return (
    <section className="review-result" aria-live="polite">
      <div className="score-summary" style={matchColors}>
        <div>
          <p className="section-kicker">Overall match</p>
          <p className="match-level">{result.matchLevel} match</p>
        </div>
        <strong>{result.matchScore}<span>/100</span></strong>
      </div>

      <section className="result-section summary-section">
        <p className="section-kicker">Summary</p>
        <p>{result.summary}</p>
      </section>

      <section className="result-section">
        <p className="section-kicker">Category scores</p>
        <div className="category-grid">
          {categoryLabels.map(([label, key]) => {
            const category = result.categoryScores[key];
            const percentage = (category.score / category.maximum) * 100;

            return (
              <article className="category-card" key={key}>
                <div className="category-heading">
                  <span>{label}</span>
                  <strong>
                    {category.score}/{category.maximum}
                  </strong>
                </div>
                <div className="score-bar" aria-hidden="true">
                  <span style={{ width: `${percentage}%` }} />
                </div>
                <p>{category.explanation}</p>
              </article>
            );
          })}
        </div>
      </section>

      <EvidenceSection title="Strengths" items={result.strengths} />
      <EvidenceSection title="Gaps" items={result.gaps} />

      <section className="result-section">
        <p className="section-kicker">Recommendations</p>
        {result.recommendations.length > 0 ? (
          <ul className="recommendation-list">
            {result.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations were provided.</p>
        )}
      </section>
    </section>
  );
}

function EvidenceSection({
  title,
  items,
}: {
  title: string;
  items: EvidenceItem[];
}) {
  return (
    <section className="result-section">
      <p className="section-kicker">{title}</p>
      {items.length > 0 ? (
        <div className="evidence-list">
          {items.map((item) => (
            <article className="evidence-card" key={`${item.requirement}-${item.evidence}`}>
              <h3>{item.requirement}</h3>
              <p>{item.evidence}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No items were identified.</p>
      )}
    </section>
  );
}
