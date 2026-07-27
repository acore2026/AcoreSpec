/**
 * Profile System
 *
 * Defines workflow profiles that control which workflows are installed.
 * Profiles determine WHICH workflows; delivery (in global config) determines HOW.
 */

import type { Profile } from './global-config.js';

/**
 * Core workflows included in the 'core' profile.
 * These provide the streamlined experience for new users.
 */
export const CORE_WORKFLOWS = ['propose', 'explore', 'apply', 'sync', 'archive'] as const;

/**
 * Workflows for multi-repository, multi-device prototype delivery.
 */
export const PROTOTYPE_WORKFLOWS = [
  'propose',
  'explore',
  'survey',
  'apply',
  'integrate',
  'rehearse',
  'demo',
  'sync',
  'archive',
] as const;

/**
 * All available workflows in the system.
 */
export const ALL_WORKFLOWS = [
  'propose',
  'explore',
  'survey',
  'new',
  'continue',
  'apply',
  'ff',
  'integrate',
  'rehearse',
  'demo',
  'sync',
  'archive',
  'bulk-archive',
  'verify',
  'onboard',
] as const;

export type WorkflowId = (typeof ALL_WORKFLOWS)[number];
export type CoreWorkflowId = (typeof CORE_WORKFLOWS)[number];
export type PrototypeWorkflowId = (typeof PROTOTYPE_WORKFLOWS)[number];

/**
 * Resolves which workflows should be active for a given profile configuration.
 *
 * - 'core' profile always returns CORE_WORKFLOWS
 * - 'custom' profile returns the provided customWorkflows, or empty array if not provided
 */
export function getProfileWorkflows(
  profile: Profile,
  customWorkflows?: string[]
): readonly string[] {
  if (profile === 'custom') {
    return customWorkflows ?? [];
  }
  if (profile === 'prototype') {
    return PROTOTYPE_WORKFLOWS;
  }
  return CORE_WORKFLOWS;
}
