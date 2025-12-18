
import { RequirementAnalysis } from "../types";

/**
 * Enhanced deterministic requirement analyzer that extracts granular 
 * enterprise details using heuristic pattern matching.
 */
export async function analyzeRequirements(prompt: string): Promise<RequirementAnalysis> {
  // Simulate network latency for a professional feel
  await new Promise(resolve => setTimeout(resolve, 1800));

  const lowerPrompt = prompt.toLowerCase();
  
  // Logical triggers
  const isSecurity = lowerPrompt.includes('security') || lowerPrompt.includes('auth') || lowerPrompt.includes('secure') || lowerPrompt.includes('mfa');
  const isData = lowerPrompt.includes('database') || lowerPrompt.includes('sql') || lowerPrompt.includes('data') || lowerPrompt.includes('record');
  const isWeb = lowerPrompt.includes('portal') || lowerPrompt.includes('web') || lowerPrompt.includes('ui') || lowerPrompt.includes('interface');
  const isHighTraffic = lowerPrompt.includes('concurrent') || lowerPrompt.includes('users') || lowerPrompt.includes('performance') || lowerPrompt.includes('scale');
  const isFinancial = lowerPrompt.includes('bank') || lowerPrompt.includes('transfer') || lowerPrompt.includes('payment') || lowerPrompt.includes('statement');

  // Role extraction heuristics
  const rolesFound: string[] = [];
  if (lowerPrompt.includes('admin')) rolesFound.push('System Administrator');
  if (lowerPrompt.includes('customer') || lowerPrompt.includes('client')) rolesFound.push('End Customer');
  if (lowerPrompt.includes('manager') || lowerPrompt.includes('supervisor')) rolesFound.push('Operations Manager');
  if (lowerPrompt.includes('guest') || lowerPrompt.includes('anonymous')) rolesFound.push('Guest User');
  if (rolesFound.length === 0) rolesFound.push('Standard Authenticated User');

  // Validation rule generation based on content
  const validationRules = [
    { field: "Identity Token", rule: "Must be a valid JWT with active session state." }
  ];
  if (isFinancial) {
    validationRules.push({ field: "Transaction Amount", rule: "Must be a positive decimal; exceeding daily limit requires multi-step approval." });
    validationRules.push({ field: "Account Identifier", rule: "Must match IBAN or internal routing format." });
  }
  if (isSecurity) {
    validationRules.push({ field: "Auth Credentials", rule: "Passwords must meet enterprise complexity (min 12 chars, alphanumeric, symbols)." });
  }

  // Error handling scenarios
  const errorScenarios = [
    { case: "Service Timeout", resolution: "Implement circuit breaker pattern and 3-step exponential backoff." },
    { case: "Database Deadlock", resolution: "Log transaction ID, rollback state, and notify the health monitoring endpoint." }
  ];
  if (isSecurity) {
    errorScenarios.push({ case: "Invalid MFA Token", resolution: "Lock attempt for 5 minutes after 3 failures; notify security auditor." });
  }

  return {
    summary: `Requirement detected as a ${isFinancial ? 'financial-grade' : 'standard enterprise'} ${isWeb ? 'digital platform' : 'backend service'}. The system prioritizes ${isHighTraffic ? 'scalability and high availability' : 'data integrity and modularity'}${isSecurity ? ' within a zero-trust security architecture' : ''}.`,
    businessPriority: (isHighTraffic || isSecurity || isFinancial) ? 'High' : 'Medium',
    functionalRequirements: [
      { 
        title: "Workflow Orchestration", 
        description: "Coordinate the state transitions for the core business process described." 
      },
      { 
        title: "Audit Trail Generation", 
        description: "Generate immutable logs for every user action to satisfy compliance requirements." 
      }
    ],
    nonFunctionalRequirements: [
      { 
        title: "Availability", 
        description: isHighTraffic ? "Target 99.99% uptime with active-active regional failover." : "Standard 99.9% availability within business hours." 
      },
      { 
        title: "Data Sovereignty", 
        description: "Ensure data at rest is encrypted using AES-256 and keys are managed via HSM." 
      }
    ],
    userRoles: rolesFound,
    dataValidationRules: validationRules,
    errorHandlingScenarios: errorScenarios,
    taskBreakdown: [
      {
        module: "Gateway & Auth",
        description: "Entry point handling rate limiting, authentication, and request routing.",
        apiEndpoints: ["POST /auth/token", "POST /auth/mfa/challenge"],
        databaseRequirements: "Redis for session caching; PostgreSQL for user metadata."
      },
      {
        module: "Business Engine",
        description: "Domain layer containing the core logic and service implementations.",
        apiEndpoints: ["GET /domain/list", "POST /domain/process"],
        databaseRequirements: "Relational schema with ACID compliance for transaction safety."
      }
    ],
    techStack: isHighTraffic 
      ? ["Java 21", "Spring Boot 3", "Redis", "Kafka", "AWS EKS", "Terraform"] 
      : ["Java", "Spring Boot", "PostgreSQL", "React", "Docker"],
    automationLogic: {
      estimatedComplexity: (isHighTraffic && isSecurity) || isFinancial ? 'High' : 'Medium',
      riskFlags: [
        ...(isHighTraffic ? ["Concurrent Request Contention"] : []),
        ...(isFinancial ? ["Regulatory Compliance Risk"] : []),
        ...(isSecurity ? ["Key Management Overhead"] : ["Standard Implementation"])
      ],
      suggestedEffortHours: isFinancial ? 160 : (isHighTraffic ? 120 : 80)
    },
    bestPractices: [
      "Implement OpenTelemetry for distributed tracing.",
      "Adhere to OWASP Top 10 security standards.",
      "Utilize Blue/Green deployment strategies for zero-downtime."
    ]
  };
}
