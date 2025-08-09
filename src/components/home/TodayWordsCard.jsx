import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function TodayWordsCard({ words }) {
  return (
    <Card className="today-words-card">
      <CardHeader>
        <CardTitle className="today-words-title">
          <span>📚</span>
          <span>오늘의 단어</span>
          <Badge variant="outline">{words.length}개</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {words.map((word, index) => (
          <div key={index} className="today-word-item">
            <div className="today-word-header">
              <h4>{word.word}</h4>
              <span>#{index + 1}</span>
            </div>
            <p className="today-word-meaning">{word.meaning}</p>
            <p className="today-word-example">{word.example}</p>
          </div>
        ))}
        <Button variant="outline" className="today-word-more-button">
          더 많은 단어 학습하기
        </Button>
      </CardContent>
    </Card>
  );
}