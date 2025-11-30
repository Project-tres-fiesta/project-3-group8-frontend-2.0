import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isCard?: boolean;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  isCard = false,
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const cardColor = useThemeColor({ light: lightColor, dark: darkColor }, isCard ? 'cardBackground' : 'background');

  const combinedStyle = [
    { backgroundColor: isCard ? cardColor : backgroundColor },
    isCard && styles.card,
    style,
  ];

  return <View style={combinedStyle} {...otherProps} />;
}

const styles = {
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};
