/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, Nativewind, Tamagui, unistyles, etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1E90FF'; // Primary blue (light mode)
const tintColorDark = '#4DA3FF';  // Lighter blue for dark mode

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    cardBackground: '#F8F9FA',
    border: '#E9ECEF',
    primary: '#1E90FF',
    primaryLight: '#4DA3FF',
    secondary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#AAAAAA',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    cardBackground: '#1C1C1E',
    border: '#38383A',
    primary: '#4DA3FF',
    primaryLight: '#1E90FF',
    secondary: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

