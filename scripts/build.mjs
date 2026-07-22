import { spawnSync } from 'node:child_process'

const env = {
  ...process.env,
  NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED ?? '1',
  RAYON_NUM_THREADS: process.env.RAYON_NUM_THREADS ?? '1',
  UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE ?? '1',
}

const result = spawnSync('next', ['build', '--webpack'], {
  env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
