import { PerformanceMetric, Vulnerability, ProtocolSpec } from './lib/utils';

export const BENCHMARK_DATA: PerformanceMetric[] = [
  { timestamp: '08:00', latency: 450, tokens: 120, tps: 12.5, successRate: 99.8 },
  { timestamp: '09:00', latency: 480, tokens: 135, tps: 11.8, successRate: 99.5 },
  { timestamp: '10:00', latency: 620, tokens: 210, tps: 8.4, successRate: 98.2 },
  { timestamp: '11:00', latency: 510, tokens: 150, tps: 10.2, successRate: 99.1 },
  { timestamp: '12:00', latency: 490, tokens: 140, tps: 11.5, successRate: 99.7 },
  { timestamp: '13:00', latency: 750, tokens: 320, tps: 6.2, successRate: 97.4 },
  { timestamp: '14:00', latency: 540, tokens: 180, tps: 9.8, successRate: 99.3 },
];

export const VULNERABILITIES: Vulnerability[] = [
  {
    id: 'VULN-001',
    name: 'LLM Non-Determinism Consensus Bypass',
    severity: 'CRITICAL',
    description: 'Attackers can craft inputs that lead different LLM validators to disagree on semantic outcomes, potentially splitting the chain or causing unintended reverts.',
    remediation: 'Implement multi-stage semantic comparison with configurable temperature zero (T=0) settings and majority voting thresholds.'
  },
  {
    id: 'VULN-002',
    name: 'Prompt Injection in Smart Contract Logic',
    severity: 'HIGH',
    description: 'Malicious parameters passed to contract functions can contain prompt-escaping sequences that hijack the logic of the underlying LLM call.',
    remediation: 'Enforce strict input sanitization and use prompt templates that wrap user inputs in restricted delimiters.'
  },
  {
    id: 'VULN-003',
    name: 'Economic Starvation of LLM Validators',
    severity: 'MEDIUM',
    description: 'Contracts requesting highly complex completions can drain validator resources if gas limits do not correctly account for variable token costs.',
    remediation: 'Implement dynamic gas pricing models that pre-estimate token usage and require upfront escrow of high-estimate fees.'
  }
];

export const PROTOCOL_SPECS: ProtocolSpec[] = [
  {
    id: 'GEP-001',
    title: 'Hierarchical Validation Pipeline (HVP)',
    status: 'PROPOSED',
    content: `
# GEP-001: Hierarchical Validation Pipeline

## Abstract
Introduce a multi-tier validation system to optimize costs and latency.

## Specification
1. **Tier 1 (Fast-Path)**: Small, fast parameters (e.g., GPT-4o-mini) perform initial validation.
2. **Tier 2 (Audit-Path)**: If Tier 1 confidence is < 0.95, a quorum of larger models (e.g., Gemini 1.5 Pro) is engaged.
3. **Slashing**: Validators are slashed if their Tier 1 results significantly diverge from final Tier 2 outcomes.
    `
  },
  {
    id: 'GEP-002',
    title: 'Native Vector Context Caching',
    status: 'DRAFT',
    content: `
# GEP-002: Native Vector Context Caching

## Abstract
Enable Intelligent Contracts to maintain state via persistent vector embeddings.

## Technical Details
- Contracts can use an \`emit_embedding\` opcode.
- Validators maintain a shared Vector DB.
- Future LLM calls within the contract can reference specific embedding IDs for 'long-term memory'.
    `
  }
];
