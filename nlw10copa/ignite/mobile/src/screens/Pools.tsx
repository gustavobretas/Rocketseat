import { useCallback, useState } from "react";
import { Icon, Toast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { Loading } from "../components/loading";
import { api } from "../services/api";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
    const { navigate } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [polls, setPolls] = useState<PoolCardPros[]>([]);

    async function fetchPolls() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPolls(response.data.polls);
        } catch (error) {
            console.log(error);
            Toast.show({
                title: "Não foi possível buscar os Bolões",
                placement: "top",
                bgColor: "red.500",
            });
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPolls();
    }, []));

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meu bolões"></Header>

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor={"gray.600"} pb={4} mb={4}>
                <Button
                    title="BUSCAO BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" size="md" color="black" mr={2} />}
                    onPress={() => navigate('find')}
                />
            </VStack>

            {isLoading ? <Loading /> : <FlatList
                data={polls}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <PoolCard data={item} onPress={() => navigate("details", {id: item.id})}/>}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 10 }}
                ListEmptyComponent={() => (<EmptyPoolList />)}
                px={5}
            />
            }
        </VStack>
    )
}