// 颜色配置
const colors = {
    blue: '#4a90e2',
    orange: '#ff6b6b',
    green: '#51cf66',
    purple: '#9775fa',
    bg: '#0f0f1e',
    card: '#16213e'
};

// 全局变量
let musicData = [];
let timelineChart = null;
let emotionRadarChart = null;

// 加载数据
async function loadData() {
    try {
        const response = await fetch('emotions.json');
        const data = await response.json();
        musicData = data.songs;
        initializeDashboard();
    } catch (error) {
        console.error('加载数据失败:', error);
        document.getElementById('moodSummary').textContent = '数据加载失败，请检查 emotions.json 文件。';
    }
}

// 初始化仪表板
function initializeDashboard() {
    createTimelineChart();
    createEmotionRadarChart();
    generateAIRecommendations();
}

// 创建时间线图表
function createTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // 按日期分组数据
    const dailyData = groupByDate(musicData);
    const dates = Object.keys(dailyData).sort();
    const listeningTimes = dates.map(date => {
        const songs = dailyData[date];
        return songs.reduce((total, song) => total + song.duration, 0) / 60; // 转换为分钟
    });

    // 格式化日期显示
    const formattedDates = dates.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    timelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: formattedDates,
            datasets: [{
                label: '收听时间（分钟）',
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
                            return `收听时间: ${context.parsed.y.toFixed(1)} 分钟`;
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
                            return value + ' 分钟';
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

// 创建情感雷达图
function createEmotionRadarChart() {
    const ctx = document.getElementById('emotionRadarChart').getContext('2d');
    
    // 计算平均情感值
    const emotionScores = calculateAverageEmotions(musicData);
    
    emotionRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['快乐', '忧郁', '活力', '平静'],
            datasets: [{
                label: '情感分布',
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

// 生成AI推荐
function generateAIRecommendations() {
    const emotionScores = calculateAverageEmotions(musicData);
    const moodSummary = generateMoodSummary(emotionScores);
    const recommendedGenres = generateGenreRecommendations(emotionScores);
    
    // 更新心情摘要
    document.getElementById('moodSummary').textContent = moodSummary;
    
    // 更新推荐流派
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

// 按日期分组数据
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

// 计算平均情感值
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

// 生成心情摘要
function generateMoodSummary(emotionScores) {
    const dominantEmotion = getDominantEmotion(emotionScores);
    const intensity = getIntensity(emotionScores[dominantEmotion]);
    
    const summaries = {
        joyful: {
            high: '今天你的音乐选择充满了快乐和正能量！你倾向于选择 upbeat 和令人愉悦的旋律，这表明你的心情非常积极。继续保持这种好心情！',
            medium: '你的音乐偏好显示了一种轻松愉快的心情。你享受那些能够带来快乐和满足感的歌曲。',
            low: '你的音乐选择中带有一些快乐的元素，但可能还需要更多积极能量的注入。'
        },
        melancholic: {
            high: '你的音乐选择反映出一种深沉、内省的情感状态。你被那些富有情感深度和忧郁美的旋律所吸引。这种情绪是创作和思考的好时机。',
            medium: '你的音乐偏好显示了一种温和的忧郁倾向。你欣赏那些能够触动心灵、引发思考的歌曲。',
            low: '你的音乐选择中偶尔带有一些忧郁的色彩，但整体上保持平衡。'
        },
        energetic: {
            high: '你的音乐选择充满了活力和动感！你倾向于选择节奏强烈、充满能量的歌曲，这表明你处于一个充满活力的状态。',
            medium: '你的音乐偏好显示了一种积极的能量水平。你享受那些能够提升心情、激发动力的歌曲。',
            low: '你的音乐选择相对温和，可以考虑添加一些更有活力的歌曲来提升能量。'
        },
        calm: {
            high: '你的音乐选择非常平静和放松。你倾向于选择那些能够带来内心平静和安宁的旋律，这表明你正在寻求一种平衡和宁静的状态。',
            medium: '你的音乐偏好显示了一种平和的心态。你欣赏那些能够帮助放松和舒缓压力的歌曲。',
            low: '你的音乐选择相对活跃，可以考虑添加一些平静的旋律来平衡心情。'
        }
    };
    
    const emotionLabels = {
        joyful: '快乐',
        melancholic: '忧郁',
        energetic: '活力',
        calm: '平静'
    };
    
    return summaries[dominantEmotion][intensity];
}

// 获取主导情感
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

// 获取强度级别
function getIntensity(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
}

// 生成流派推荐
function generateGenreRecommendations(emotionScores) {
    const recommendations = [];
    
    // 基于情感分数推荐流派
    if (emotionScores.joyful > 0.6) {
        recommendations.push('流行音乐');
        recommendations.push('电子舞曲');
    }
    
    if (emotionScores.melancholic > 0.6) {
        recommendations.push('爵士乐');
        recommendations.push('民谣');
    }
    
    if (emotionScores.energetic > 0.6) {
        recommendations.push('摇滚乐');
        recommendations.push('Hip-Hop');
    }
    
    if (emotionScores.calm > 0.6) {
        recommendations.push('轻音乐');
        recommendations.push('新世纪音乐');
    }
    
    // 如果没有明显的偏好，提供通用推荐
    if (recommendations.length === 0) {
        recommendations.push('流行音乐');
        recommendations.push('轻音乐');
        recommendations.push('民谣');
    }
    
    // 确保至少返回3个推荐，最多4个
    const defaultRecommendations = ['流行音乐', '轻音乐', '民谣', '电子音乐'];
    while (recommendations.length < 3) {
        const randomGenre = defaultRecommendations[Math.floor(Math.random() * defaultRecommendations.length)];
        if (!recommendations.includes(randomGenre)) {
            recommendations.push(randomGenre);
        }
    }
    
    return recommendations.slice(0, 4);
}

// API 配置
const API_BASE_URL = 'http://localhost:5000';

// 生成 AI 心情摘要
async function generateAISummary() {
    const generateBtn = document.getElementById('generateSummaryBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    const aiMoodSummary = document.getElementById('aiMoodSummary');
    const aiGenreList = document.getElementById('aiGenreList');
    
    // 禁用按钮并显示加载状态
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        // 准备请求数据
        const requestData = {
            songs: musicData.map(song => ({
                title: song.title,
                emotions: song.emotions
            }))
        };
        
        // 调用后端 API
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
        
        // 显示 AI 生成的心情摘要
        aiMoodSummary.textContent = data.mood_summary || '无法生成心情摘要。';
        aiMoodSummary.style.display = 'block';
        
        // 显示 AI 生成的流派推荐
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
        
        // 滚动到 AI 摘要区域
        aiMoodSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('生成 AI 摘要失败:', error);
        aiMoodSummary.textContent = `错误: 无法连接到服务器。请确保 Flask 后端正在运行 (${API_BASE_URL})。`;
        aiMoodSummary.style.display = 'block';
        aiMoodSummary.style.color = '#ff6b6b';
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// 初始化事件监听器
function initializeEventListeners() {
    const generateBtn = document.getElementById('generateSummaryBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAISummary);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
});

