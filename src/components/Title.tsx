import { Heading, HStack, useColorMode, useTheme, VStack } from 'native-base';
import { IconProps } from 'phosphor-react-native';

type Title = {
  title: string | undefined | number,
  titleSize?: string,
  primary?: boolean,
  icon: React.ElementType<IconProps>,
  iconSize?: number
}

export function Title({ title, primary = false, titleSize = "lg", iconSize = 32, icon: Icon }: Title) {
  const { colors } = useTheme()

  return (
    <HStack alignItems="center" >
      <Icon color={String(colors.secondary)} weight="bold" size={iconSize} />
      <Heading color={'gray.200'} fontSize={titleSize} ml={1}>{title}</Heading>
    </HStack>
  );
}