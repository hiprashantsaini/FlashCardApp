import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AddCardScreen = ({ addCard, loading }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // Validation
        if (!front.trim()) {
            setError('Question field cannot be empty');
            return;
        }

        if (!back.trim()) {
            setError('Answer field cannot be empty');
            return;
        }

        setError('');

        // Call the addCard function passed from App.js
        const success = await addCard(front, back);

        if (success) {
            // Reset form on success
            setFront('');
            setBack('');
            Alert.alert('Success', 'Card added successfully!');
        } else {
            Alert.alert('Error', 'Failed to add card. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Add New Flashcard</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Question/Front Side:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the question"
                        value={front}
                        onChangeText={setFront}
                        multiline
                    />

                    <Text style={styles.label}>Answer/Back Side:</Text>
                    <TextInput
                        style={[styles.input, styles.answerInput]}
                        placeholder="Enter the answer"
                        value={back}
                        onChangeText={setBack}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.addButtonText}>Add Card</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.note}>
                    This card will be scheduled for review using the SM2 spaced repetition algorithm.
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AddCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        gap: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    answerInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 10,
        textAlign: 'center',
    },
    note: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 15,
        fontStyle: 'italic',
    }
});