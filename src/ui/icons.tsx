import type { ReactNode } from 'react';
const S = (p: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{p.children}</svg>
);
export const IExplode = () => <S><path d="M12 3v4M12 17v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" /></S>;
export const ICollapse = () => <S><path d="M12 3v6M12 21v-6M3 12h6M21 12h-6M9 9l-5-5M15 9l5-5M9 15l-5 5M15 15l5 5" /></S>;
export const IIsolate = () => <S><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><rect x="9" y="9" width="6" height="6" rx="1" /></S>;
export const IAll = () => <S><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></S>;
export const ICamera = () => <S><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></S>;
export const IView = () => <S><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></S>;
export const ISection = () => <S><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M12 2v20" strokeDasharray="3 2" /></S>;
export const IGhost = () => <S><path d="M5 20V10a7 7 0 0 1 14 0v10l-3-2-2 2-2-2-2 2-2-2z" /></S>;
export const IReset = () => <S><path d="M4 12a8 8 0 1 0 2.5-5.8" /><path d="M4 4v5h5" /><path d="M12 8v4l3 2" /></S>;
export const IEye = ({ off }: { off?: boolean }) => <S>{off ? <><path d="M3 3l18 18" /><path d="M10.6 6.2A9 9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.2 7.3C3.6 9 2 12 2 12s4 7 10 7a9 9 0 0 0 4-1" /></> : <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>}</S>;
export const ISolo = () => <S><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></S>;
export const IClose = () => <S><path d="M6 6l12 12M18 6L6 18" /></S>;
export const IPanel = () => <S><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></S>;
export const IChevron = () => <S><path d="M6 9l6 6 6-6" /></S>;
