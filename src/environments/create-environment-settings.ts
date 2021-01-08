import * as deepmerge from 'deepmerge';

import { environmentDefaults } from './defaults';
import { EnvironmentSettings } from './models';

export function createEnvironmentSettings(
  customValues: Partial<EnvironmentSettings>,
  baseValues: EnvironmentSettings = environmentDefaults,
): EnvironmentSettings {
  return deepmerge.all<EnvironmentSettings>(
    [
      {},
      baseValues,
      customValues
    ]
  );
}
