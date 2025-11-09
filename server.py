from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 模拟 OpenAI API 调用的占位函数
def simulate_openai_api(emotion_data):
    """
    模拟 OpenAI API 调用，基于情感数据生成心情摘要和推荐
    
    Args:
        emotion_data: 包含歌曲情感数据的列表
    
    Returns:
        dict: 包含 mood_summary 和 suggested_genres 的字典
    """
    # 计算平均情感分数
    total_songs = len(emotion_data)
    if total_songs == 0:
        return {
            "mood_summary": "暂无音乐数据，无法生成心情摘要。",
            "suggested_genres": ["流行音乐", "轻音乐", "民谣"]
        }
    
    avg_emotions = {
        "joyful": sum(song.get("emotions", {}).get("joyful", 0) for song in emotion_data) / total_songs,
        "melancholic": sum(song.get("emotions", {}).get("melancholic", 0) for song in emotion_data) / total_songs,
        "energetic": sum(song.get("emotions", {}).get("energetic", 0) for song in emotion_data) / total_songs,
        "calm": sum(song.get("emotions", {}).get("calm", 0) for song in emotion_data) / total_songs
    }
    
    # 确定主导情感
    dominant_emotion = max(avg_emotions.items(), key=lambda x: x[1])
    emotion_name = dominant_emotion[0]
    emotion_score = dominant_emotion[1]
    
    # 生成心情摘要
    mood_summaries = {
        "joyful": [
            f"根据你的音乐收听习惯分析，你最近倾向于选择快乐和积极的音乐。你的快乐情感得分达到 {emotion_score:.1%}，这表明你的心情非常乐观！继续保持这种正能量，你的音乐选择反映了你内心的阳光和活力。",
            f"你的音乐偏好显示出强烈的快乐倾向（{emotion_score:.1%}）。你被那些充满活力和愉悦感的旋律所吸引，这种音乐选择能够有效提升心情，带来积极的情绪体验。",
            f"分析显示，你的音乐库中快乐类型的歌曲占据了主导地位（{emotion_score:.1%}）。这种音乐偏好表明你正在享受生活中的美好时刻，通过音乐传递正能量。"
        ],
        "melancholic": [
            f"你的音乐收听数据揭示了一种深沉的情感状态。忧郁情感得分达到 {emotion_score:.1%}，你倾向于选择那些富有情感深度和内涵的歌曲。这种音乐偏好可能反映了你对内省和思考的追求，音乐成为了你情感表达的出口。",
            f"根据分析，你的音乐选择展现出明显的忧郁倾向（{emotion_score:.1%}）。你被那些能够触动心灵、引发共鸣的旋律所吸引。这种音乐偏好可以帮助你处理情感，促进自我反思和成长。",
            f"你的音乐偏好显示了一种温和而深沉的忧郁倾向（{emotion_score:.1%}）。你欣赏那些充满情感层次的歌曲，这种选择反映了你对音乐艺术性的追求和对情感深度的理解。"
        ],
        "energetic": [
            f"你的音乐收听习惯显示出强烈的活力和动感！活力情感得分高达 {emotion_score:.1%}，你倾向于选择节奏强烈、充满能量的歌曲。这种音乐偏好表明你正处于一个充满活力和动力的状态，音乐成为了你释放能量的途径。",
            f"分析发现，你的音乐选择充满了活力和激情（{emotion_score:.1%}）。你被那些能够激发动力、提升能量的歌曲所吸引。这种音乐偏好可以帮助你保持积极向上的心态，增强行动力。",
            f"你的音乐偏好显示出明显的活力倾向（{emotion_score:.1%}）。你享受那些节奏明快、充满动感的旋律，这种选择反映了你对生活的热情和积极态度。"
        ],
        "calm": [
            f"你的音乐收听数据揭示了一种寻求平静和平衡的状态。平静情感得分达到 {emotion_score:.1%}，你倾向于选择那些能够带来内心安宁和放松的歌曲。这种音乐偏好表明你正在通过音乐来调节心情，寻求心灵的平静。",
            f"根据分析，你的音乐选择展现出明显的平静倾向（{emotion_score:.1%}）。你被那些柔和、舒缓的旋律所吸引，这种音乐偏好可以帮助你放松身心，缓解压力，促进内心的平衡。",
            f"你的音乐偏好显示了一种平和宁静的状态（{emotion_score:.1%}）。你欣赏那些能够带来内心平静和安宁的歌曲，这种选择反映了你对生活质量的追求和对内心世界的关注。"
        ]
    }
    
    # 随机选择一个摘要
    mood_summary = random.choice(mood_summaries.get(emotion_name, mood_summaries["calm"]))
    
    # 生成流派推荐
    genre_suggestions = generate_genre_suggestions(avg_emotions)
    
    return {
        "mood_summary": mood_summary,
        "suggested_genres": genre_suggestions
    }

def generate_genre_suggestions(avg_emotions):
    """基于情感分数生成流派推荐"""
    suggestions = []
    
    # 基于情感分数推荐流派
    if avg_emotions["joyful"] > 0.6:
        suggestions.extend(["流行音乐", "电子舞曲", "放克音乐"])
    elif avg_emotions["joyful"] > 0.4:
        suggestions.extend(["流行音乐", "轻音乐"])
    
    if avg_emotions["melancholic"] > 0.6:
        suggestions.extend(["爵士乐", "民谣", "蓝调"])
    elif avg_emotions["melancholic"] > 0.4:
        suggestions.extend(["民谣", "轻音乐"])
    
    if avg_emotions["energetic"] > 0.6:
        suggestions.extend(["摇滚乐", "Hip-Hop", "电子音乐"])
    elif avg_emotions["energetic"] > 0.4:
        suggestions.extend(["摇滚乐", "流行音乐"])
    
    if avg_emotions["calm"] > 0.6:
        suggestions.extend(["轻音乐", "新世纪音乐", "环境音乐"])
    elif avg_emotions["calm"] > 0.4:
        suggestions.extend(["轻音乐", "爵士乐"])
    
    # 如果没有明显的偏好，提供通用推荐
    if not suggestions:
        suggestions = ["流行音乐", "轻音乐", "民谣"]
    
    # 去重并限制数量
    unique_suggestions = list(dict.fromkeys(suggestions))
    return unique_suggestions[:4]

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    """
    生成心情摘要的 API 端点
    
    期望的请求体:
    {
        "songs": [
            {
                "title": "歌曲名",
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
    
    返回:
    {
        "mood_summary": "心情摘要文本",
        "suggested_genres": ["流派1", "流派2", ...]
    }
    """
    try:
        data = request.get_json()
        
        # 验证请求数据
        if not data or 'songs' not in data:
            return jsonify({
                "error": "请求数据格式错误，需要包含 'songs' 字段"
            }), 400
        
        songs = data['songs']
        if not isinstance(songs, list) or len(songs) == 0:
            return jsonify({
                "error": "songs 必须是非空数组"
            }), 400
        
        # 调用模拟的 OpenAI API
        result = simulate_openai_api(songs)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": f"服务器错误: {str(e)}"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({"status": "ok", "message": "MoodTune API 运行正常"}), 200

if __name__ == '__main__':
    print("启动 MoodTune Flask 服务器...")
    print("API 端点: http://localhost:5000/generate-summary")
    print("健康检查: http://localhost:5000/health")
    app.run(debug=True, port=5000)

