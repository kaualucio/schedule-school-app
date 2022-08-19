import { CommonActions, useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, useTheme } from 'native-base';
import { CaretLeft, CheckCircle, IconProps, PlusCircle } from 'phosphor-react-native';

type HeaderProps = {
  title: string,
  icon: React.ElementType<IconProps>,
  button?: boolean,
  add?: boolean,
  handleFunction?: () => void
}

export function Header({ title, icon: Icon, button, add, handleFunction }: HeaderProps) {
  const { colors } = useTheme()
  return (
    <HStack shadow={1} mb={4} px={4} py={3} safeAreaTop alignItems="center" bg="black.700" borderBottomColor="gray.400" borderBottomWidth={2}>
      <HStack alignItems="center" justifyContent="space-between" w="full">
        <HStack alignItems="center" ml={2}>
          <Icon size={35} color={String(colors.secondary)} />
          <Heading color="white" fontSize="xl" ml={1}>
            {title}
          </Heading>
        </HStack>

        {
          button && (
            <IconButton
              _pressed={{ bg: "gray.500" }}
              onPress={handleFunction}
              icon={add ? <CheckCircle size={35} weight="bold" color={String(colors.secondary)} /> : <PlusCircle size={35} weight="bold" color={String(colors.secondary)} />}
            />
          )
        }
      </HStack>
    </HStack>
  );
}