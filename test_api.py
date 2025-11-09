#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
简单的 API 测试脚本
"""
import requests
import json

def test_generate_summary():
    """测试生成摘要 API"""
    url = "http://localhost:5000/generate-summary"
    
    # 测试数据
    test_data = {
        "songs": [
            {
                "title": "测试歌曲1",
                "emotions": {
                    "joyful": 0.8,
                    "melancholic": 0.1,
                    "energetic": 0.3,
                    "calm": 0.9
                }
            },
            {
                "title": "测试歌曲2",
                "emotions": {
                    "joyful": 0.2,
                    "melancholic": 0.9,
                    "energetic": 0.1,
                    "calm": 0.7
                }
            }
        ]
    }
    
    try:
        response = requests.post(url, json=test_data)
        response.raise_for_status()
        
        result = response.json()
        print("[SUCCESS] API 测试成功！")
        print("\n心情摘要:")
        print(result.get("mood_summary", "无摘要"))
        print("\n推荐流派:")
        print(", ".join(result.get("suggested_genres", [])))
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] API 测试失败: {e}")
        return False

def test_health_check():
    """测试健康检查端点"""
    url = "http://localhost:5000/health"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        result = response.json()
        print("[SUCCESS] 健康检查成功！")
        print(f"状态: {result.get('status')}")
        print(f"消息: {result.get('message')}")
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] 健康检查失败: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("MoodTune API 测试")
    print("=" * 50)
    
    print("\n1. 测试健康检查端点...")
    test_health_check()
    
    print("\n2. 测试生成摘要端点...")
    test_generate_summary()
    
    print("\n" + "=" * 50)

