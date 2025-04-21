import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Use your laptop's IP address when testing on a physical device
const API_URL = 'http://192.168.109.166:8080/api';
// const userId = '65f69aaea04e5d902e842278'; // 

const ReviewScreen = ({onReviewComplete,userId }) => {
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch cards due for review
    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/flashcards/${userId}`);
            setCards(response.data);
            setCurrentCardIndex(0);
            setShowAnswer(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to load flashcards. Check your connection.');
        }
    };

    const handleScore = async (score) => {
        if (!cards.length) return;

        try {
            const currentCard = cards[currentCardIndex];
            const response = await axios.post(`${API_URL}/flashcards/review`, {
                cardId: currentCard._id,
                score,
            });

            // Get updated card information
            const updatedCard = response.data;
            const nextDate = new Date(updatedCard.nextReviewDate).toLocaleDateString();

            // Show result to user
            Alert.alert(
                `Score: ${score}`,
                `Next review in ${updatedCard.interval} day(s) on ${nextDate}.\n\nEase Factor: ${updatedCard.EF.toFixed(2)}`,
                [{ text: "Continue", onPress: () => moveToNextCard() }]
            );
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit your review. Please try again.');
        }
    };

    const moveToNextCard = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        } else {
            Alert.alert(
                "Review Complete",
                "You've completed all cards due for review!",
                [{
                    text: "OK", onPress: () => {
                        fetchCards();
                        if (onReviewComplete) onReviewComplete();
                    }
                }]
            );
        }
    };

    const renderScoreButtons = () => {
        const scoreDescriptions = [
            "Incorrect, complete blackout",
            "Incorrect, wrong guess",
            "Incorrect, remembered after hint",
            "Correct, but difficult",
            "Correct, with hesitation",
            "Perfect recall"
        ];

        return (
            <View style={styles.scoreContainer}>
                <Text style={styles.scorePrompt}>How well did you remember this?</Text>

                {[0, 1, 2, 3, 4, 5].map((score) => (
                    <TouchableOpacity
                        key={score}
                        style={[
                            styles.scoreButton,
                            {
                                backgroundColor:
                                    score <= 1 ? '#f44336' :  // Red for 0-1
                                        score <= 2 ? '#ff9800' :  // Orange for 2
                                            score <= 3 ? '#ffeb3b' :  // Yellow for 3
                                                score <= 4 ? '#8bc34a' :  // Light green for 4
                                                    '#4caf50'                 // Green for 5
                            }
                        ]}
                        onPress={() => handleScore(score)}
                    >
                        <Text style={styles.scoreButtonText}>{score}</Text>
                        <Text style={styles.scoreDescription}>{scoreDescriptions[score]}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading flashcards...</Text>
            </View>
        );
    }

    if (cards.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No cards due for review!</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchCards}
                >
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentCard = cards[currentCardIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.progress}>
                Card {currentCardIndex + 1} of {cards.length}
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardFront}>{currentCard.front}</Text>

                {showAnswer ? (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.cardBack}>{currentCard.back}</Text>
                        {renderScoreButtons()}
                    </>
                ) : (
                    <TouchableOpacity
                        style={styles.showAnswerButton}
                        onPress={() => setShowAnswer(true)}
                    >
                        <Text style={styles.showAnswerText}>Show Answer</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.cardInfoContainer}>
                <Text style={styles.cardInfo}>
                    Last reviewed: {currentCard.lastReviewed ? new Date(currentCard.lastReviewed).toLocaleDateString() : 'Never'}
                </Text>
                <Text style={styles.cardInfo}>
                    Ease Factor: {currentCard.EF.toFixed(2)}
                </Text>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    progress: {
        position: 'absolute',
        top: 10,
        fontSize: 16,
        color: '#666',
    },
    card: {
        width: '100%',
        minHeight: 200,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        alignItems: 'center',
    },
    cardFront: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    divider: {
        width: '80%',
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 15,
    },
    cardBack: {
        fontSize: 24,
        textAlign: 'center',
        color: '#444',
        marginBottom: 20,
    },
    showAnswerButton: {
        marginTop: 30,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    showAnswerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreContainer: {
        width: '100%',
        marginTop: 20,
    },
    scorePrompt: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#555',
    },
    scoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    scoreButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        width: 25,
        textAlign: 'center',
    },
    scoreDescription: {
        color: 'white',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
    cardInfoContainer: {
        marginTop: 15,
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 10,
        borderRadius: 8,
        width: '100%',
    },
    cardInfo: {
        fontSize: 12,
        color: '#666',
        marginBottom: 3,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
});

export default ReviewScreen;
