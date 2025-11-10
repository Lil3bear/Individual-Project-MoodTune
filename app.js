// Color configuration
const colors = {
    blue: '#4a90e2',
    orange: '#ff6b6b',
    green: '#51cf66',
    purple: '#9775fa',
    bg: '#0f0f1e',
    card: '#16213e'
};

// Global variables
let musicData = [];
let timelineChart = null;
let emotionRadarChart = null;

// Load data
async function loadData() {
    try {
        const response = await fetch('emotions.json');
        const data = await response.json();
        musicData = data.songs;
        initializeDashboard();
    } catch (error) {
        console.error('Failed to load data:', error);
        document.getElementById('moodSummary').textContent = 'Failed to load data. Please check the emotions.json file.';
    }
}

// Initialize dashboard
function initializeDashboard() {
    createTimelineChart();
    createEmotionRadarChart();
    generateAIRecommendations();
}

// Create timeline chart
function createTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // Group data by date
    const dailyData = groupByDate(musicData);
    const dates = Object.keys(dailyData).sort();
    const listeningTimes = dates.map(date => {
        const songs = dailyData[date];
        return songs.reduce((total, song) => total + song.duration, 0) / 60; // Convert to minutes
    });

    // Format date display
    const formattedDates = dates.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    timelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: formattedDates,
            datasets: [{
                label: 'Listening Time (minutes)',
                data: listeningTimes,
                backgroundColor: `rgba(74, 144, 226, 0.7)`,
                borderColor: colors.blue,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#e8e8e8',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: colors.card,
                    titleColor: '#e8e8e8',
                    bodyColor: '#e8e8e8',
                    borderColor: colors.blue,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `Listening Time: ${context.parsed.y.toFixed(1)} minutes`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b8b8b8',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#2d2d44',
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b8b8b8',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + ' min';
                        }
                    },
                    grid: {
                        color: '#2d2d44',
                        lineWidth: 1
                    }
                }
            }
        }
    });
}

// Create emotion radar chart
function createEmotionRadarChart() {
    const ctx = document.getElementById('emotionRadarChart').getContext('2d');
    
    // Calculate average emotion values
    const emotionScores = calculateAverageEmotions(musicData);
    
    emotionRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Joyful', 'Melancholic', 'Energetic', 'Calm'],
            datasets: [{
                label: 'Emotion Distribution',
                data: [
                    emotionScores.joyful * 100,
                    emotionScores.melancholic * 100,
                    emotionScores.energetic * 100,
                    emotionScores.calm * 100
                ],
                backgroundColor: 'rgba(151, 117, 250, 0.2)',
                borderColor: colors.purple,
                borderWidth: 3,
                pointBackgroundColor: colors.purple,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colors.purple,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#e8e8e8',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: colors.card,
                    titleColor: '#e8e8e8',
                    bodyColor: '#e8e8e8',
                    borderColor: colors.purple,
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.r.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#b8b8b8',
                        font: {
                            size: 10
                        },
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: '#2d2d44',
                        lineWidth: 1
                    },
                    pointLabels: {
                        color: '#e8e8e8',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    angleLines: {
                        color: '#2d2d44',
                        lineWidth: 1
                    }
                }
            }
        }
    });
}

// Generate AI recommendations
function generateAIRecommendations() {
    const emotionScores = calculateAverageEmotions(musicData);
    const moodSummary = generateMoodSummary(emotionScores);
    const recommendedGenres = generateGenreRecommendations(emotionScores);
    
    // Update mood summary
    document.getElementById('moodSummary').textContent = moodSummary;
    
    // Update recommended genres
    const genreList = document.getElementById('genreList');
    genreList.innerHTML = '';
    
    const genreColors = ['blue', 'orange', 'green', 'purple'];
    recommendedGenres.forEach((genre, index) => {
        const genreTag = document.createElement('div');
        genreTag.className = `genre-tag ${genreColors[index % genreColors.length]}`;
        genreTag.textContent = genre;
        genreList.appendChild(genreTag);
    });
}

// Group data by date
function groupByDate(songs) {
    const grouped = {};
    songs.forEach(song => {
        const date = new Date(song.timestamp).toISOString().split('T')[0];
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(song);
    });
    return grouped;
}

// Calculate average emotion values
function calculateAverageEmotions(songs) {
    const totals = {
        joyful: 0,
        melancholic: 0,
        energetic: 0,
        calm: 0
    };
    
    songs.forEach(song => {
        totals.joyful += song.emotions.joyful;
        totals.melancholic += song.emotions.melancholic;
        totals.energetic += song.emotions.energetic;
        totals.calm += song.emotions.calm;
    });
    
    const count = songs.length;
    return {
        joyful: totals.joyful / count,
        melancholic: totals.melancholic / count,
        energetic: totals.energetic / count,
        calm: totals.calm / count
    };
}

// Generate mood summary
function generateMoodSummary(emotionScores) {
    const dominantEmotion = getDominantEmotion(emotionScores);
    const intensity = getIntensity(emotionScores[dominantEmotion]);
    
    const summaries = {
        joyful: {
            high: 'Your music choices today are filled with joy and positive energy! You tend to choose upbeat and delightful melodies, indicating a very positive mood. Keep up the good vibes!',
            medium: 'Your music preferences show a light and cheerful mood. You enjoy songs that bring happiness and satisfaction.',
            low: 'Your music choices contain some joyful elements, but you might benefit from more positive energy injection.'
        },
        melancholic: {
            high: 'Your music choices reflect a deep, introspective emotional state. You are drawn to melodies rich in emotional depth and melancholic beauty. This mood is perfect for creation and reflection.',
            medium: 'Your music preferences show a gentle melancholic tendency. You appreciate songs that touch the heart and inspire contemplation.',
            low: 'Your music choices occasionally contain melancholic tones, but overall remain balanced.'
        },
        energetic: {
            high: 'Your music choices are full of vitality and dynamism! You tend to choose songs with strong rhythms and high energy, indicating you are in an energetic state.',
            medium: 'Your music preferences show a positive energy level. You enjoy songs that boost your mood and inspire motivation.',
            low: 'Your music choices are relatively mild. Consider adding some more energetic songs to boost your energy.'
        },
        calm: {
            high: 'Your music choices are very peaceful and relaxing. You tend to choose melodies that bring inner peace and tranquility, indicating you are seeking balance and serenity.',
            medium: 'Your music preferences show a peaceful mindset. You appreciate songs that help you relax and relieve stress.',
            low: 'Your music choices are relatively active. Consider adding some calming melodies to balance your mood.'
        }
    };
    
    return summaries[dominantEmotion][intensity];
}

// Get dominant emotion
function getDominantEmotion(emotionScores) {
    let maxScore = 0;
    let dominantEmotion = 'joyful';
    
    Object.keys(emotionScores).forEach(emotion => {
        if (emotionScores[emotion] > maxScore) {
            maxScore = emotionScores[emotion];
            dominantEmotion = emotion;
        }
    });
    
    return dominantEmotion;
}

// Get intensity level
function getIntensity(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
}

// Generate genre recommendations
function generateGenreRecommendations(emotionScores) {
    const recommendations = [];
    
    // Recommend genres based on emotion scores
    if (emotionScores.joyful > 0.6) {
        recommendations.push('Pop');
        recommendations.push('Electronic Dance');
    }
    
    if (emotionScores.melancholic > 0.6) {
        recommendations.push('Jazz');
        recommendations.push('Folk');
    }
    
    if (emotionScores.energetic > 0.6) {
        recommendations.push('Rock');
        recommendations.push('Hip-Hop');
    }
    
    if (emotionScores.calm > 0.6) {
        recommendations.push('Light Music');
        recommendations.push('New Age');
    }
    
    // If no clear preference, provide general recommendations
    if (recommendations.length === 0) {
        recommendations.push('Pop');
        recommendations.push('Light Music');
        recommendations.push('Folk');
    }
    
    // Ensure at least 3 recommendations, maximum 4
    const defaultRecommendations = ['Pop', 'Light Music', 'Folk', 'Electronic'];
    while (recommendations.length < 3) {
        const randomGenre = defaultRecommendations[Math.floor(Math.random() * defaultRecommendations.length)];
        if (!recommendations.includes(randomGenre)) {
            recommendations.push(randomGenre);
        }
    }
    
    return recommendations.slice(0, 4);
}

// API configuration
const API_BASE_URL = 'http://localhost:5000';

// Generate AI mood summary
async function generateAISummary() {
    const generateBtn = document.getElementById('generateSummaryBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    const aiMoodSummary = document.getElementById('aiMoodSummary');
    const aiGenreList = document.getElementById('aiGenreList');
    
    // Disable button and show loading state
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        // Prepare request data
        const requestData = {
            songs: musicData.map(song => ({
                title: song.title,
                emotions: song.emotions
            }))
        };
        
        // Call backend API
        const response = await fetch(`${API_BASE_URL}/generate-summary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display AI-generated mood summary
        aiMoodSummary.textContent = data.mood_summary || 'Unable to generate mood summary.';
        aiMoodSummary.style.display = 'block';
        
        // Display AI-generated genre recommendations
        aiGenreList.innerHTML = '';
        if (data.suggested_genres && data.suggested_genres.length > 0) {
            const genreColors = ['blue', 'orange', 'green', 'purple'];
            data.suggested_genres.forEach((genre, index) => {
                const genreTag = document.createElement('div');
                genreTag.className = `genre-tag ${genreColors[index % genreColors.length]}`;
                genreTag.textContent = genre;
                aiGenreList.appendChild(genreTag);
            });
            aiGenreList.style.display = 'flex';
        }
        
        // Scroll to AI summary area
        aiMoodSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Failed to generate AI summary:', error);
        aiMoodSummary.textContent = `Error: Unable to connect to server. Please ensure the Flask backend is running (${API_BASE_URL}).`;
        aiMoodSummary.style.display = 'block';
        aiMoodSummary.style.color = '#ff6b6b';
    } finally {
        // Restore button state
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    const generateBtn = document.getElementById('generateSummaryBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAISummary);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
});

