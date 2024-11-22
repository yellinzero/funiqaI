import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
  // Extend the conventional commit configuration
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error, // Set the severity level to "Error"
      'always', // Enforce the rule always
      [
        'feat', // Introduce a new feature
        'fix', // Fix a bug
        'docs', // Documentation changes
        'style', // Code style changes (e.g., formatting, missing semicolons)
        'refactor', // Code refactoring (neither fixes a bug nor adds a feature)
        'test', // Add or update tests
        'chore', // Changes to the build process or auxiliary tools
        'build', // Build-related changes (e.g., dependencies, scripts)
      ],
    ],
    'header-max-length': [
      RuleConfigSeverity.Warning, // Set the severity level to "Warning"
      'always', // Enforce the rule always
      120, // Maximum length of the commit header
    ],
  },
}

module.exports = Configuration
