import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    const toast = useToast();

    const { navigate } = useNavigation();

    async function handleJoinPoll() {
        try {
            setIsLoading(true);

            if (!code.trim()) {
                return toast.show({
                    title: "Informe o Código do Bolão",
                    placement: "top",
                    bgColor: "red.500",
                });
            }

            await api.post('/pools/join', { code: code.toUpperCase() });
            
            setIsLoading(false);
            setCode('');

            toast.show({
                title: "Você entrou no bolão com sucesso!",
                placement: "top",
                bgColor: "green.500",
            });

            navigate("polls");

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.response?.data?.message === 'Poll not found') {
                return toast.show({
                    title: "Bolão não encontrado",
                    placement: "top",
                    bgColor: "red.500",
                });
            } else if (error.response?.data?.message === 'You are already a participant on this poll.') {
                return toast.show({
                    title: "Você já participa deste bolão",
                    placement: "top",
                    bgColor: "red.500",
                });
            }
        }
        
    }
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar Bolão" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily={"heading"} color="white" fontSize={'lg'} mb={8} textAlign="center">
                    Encontre o bolão atrás do{'\n'}código de identificação
                </Heading>

                <Input mb={2} placeholder="Qual o código do seu bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />

                <Button title="BUSCAR BOLÃO" onPress={handleJoinPoll}/>

            </VStack>
        </VStack>
    )
}