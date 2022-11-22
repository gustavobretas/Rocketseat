import { Heading, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Find() {
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar Bolão" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily={"heading"} color="white" fontSize={'lg'} mb={8} textAlign="center">
                    Encontre o bolão atrás do{'\n'}código de identificação
                </Heading>

                <Input mb={2} placeholder="Qual o código do seu bolão?" />

                <Button title="BUSCAR BOLÃO" />

            </VStack>
        </VStack>
    )
}