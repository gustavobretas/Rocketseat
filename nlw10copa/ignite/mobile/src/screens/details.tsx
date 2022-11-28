import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";

import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/loading";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [pollDetails, setPollDetails] = useState<PoolCardPros>({} as PoolCardPros);
    const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">("guesses");
    const toast = useToast();

    const route = useRoute();
    const { id } = route.params as RouteParams;

    async function fetchPollDetails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);
            setPollDetails(response.data.poll);
            
        } catch (error) {
            console.log(error);
            toast.show({
                title: "Não foi possível buscar os Detalhes do Bolão",
                placement: "top",
                bgColor: "red.500",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: pollDetails.code,
        })
    }

    useEffect(() => {
        fetchPollDetails();
    }, [id]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={pollDetails.title} 
                showBackButton
                showShareButton
                onShare={handleCodeShare} 
            />
            {pollDetails._count?.participants > 0 ? 
                <VStack px={5} flex={1} >
                    <PoolHeader data={pollDetails}/>

                    <HStack bgColor={"gray.800"} p={1} rounded={5} mb={5}>
                         <Option title="Meus Palpites" 
                            isSelected={optionSelected === "guesses"} 
                            onPress={() => setOptionSelected("guesses")}/>
                         <Option title="Ranking do Grupo" 
                            isSelected={optionSelected === "ranking"} 
                            onPress={() => setOptionSelected("ranking")}/>
                    </HStack>

                    <Guesses poolId={pollDetails.id} code={pollDetails.code}/>
                </VStack> 
                : 
                <EmptyMyPoolList code={pollDetails.code}/>
            }
        </VStack>
    );
};