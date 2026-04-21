/**
 * Admin Dashboard Theme Configuration
 * Centralized color palette for the administrative interface.
 */

// 1. DEFAULT (Modern Purple High-Contrast)
export const DEFAULT = {
  name: 'Standard Pro',
  primary: '#48008C',
  primaryLight: '#C799FF',
  bgMain: '#FAFAFA',
  bgCard: '#FFFFFF',
  bgHeader: '#FFFFFF',
  radius: '0px',
  textMain: '#0D0D0D',
  textMuted: '#666666',
  textLight: '#888888',
  textHeading: '#0D0D0D',
  borderMain: '#0D0D0D',
  borderMuted: '#E2E8F0',
  borderLight: '#DDDDDD',
  scrollbarTrack: '#F1F1F1',
  status: {
    newText: '#2e7d32',
    newBg: '#f0f7f0',
    repliedText: '#333333',
    repliedBg: '#f8f8f8',
    repliedBody: '#f2f2f2',
    repliedBorder: '#999999',
    delete: '#cc0000',
    deleteHover: '#b91c1c'
  },
  sources: {
    popup: { text: '#48008C', bg: '#f8f1ff', border: '#48008C' },
    form: { text: '#0066cc', bg: '#f0f7ff', border: '#0066cc' },
    call: { text: '#008888', bg: '#f0fafa', border: '#008888' }
  },
  hover: { tab: '#f1f1f1', filter: '#f0f0f0', bgLight: '#f1f5f9' }
};

// 2. MIDNIGHT (Ultra-High Contrast Dark Mode)
export const MIDNIGHT = {
  name: 'Midnight Noir',
  primary: '#0EA5E9',
  primaryLight: '#075985',
  bgMain: '#020617',
  bgCard: '#0F172A',
  bgHeader: '#0F172A',
  radius: '0px',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  textLight: '#64748B',
  textHeading: '#F8FAFC',
  borderMain: '#334155',
  borderMuted: '#1E293B',
  borderLight: '#1E293B',
  scrollbarTrack: '#020617',
  status: {
    newText: '#4ADE80',
    newBg: '#052c16',
    repliedText: '#94A3B8',
    repliedBg: '#1E293B',
    repliedBody: '#1E293B',
    repliedBorder: '#334155',
    delete: '#F43F5E',
    deleteHover: '#BE123C'
  },
  sources: {
    popup: { text: '#38BDF8', bg: '#0C4A6E', border: '#38BDF8' },
    form: { text: '#818CF8', bg: '#312E81', border: '#818CF8' },
    call: { text: '#2DD4BF', bg: '#134E4A', border: '#2DD4BF' }
  },
  hover: { tab: '#1E293B', filter: '#1E293B', bgLight: '#1E293B' },
  isExperimental: true
};

// 3. CYBERPUNK (Neon / Black Hybrid)
export const CYBERPUNK = {
  name: 'Neon Cyber',
  primary: '#FF2079',
  primaryLight: '#FF4D9B',
  bgMain: '#000000',
  bgCard: '#0A0A0A',
  bgHeader: '#0A0A0A',
  radius: '0px',
  textMain: '#08F7FE',
  textMuted: '#CCCCCC',
  textLight: '#999999',
  textHeading: '#08F7FE',
  borderMain: '#08F7FE',
  borderMuted: '#333333',
  borderLight: '#1A1A1A',
  scrollbarTrack: '#000000',
  status: {
    newText: '#39FF14',
    newBg: '#0A2000',
    repliedText: '#08F7FE',
    repliedBg: '#1A1A1A',
    repliedBody: '#0A0A0A',
    repliedBorder: '#08F7FE',
    delete: '#FE0000',
    deleteHover: '#B90000'
  },
  sources: {
    popup: { text: '#FF2079', bg: '#200010', border: '#FF2079' },
    form: { text: '#FE0000', bg: '#200000', border: '#FE0000' },
    call: { text: '#39FF14', bg: '#001000', border: '#39FF14' }
  },
  hover: { tab: '#1A1A1A', filter: '#1A1A1A', bgLight: '#111111' },
  isExperimental: true
};

// 4. FOREST (Natural / Calm / Pro)
export const FOREST = {
  name: 'Forest Emerald',
  primary: '#064E3B',
  primaryLight: '#10B981',
  bgMain: '#F9FAF7',
  bgCard: '#FFFFFF',
  bgHeader: '#FFFFFF',
  radius: '0px',
  textMain: '#064E3B',
  textMuted: '#4B5563',
  textLight: '#6B7280',
  textHeading: '#064E3B',
  borderMain: '#064E3B',
  borderMuted: '#E5E7EB',
  borderLight: '#F3F4F6',
  scrollbarTrack: '#F9FAF7',
  status: {
    newText: '#10B981',
    newBg: '#ECFDF5',
    repliedText: '#064E3B',
    repliedBg: '#F3F4F6',
    repliedBody: '#F9FAF7',
    repliedBorder: '#34D399',
    delete: '#991B1B',
    deleteHover: '#7F1D1D'
  },
  sources: {
    popup: { text: '#059669', bg: '#D1FAE5', border: '#059669' },
    form: { text: '#15803D', bg: '#DCFCE7', border: '#15803D' },
    call: { text: '#0D9488', bg: '#CCFBF1', border: '#0D9488' }
  },
  hover: { tab: '#ECFDF5', filter: '#ECFDF5', bgLight: '#F0FDF4' }
};

// 5. TOKYO (Deep Night / Purple)
export const TOKYO = {
  name: 'Tokyo Night',
  primary: '#BB9AF7',
  primaryLight: '#7AA2F7',
  bgMain: '#1A1B26',
  bgCard: '#24283B',
  bgHeader: '#24283B',
  radius: '0px',
  textMain: '#C0CAF5',
  textMuted: '#9ECE6A',
  textLight: '#565F89',
  textHeading: '#BB9AF7',
  borderMain: '#BB9AF7',
  borderMuted: '#16161E',
  borderLight: '#1F2335',
  scrollbarTrack: '#16161E',
  status: {
    newText: '#9ECE6A',
    newBg: '#2E3D30',
    repliedText: '#7AA2F7',
    repliedBg: '#1F2335',
    repliedBody: '#1A1B26',
    repliedBorder: '#BB9AF7',
    delete: '#F7768E',
    deleteHover: '#E06C75'
  },
  sources: {
    popup: { text: '#BB9AF7', bg: '#3B2F52', border: '#BB9AF7' },
    form: { text: '#7AA2F7', bg: '#2A344A', border: '#7AA2F7' },
    call: { text: '#7DCFFF', bg: '#243D53', border: '#7DCFFF' }
  },
  hover: { tab: '#2F3549', filter: '#2F3549', bgLight: '#1F2335' },
  isExperimental: true
};

// 6. VS_DARK (VSCode Dark Modern)
export const VS_DARK = {
  name: 'VS Dark Modern',
  primary: '#007ACC',
  primaryLight: '#264F78',
  bgMain: '#1F1F1F',
  bgCard: '#181818',
  bgHeader: '#181818',
  radius: '0px',
  textMain: '#CCCCCC',
  textMuted: '#858585',
  textLight: '#858585',
  textHeading: '#FFFFFF',
  borderMain: '#3C3C3C',
  borderMuted: '#2D2D2D',
  borderLight: '#2B2B2B',
  scrollbarTrack: '#1F1F1F',
  status: {
    newText: '#4EC9B0',
    newBg: '#1E1E1E',
    repliedText: '#CCCCCC',
    repliedBg: '#2D2D2D',
    repliedBody: '#181818',
    repliedBorder: '#3C3C3C',
    delete: '#F48771',
    deleteHover: '#D16969'
  },
  sources: {
    popup: { text: '#4FC1FF', bg: '#264F78', border: '#4FC1FF' },
    form: { text: '#CE9178', bg: '#3D3D3D', border: '#CE9178' },
    call: { text: '#B5CEA8', bg: '#2D2D2D', border: '#B5CEA8' }
  },
  hover: { tab: '#2A2D2E', filter: '#2D2D2D', bgLight: '#1E1E1E' },
  isExperimental: true
};

// 7. SLATE (GitHub Dark / Slate)
export const SLATE = {
  name: 'Slate Pro',
  primary: '#58A6FF',
  primaryLight: '#1F6FEB',
  bgMain: '#0D1117',
  bgCard: '#161B22',
  bgHeader: '#161B22',
  radius: '0px',
  textMain: '#C9D1D9',
  textMuted: '#8B949E',
  textLight: '#484F58',
  textHeading: '#F0F6FC',
  borderMain: '#30363D',
  borderMuted: '#21262D',
  borderLight: '#21262D',
  scrollbarTrack: '#0D1117',
  status: {
    newText: '#3FB950',
    newBg: '#0E4429',
    repliedText: '#C9D1D9',
    repliedBg: '#21262D',
    repliedBody: '#161B22',
    repliedBorder: '#30363D',
    delete: '#F85149',
    deleteHover: '#DA3633'
  },
  sources: {
    popup: { text: '#A5D6FF', bg: '#121D2F', border: '#A5D6FF' },
    form: { text: '#D2A8FF', bg: '#212636', border: '#D2A8FF' },
    call: { text: '#79C0FF', bg: '#121D2F', border: '#79C0FF' }
  },
  hover: { tab: '#21262D', filter: '#21262D', bgLight: '#161B22' },
  isExperimental: true
};

export const THEME_MAP = {
  DEFAULT,
  MIDNIGHT,
  CYBERPUNK,
  FOREST,
  TOKYO,
  VS_DARK,
  SLATE
};

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// PORTFOLIO GLOBAL THEME CONFIGURATION
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
export const PORTFOLIO_THEME = {
  colors: {
    primaryRgb: '15, 15, 15',       // Deep rich black 
    secondaryRgb: '255, 255, 255',   // White
    accentRgb: '201, 166, 83',       // Premium Gold matching the logo
    textMain: '#141414',
    textMuted: '#665e52',
    bgSoft: '#faf9f6',               // Warm soft white
    borderSubtle: '#e6dfd1',         // Warmer subtle border
  },
  radius: {
    pro: '22px',
    proInner: '18px',
    btn: '0px',
    pill: '100px'
  }
};
