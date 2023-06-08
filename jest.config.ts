import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '<rootDir>/target/jest-cache',
  coverageDirectory: '<rootDir>/target/test-results/',
  coveragePathIgnorePatterns: ['.mock.ts'],
  testMatch: [
    '**/*.test.ts?(x)', '**/*.spec.ts?(x)',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  rootDir: '.',
  clearMocks: true,
  transformIgnorePatterns: ['node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '**/*.test.ts?(x)',
    '**/*.spec.ts?(x)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
