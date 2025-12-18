
export interface RequirementAnalysis {
  summary: string;
  businessPriority: 'High' | 'Medium' | 'Low';
  functionalRequirements: Array<{ title: string; description: string }>;
  nonFunctionalRequirements: Array<{ title: string; description: string }>;
  userRoles: string[];
  dataValidationRules: Array<{ field: string; rule: string }>;
  errorHandlingScenarios: Array<{ case: string; resolution: string }>;
  taskBreakdown: Array<{
    module: string;
    description: string;
    apiEndpoints: string[];
    databaseRequirements: string;
  }>;
  techStack: string[];
  automationLogic: {
    estimatedComplexity: 'High' | 'Medium' | 'Low';
    riskFlags: string[];
    suggestedEffortHours: number;
  };
  bestPractices: string[];
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error';
