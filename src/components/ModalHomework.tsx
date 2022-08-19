import { useNavigation } from '@react-navigation/native';
import { Button, HStack, Spinner, Text } from 'native-base';
import { Pencil, Trash } from 'phosphor-react-native';
import { forwardRef, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useRefetch } from '../context/RefetchContext';
import HomeworkModel, { IHomework } from '../services/sqlite/HomeworkModel';
import { HomeworkInfo } from './HomeworkInfo';

const { height } = Dimensions.get('screen')

type ModalProps = {
  currentHomeworkInfo: IHomework,
  handleShowHomeworkInfo: (homework: IHomework | null) => void
}

export const ModalHomework = forwardRef(({ currentHomeworkInfo, handleShowHomeworkInfo }: ModalProps, ref: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleRefetchData } = useRefetch()
  const navigation = useNavigation()
  async function handleDelete(id: any) {
    setIsLoading(true)
    try {
      const response = await HomeworkModel.remove(id)
      if(response) {
          ref.current?.close();
      } 
      setIsLoading(false)
      handleRefetchData()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      Alert.alert('Ooops :|', 'Ocorreu um erro ao deletar a anotação da agenda, tente novamente')
    }

  }

  function handleGoEditScreen() {
    ref.current?.close();
    navigation.navigate('editHomework', {
      homework: currentHomeworkInfo
    })
  }
  return (
          <GestureHandlerRootView >
            <Portal>
              <Modalize 
                  ref={ref} 
                  snapPoint={height * 0.8}
                  modalHeight={height * 0.8}
                  onClose={() => handleShowHomeworkInfo(null)}
                  FooterComponent={
                    <HStack mb={5} alignItems="center" justifyContent="center">
                      <Button
                        _pressed={{ bg: "gray.500" }}
                        onPress={() => handleDelete(currentHomeworkInfo?.id)} 
                        mr={1}
                        disabled={isLoading} 
                        opacity={isLoading ? 0.7 : 1}
                        bgColor="error.500" 
                        w={40} 
                        h={12}>
                        <HStack alignItems="center">
                          {
                            isLoading 
                            ? <Spinner color="white" size="sm" accessibilityLabel={`Excluindo a disciplina ${currentHomeworkInfo?.title}`} /> 
                            : (
                              <>
                                <Trash size={22} color="#fff" />
                                <Text fontSize="md" fontWeight="bold" color="white">Excluir</Text>
                              </>
                            )
                          }
                          
                        </HStack>
                      </Button>
                      <Button  
                        _pressed={{ bg: "gray.500" }}
                        ml={1} 
                        bgColor="primary" 
                        opacity={isLoading ? 0.7 : 1}
                        w={40} 
                        h={12}
                        onPress={handleGoEditScreen}
                        >
                        <HStack alignItems="center">
                          <Pencil size={22} color="#fff" />
                          <Text fontSize="md" fontWeight="bold" color="white">Editar</Text>    
                        </HStack>
                      </Button>
                    </HStack>
                  }
                  >
                  <HomeworkInfo homework={currentHomeworkInfo} /> 
                </Modalize>
            </Portal>
          </GestureHandlerRootView> 
  );
}) 

 