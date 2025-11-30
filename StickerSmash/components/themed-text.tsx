import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'titleLarge' | 'title' | 'headline' | 'bodyLarge' | 'body' | 'labelLarge' | 'label' | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'titleLarge' ? styles.titleLarge : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'headline' ? styles.headline : undefined,
        type === 'bodyLarge' ? styles.bodyLarge : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'labelLarge' ? styles.labelLarge : undefined,
        type === 'label' ? styles.label : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Title styles - Ticketmaster bold headings
  titleLarge: {
    fontSize: 34,
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: 0.25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    letterSpacing: 0,
  },
  headline: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: 0,
  },
  
  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  
  // Label styles
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  
  // Legacy support
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
});
