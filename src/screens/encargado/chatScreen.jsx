import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConversaciones, sendMessage, createConversacion } from "../../services/chatService";

export function ChatScreen() {
    const route = useRoute();
    const { profesorId } = route.params; // ID del profesor recibido
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [encargadoId, setEncargadoId] = useState("");
    const [chatId, setChatId] = useState(null);
    const [receptorNombre, setReceptorNombre] = useState("");
    const flatListRef = useRef()// ✅ Ref correcta

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const storedEncargadoId = await AsyncStorage.getItem("userId");
                if (!storedEncargadoId) return;

                setEncargadoId(storedEncargadoId);

                // Obtener todas las conversaciones del encargado
                const conversaciones = await getConversaciones(storedEncargadoId);

                // Filtrar la conversación con el profesor
                const conversacionEncontrada = conversaciones.find(
                    (chat) =>
                        (chat.idEmisor === storedEncargadoId && chat.idReceptor === profesorId) ||
                        (chat.idEmisor === profesorId && chat.idReceptor === storedEncargadoId)
                );

                if (conversacionEncontrada) {
                    setChatId(conversacionEncontrada.id);
                    setMessages(conversacionEncontrada.mensajes || []);
                    setReceptorNombre(conversacionEncontrada.receptorNombre);
                } else {
                    console.log("No se encontró una conversación con este profesor.");
                }
            } catch (error) {
                console.error("Error obteniendo conversación:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // 🔄 **Auto-refresh cada 5 segundos**
        const interval = setInterval(fetchMessages, 10000);

        return () => clearInterval(interval); // 🛑 Limpiar el intervalo al desmontar
    }, [profesorId]);


    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
    
        try {
            let updatedChatId = chatId;
    
            // 🛠️ Si no hay chat, crear uno antes de enviar el mensaje
            if (!updatedChatId) {
                const newChat = await createConversacion(encargadoId, profesorId); // 📌 Crear la conversación
                updatedChatId = newChat.id; // 📌 Guardar el nuevo ID de la conversación
            }
    
            // 📩 Enviar el mensaje con el chatId correcto
            await sendMessage(updatedChatId, newMessage, encargadoId);
            setMessages((prevMessages) => [...prevMessages, { texto: newMessage, emisor: encargadoId }]);
            setNewMessage("");
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        }
    };
    

    if (loading) return <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />;

    return (
        <View style={styles.container}>
            <Text style={styles.chatHeader}>{receptorNombre || "Chat con profesor"}</Text>
            <FlatList
                ref={flatListRef} // ✅ Ref correcta
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.emisor === encargadoId ? styles.sentMessage : styles.receivedMessage,
                        item.emisor === encargadoId ? styles.alignRight : styles.alignLeft
                    ]}>
                        <Text style={styles.messageText}>{item.texto}</Text>
                    </View>
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // 🔄 Autoscroll al final
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 15,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    chatHeader: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#2563eb",
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: "75%",
    },
    sentMessage: {
        backgroundColor: "#FFCDD2", // 🔴 Rojo claro para mensajes enviados por el encargado
    },
    receivedMessage: {
        backgroundColor: "#BBDEFB", // 🔵 Azul claro para mensajes recibidos del profesor
    },
    alignRight: {
        alignSelf: "flex-end",
    },
    alignLeft: {
        alignSelf: "flex-start",
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    textInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    sendButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ChatScreen;
