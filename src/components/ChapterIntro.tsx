import React from 'react';
import { Chapter } from '../data/chapters';

interface ChapterIntroProps {
  chapter: Chapter;
  onStart: () => void;
}

export const ChapterIntro: React.FC<ChapterIntroProps> = ({ chapter, onStart }) => {
  return (
    <div className="chapter-intro">
      <div className="chapter-intro-header">
        <h2 className="chapter-intro-title">{chapter.title}</h2>
      </div>

      <div className="chapter-intro-content">
        <p className="chapter-intro-description">{chapter.description}</p>

        <div className="chapter-intro-narrative">{chapter.introductoryText}</div>

        <div className="chapter-intro-commands">
          <h3>Available Spells:</h3>
          <ul>
            {chapter.allowedCommands.map(command => (
              <li key={command}>
                <code>{command}()</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chapter-intro-footer">
        <button className="start-chapter-button" onClick={onStart}>
          Begin Spell Casting
        </button>
      </div>
    </div>
  );
};
