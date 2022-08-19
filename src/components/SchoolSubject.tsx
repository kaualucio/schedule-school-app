import { Pressable, HStack, Text, VStack, Box, useTheme } from 'native-base';
import { Book, CaretRight, Exam, GraduationCap, Tag } from 'phosphor-react-native';
import { ISubject } from '../services/sqlite/Subject';


type SchoolSubjectProps = {
  data: ISubject,
  handleShowSubjectInfo: (subject: ISubject | null) => void
}

export function SchoolSubject({data, handleShowSubjectInfo, }: SchoolSubjectProps) {
  const {colors} = useTheme()
  return (
    <Pressable onPress={() => handleShowSubjectInfo(data)} mb="4" >
      <HStack
        bg={{ 
          linearGradient: { 
            colors: ['secondary', 'primary'], 
            start: [0, 0], 
            end: [1, 1] 
          } 
        }} 
        h="24" 
        px={5} 
        rounded="md" 
        alignItems="center" 
        justifyContent="space-between">
        <HStack alignItems="center">
          <Book size={40} color={colors.white} />
          <HStack ml="3">
            <VStack>
              <Text fontSize="lg" color="white" fontWeight="bold">{data.name.length >= 15 ? `${data.name.substring(0, 15)}...` : data.name}</Text>
              <HStack mt="1" justifyContent="space-between">
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Tag size={18} color={colors.white}/>
                  <Text ml="1" fontSize="xs" color="white">{data.tagName}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <GraduationCap size={18} color={colors.white} />
                  <Text ml="1" fontSize="xs" color="white">{data.professor}</Text>
                </Box>
                <Box mr="2" flexDirection="row" alignItems="center">
                  <Exam size={18} color={colors.white}/>
                  <Text ml="1" fontSize="xs"  color="white">{data.average.toFixed(1)}</Text>
                </Box>
              </HStack>
            </VStack>
          </HStack>
        </HStack>
        <CaretRight size={26} color={String(colors.white)}  />
      </HStack>    
    </Pressable>
  );
}

