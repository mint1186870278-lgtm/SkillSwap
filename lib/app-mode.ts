/**
 * 应用模式：控制使用 Mock 数据还是真实 API
 * - demo: 竞赛展示，完整 Mock 数据
 * - guest: 游客体验，Mock 数据浏览发现页
 * - authenticated: 已登录用户，真实 API
 */
export type AppMode = 'demo' | 'guest' | 'authenticated';

let appMode: AppMode = 'guest';

export function getAppMode(): AppMode {
  return appMode;
}

export function setAppMode(mode: AppMode): void {
  appMode = mode;
}

export function useMockData(): boolean {
  return appMode === 'demo' || appMode === 'guest';
}
