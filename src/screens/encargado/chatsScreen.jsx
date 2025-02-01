import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConversaciones } from "../../services/chatService";
import Icon from "react-native-vector-icons/MaterialIcons";

export function ChatsScreen() {
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (!storedUserId) return;

                setUserId(storedUserId);
                const response = await getConversaciones(storedUserId);

                // Determinar el profesor en cada chat
                const updatedChats = response.map(chat => {
                    const profesorId = chat.idEmisor === storedUserId ? chat.idReceptor : chat.idEmisor;
                    return { ...chat, profesorId };
                });

                setChats(updatedChats);
            } catch (error) {
                console.error("Error obteniendo chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => {
                            navigation.navigate("Chat", {
                                chatId: item.id,
                                profesorId: item.profesorId,
                                receptorNombre: item.receptorNombre,
                            });
                        }}
                    >
                        {/* 📌 Foto de perfil simulada */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: `https://ui-avatars.com/api/?name=${item.receptorNombre}&background=random&bold=true` }}
                                style={styles.avatar}
                            />
                        </View>

                        {/* 📌 Información del chat */}
                        <View style={styles.chatInfo}>
                            <Text style={styles.chatTitle}>{item.receptorNombre}</Text>
                            <Text style={styles.chatLastMessage}>{item.ultimoMensaje}</Text>
                        </View>

                        {/* 📌 Icono de mensaje */}
                        <Icon name="chat" size={24} color="#2563eb" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    chatInfo: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    chatLastMessage: {
        fontSize: 14,
        color: "#666",
        marginTop: 3,
    },
});

export default ChatsScreen;
