export type CategoryScore = {
  score: number;
  maximum: number;
  explanation: string;
};

export type EvidenceItem = {
  requirement: string;
  evidence: string;
};

export type ReviewAnalysis = {
  matchScore: number;
  matchLevel: string;
  summary: string;
  categoryScores: {
    requiredSkills: CategoryScore;
    relevantWorkExperience: CategoryScore;
    responsibilitiesAndSeniority: CategoryScore;
    projects: CategoryScore;
    educationAndCertifications: CategoryScore;
    preferredSkills: CategoryScore;
  };
  strengths: EvidenceItem[];
  gaps: EvidenceItem[];
  recommendations: string[];
};
