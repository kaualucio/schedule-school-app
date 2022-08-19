import { Text, Pressable } from 'native-base';

type CheckboxProps = {
  label: string,
  handleScheduleSubject: (label: string) => void,
  daysSubjectInAWeek: string[]
}

export function Checkbox({label, handleScheduleSubject, daysSubjectInAWeek}: CheckboxProps) {
  const selected = daysSubjectInAWeek.find(dayWeek => dayWeek === label)
  return (
    <Pressable 
      w={10} 
      h={10} 
      rounded="lg" 
      borderWidth={selected ? 2 : 1} 
      borderColor={selected ? `secondary` : 'gray.200'} 
      alignItems="center" 
      justifyContent="center" 
      onPress={() => handleScheduleSubject(label)}
      >
      <Text fontSize="sm" fontWeight={selected ? 'bold' : 'normal'} color={selected ? `secondary` : 'gray.200'}>{label.substring(0, 3)}</Text>
    </Pressable>
  );
}