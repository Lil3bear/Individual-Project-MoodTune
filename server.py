from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Placeholder function to simulate OpenAI API call
def simulate_openai_api(emotion_data):
    """
    Simulate OpenAI API call, generate mood summary and recommendations based on emotion data
    
    Args:
        emotion_data: List containing song emotion data
    
    Returns:
        dict: Dictionary containing mood_summary and suggested_genres
    """
    # Calculate average emotion scores
    total_songs = len(emotion_data)
    if total_songs == 0:
        return {
            "mood_summary": "No music data available. Unable to generate mood summary.",
            "suggested_genres": ["Pop", "Light Music", "Folk"]
        }
    
    avg_emotions = {
        "joyful": sum(song.get("emotions", {}).get("joyful", 0) for song in emotion_data) / total_songs,
        "melancholic": sum(song.get("emotions", {}).get("melancholic", 0) for song in emotion_data) / total_songs,
        "energetic": sum(song.get("emotions", {}).get("energetic", 0) for song in emotion_data) / total_songs,
        "calm": sum(song.get("emotions", {}).get("calm", 0) for song in emotion_data) / total_songs
    }
    
    # Determine dominant emotion
    dominant_emotion = max(avg_emotions.items(), key=lambda x: x[1])
    emotion_name = dominant_emotion[0]
    emotion_score = dominant_emotion[1]
    
    # Generate mood summaries
    mood_summaries = {
        "joyful": [
            f"Based on your music listening habits, you've been choosing joyful and positive music lately. Your joy emotion score reaches {emotion_score:.1%}, indicating a very optimistic mood! Keep up this positive energy. Your music choices reflect the sunshine and vitality within you.",
            f"Your music preferences show a strong joyful tendency ({emotion_score:.1%}). You're drawn to melodies full of energy and delight. These music choices can effectively boost your mood and bring positive emotional experiences.",
            f"Analysis shows that joyful songs dominate your music library ({emotion_score:.1%}). This music preference indicates you're enjoying the beautiful moments in life and spreading positive energy through music."
        ],
        "melancholic": [
            f"Your music listening data reveals a deep emotional state. Your melancholic emotion score reaches {emotion_score:.1%}, and you tend to choose songs rich in emotional depth and meaning. This music preference may reflect your pursuit of introspection and contemplation, with music becoming an outlet for emotional expression.",
            f"Based on analysis, your music choices show a clear melancholic tendency ({emotion_score:.1%}). You're drawn to melodies that touch the heart and resonate deeply. This music preference can help you process emotions and promote self-reflection and growth.",
            f"Your music preferences show a gentle yet deep melancholic tendency ({emotion_score:.1%}). You appreciate songs with rich emotional layers. This choice reflects your pursuit of musical artistry and understanding of emotional depth."
        ],
        "energetic": [
            f"Your music listening habits show strong vitality and dynamism! Your energetic emotion score is as high as {emotion_score:.1%}, and you tend to choose songs with strong rhythms and high energy. This music preference indicates you're in a state full of vitality and motivation, with music becoming a way to release energy.",
            f"Analysis reveals that your music choices are full of vitality and passion ({emotion_score:.1%}). You're drawn to songs that can inspire motivation and boost energy. This music preference can help you maintain a positive mindset and enhance your drive.",
            f"Your music preferences show a clear energetic tendency ({emotion_score:.1%}). You enjoy melodies with upbeat rhythms and dynamic energy. This choice reflects your passion for life and positive attitude."
        ],
        "calm": [
            f"Your music listening data reveals a state of seeking peace and balance. Your calm emotion score reaches {emotion_score:.1%}, and you tend to choose songs that bring inner peace and relaxation. This music preference indicates you're using music to regulate your mood and seek inner tranquility.",
            f"Based on analysis, your music choices show a clear calm tendency ({emotion_score:.1%}). You're drawn to soft, soothing melodies. This music preference can help you relax, relieve stress, and promote inner balance.",
            f"Your music preferences show a peaceful and serene state ({emotion_score:.1%}). You appreciate songs that bring inner peace and tranquility. This choice reflects your pursuit of quality of life and attention to your inner world."
        ]
    }
    
    # Randomly select a summary
    mood_summary = random.choice(mood_summaries.get(emotion_name, mood_summaries["calm"]))
    
    # Generate genre recommendations
    genre_suggestions = generate_genre_suggestions(avg_emotions)
    
    return {
        "mood_summary": mood_summary,
        "suggested_genres": genre_suggestions
    }

def generate_genre_suggestions(avg_emotions):
    """Generate genre recommendations based on emotion scores"""
    suggestions = []
    
    # Recommend genres based on emotion scores
    if avg_emotions["joyful"] > 0.6:
        suggestions.extend(["Pop", "Electronic Dance", "Funk"])
    elif avg_emotions["joyful"] > 0.4:
        suggestions.extend(["Pop", "Light Music"])
    
    if avg_emotions["melancholic"] > 0.6:
        suggestions.extend(["Jazz", "Folk", "Blues"])
    elif avg_emotions["melancholic"] > 0.4:
        suggestions.extend(["Folk", "Light Music"])
    
    if avg_emotions["energetic"] > 0.6:
        suggestions.extend(["Rock", "Hip-Hop", "Electronic"])
    elif avg_emotions["energetic"] > 0.4:
        suggestions.extend(["Rock", "Pop"])
    
    if avg_emotions["calm"] > 0.6:
        suggestions.extend(["Light Music", "New Age", "Ambient"])
    elif avg_emotions["calm"] > 0.4:
        suggestions.extend(["Light Music", "Jazz"])
    
    # If no clear preference, provide general recommendations
    if not suggestions:
        suggestions = ["Pop", "Light Music", "Folk"]
    
    # Remove duplicates and limit quantity
    unique_suggestions = list(dict.fromkeys(suggestions))
    return unique_suggestions[:4]

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    """
    API endpoint to generate mood summary
    
    Expected request body:
    {
        "songs": [
            {
                "title": "Song Name",
                "emotions": {
                    "joyful": 0.8,
                    "melancholic": 0.1,
                    "energetic": 0.3,
                    "calm": 0.9
                }
            },
            ...
        ]
    }
    
    Returns:
    {
        "mood_summary": "Mood summary text",
        "suggested_genres": ["Genre1", "Genre2", ...]
    }
    """
    try:
        data = request.get_json()
        
        # Validate request data
        if not data or 'songs' not in data:
            return jsonify({
                "error": "Invalid request data format. Must include 'songs' field"
            }), 400
        
        songs = data['songs']
        if not isinstance(songs, list) or len(songs) == 0:
            return jsonify({
                "error": "songs must be a non-empty array"
            }), 400
        
        # Call simulated OpenAI API
        result = simulate_openai_api(songs)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "MoodTune API is running normally"}), 200

if __name__ == '__main__':
    print("Starting MoodTune Flask server...")
    print("API endpoint: http://localhost:5000/generate-summary")
    print("Health check: http://localhost:5000/health")
    app.run(debug=True, port=5000)
