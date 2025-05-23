import { useState, useEffect } from 'react';
import './App.css';
import { EditorPane } from './components/EditorPane';
import { DungeonView } from './components/DungeonView';
import { RunControls } from './components/RunControls';
import { HintBox } from './components/HintBox';
import { Authentication } from './components/Authentication';
import { ChapterSelector } from './components/ChapterSelector';
import { ChapterIntro } from './components/ChapterIntro';
import { ChapterSuccess } from './components/ChapterSuccess';
import { useWalletAuth } from './hooks/useWalletAuth';
import { useProgress } from './hooks/useProgress';
import { useHintTimer } from './hooks/useHintTimer';
import { TorchState } from './types';

// 自動保存のスロットリング時間（ミリ秒）
const AUTOSAVE_DEBOUNCE_MS = 1000;

type AnimationState = 'success' | 'failure' | 'wall-collision' | null;

enum AppScreen {
  CHAPTER_SELECT,
  CHAPTER_INTRO,
  CODING,
  SUCCESS,
}

function App(): React.ReactElement {
  // Authentication state
  const { address } = useWalletAuth();

  // Chapter and progress management
  const {
    currentChapter,
    completeChapter,
    navigateToChapter,
    getSavedCode,
    progress,
    saveCodeProgress,
  } = useProgress(address || undefined);

  // UI state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.CHAPTER_SELECT);
  const [code, setCode] = useState<string>('// Write your spell here\nmoveRight();');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [animationState, setAnimationState] = useState<AnimationState>(null);
  const [currentValidationResult, setCurrentValidationResult] = useState<
    { allRequirementsMet: boolean; missingCommands: string[] } | undefined
  >(undefined);

  // 自動保存タイマー用のID
  const [saveTimeoutId, setSaveTimeoutId] = useState<number | null>(null);

  // Player position state
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });

  // Torch states
  const [torches, setTorches] = useState<TorchState[]>([]);

  // Hint system
  const { currentHint, nextHint, dismissHint, resetTimer } = useHintTimer(
    currentChapter?.hints || [],
    15000
  );

  // Load initial code when changing chapters
  useEffect((): void => {
    if (currentChapter) {
      // See if there's saved code for this chapter
      const savedCode = getSavedCode(currentChapter.id);

      // Use saved code or a starter template
      setCode(
        savedCode ||
          `// ${currentChapter.title}
// Write your spell here
${currentChapter.allowedCommands[0]}();`
      );

      // Reset player position
      if (currentChapter.startPosition) {
        setPlayerPos(currentChapter.startPosition);
      }

      // Reset animation state
      setAnimationState(null);

      // Reset torches
      setTorches([]);

      // Reset hints
      setShowHints(false);
    }
  }, [currentChapter, getSavedCode]);

  // Handle torch updates
  const handleTorchUpdate = (updatedTorches: TorchState[]): void => {
    setTorches(updatedTorches);
  };

  // コードの変更を処理し、自動保存する関数
  const handleCodeChange = (newCode: string): void => {
    setCode(newCode);

    // 既存のタイマーをクリアする
    if (saveTimeoutId !== null) {
      window.clearTimeout(saveTimeoutId);
    }

    // スロットリングした自動保存のタイマーをセット
    const timeoutId = window.setTimeout(() => {
      if (currentChapter) {
        saveCodeProgress(currentChapter.id, newCode);
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    setSaveTimeoutId(timeoutId);
  };

  // ページ離脱時の保存
  useEffect(() => {
    const handleBeforeUnload = (): void => {
      // 未保存のコードを即座に保存
      if (currentChapter) {
        saveCodeProgress(currentChapter.id, code);
      }
    };

    // 画面遷移前のイベントをリッスン
    window.addEventListener('beforeunload', handleBeforeUnload);

    return (): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentChapter, code, saveCodeProgress]);

  // 画面遷移時にも保存する
  useEffect(() => {
    return (): void => {
      if (currentChapter) {
        saveCodeProgress(currentChapter.id, code);
      }
    };
  }, [currentScreen, currentChapter, code, saveCodeProgress]);

  // Determine completed chapters for the selector
  const completedChapterIds = Object.entries(progress.chapters)
    .filter(([_, data]) => data.completed)
    .map(([id]) => id);

  // Handle successful chapter completion
  const handleChapterSuccess = (
    code: string,
    validationResult?: { allRequirementsMet: boolean; missingCommands: string[] },
    achievementData?: { noHints: boolean; attemptsCount: number }
  ): void => {
    completeChapter(currentChapter.id, code, achievementData);
    setCurrentValidationResult(validationResult);
    setCurrentScreen(AppScreen.SUCCESS);
  };

  // Handle continuing after success screen
  const handleContinue = (): void => {
    // Reset animation state
    setAnimationState(null);
    setCurrentValidationResult(undefined);

    if (currentChapter.nextChapterId) {
      navigateToChapter(currentChapter.nextChapterId);
      setCurrentScreen(AppScreen.CHAPTER_INTRO);
    } else {
      setCurrentScreen(AppScreen.CHAPTER_SELECT);
    }
  };

  // Show hint system
  const handleShowHint = (): void => {
    setShowHints(true);
    nextHint();
  };

  // Handle login with wallet
  const handleLogin = (_walletAddress: string): void => {
    // This will trigger useProgress to load the user's saved progress
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wizarding Code School</h1>
        <Authentication onLogin={handleLogin} />
      </header>

      <main className="app-content">
        {currentScreen === AppScreen.CHAPTER_SELECT && (
          <div className="chapter-select-screen">
            <ChapterSelector
              currentChapterId={currentChapter.id}
              completedChapters={completedChapterIds}
              progress={progress}
              onSelectChapter={(id: string): void => {
                // チャプター切り替え前に現在のコードを保存
                if (currentChapter) {
                  saveCodeProgress(currentChapter.id, code);
                }
                navigateToChapter(id);
                setCurrentScreen(AppScreen.CHAPTER_INTRO);
              }}
            />
          </div>
        )}

        {currentScreen === AppScreen.CHAPTER_INTRO && (
          <ChapterIntro
            chapter={currentChapter}
            onStart={(): void => setCurrentScreen(AppScreen.CODING)}
          />
        )}

        {currentScreen === AppScreen.CODING && (
          <div className="coding-screen">
            <div className="coding-layout">
              <div className="dungeon-area">
                <h2>{currentChapter.title}</h2>
                <DungeonView
                  maze={currentChapter.maze}
                  pos={playerPos}
                  onPosChange={setPlayerPos}
                  animationState={animationState}
                  torches={torches}
                  onTorchUpdate={handleTorchUpdate}
                />

                <RunControls
                  code={code}
                  maze={currentChapter.maze}
                  position={playerPos}
                  onPositionChange={setPlayerPos}
                  onSuccess={handleChapterSuccess}
                  onShowHint={handleShowHint}
                  onAnimationState={setAnimationState}
                  torches={torches}
                  onTorchUpdate={handleTorchUpdate}
                />

                <button
                  className="back-button"
                  onClick={(): void => {
                    // チャプター選択に戻る前に現在のコードを保存
                    saveCodeProgress(currentChapter.id, code);
                    setCurrentScreen(AppScreen.CHAPTER_SELECT);
                  }}
                >
                  Back to Chapter Select
                </button>
              </div>

              <div className="editor-area">
                <EditorPane
                  code={code}
                  onChange={handleCodeChange}
                  onActivity={resetTimer}
                  allowedCommands={currentChapter.allowedCommands}
                />
              </div>
            </div>

            {/* Hint System */}
            {showHints && (
              <HintBox
                hint={currentHint}
                onDismiss={(): void => {
                  dismissHint();
                  setShowHints(false);
                }}
                onNext={nextHint}
              />
            )}
          </div>
        )}

        {currentScreen === AppScreen.SUCCESS && (
          <ChapterSuccess
            chapter={currentChapter}
            onContinue={handleContinue}
            validationResult={currentValidationResult}
            achievementData={progress.chapters[currentChapter.id]?.achievements}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Wizarding Code School</p>
      </footer>
    </div>
  );
}

export default App;
