import React, { useRef, useEffect } from "react";
import {
  Upload,
  Maximize2,
  Pause,
  Play,
  Square,
  MousePointer,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface VideoPanelProps {
  videoFile: string | null;
  subtitleFile: File | null;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  getCurrentSubtitles: () => Array<any>;
  selectedSubtitle: any;
  setSelectedSubtitle: (subtitle: any) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  togglePlayPause: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  moveSubtitle: (direction: string, step?: number) => void;
}

const VideoPanel: React.FC<VideoPanelProps> = ({
  videoFile,
  subtitleFile,
  showPreview,
  setShowPreview,
  videoRef,
  handleTimeUpdate,
  handleLoadedMetadata,
  getCurrentSubtitles,
  selectedSubtitle,
  setSelectedSubtitle,
  isPlaying,
  setIsPlaying,
  setCurrentTime,
  togglePlayPause,
  handleSeek,
  currentTime,
  duration,
  formatTime,
  moveSubtitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !subtitleFile) return;

    const setup = async () => {
      const { initLibass, loadSubtitles, renderFrame } = await import(
        "../../utils/libassRenderer"
      );

      const assRenderer = await initLibass(canvasRef.current);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        await loadSubtitles(content);
      };
      reader.readAsText(subtitleFile);

      const renderLoop = () => {
        if (videoRef.current && !videoRef.current.paused) {
          renderFrame(videoRef.current.currentTime);
          requestAnimationFrame(renderLoop);
        }
      };

      videoRef.current.addEventListener("play", renderLoop);

      return () => {
        videoRef.current?.removeEventListener("play", renderLoop);
      };
    };

    setup();
  }, [subtitleFile]);

  return (
    <div className="xl:col-span-6">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Maximize2 className="mr-2" size={20} />
            Video Preview
          </h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {/* Video + Canvas Overlay */}
        <div
          className="relative w-full h-full mb-4"
          style={{ aspectRatio: "16/9" }}
        >
          {videoFile ? (
            <>
              <video
                ref={videoRef}
                src={videoFile}
                className="absolute top-0 left-0 w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                controls
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-black">
              <div className="text-center">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>Upload a video to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={togglePlayPause}
              disabled={!videoFile}
              className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                  setIsPlaying(false);
                  setCurrentTime(0);
                }
              }}
              disabled={!videoFile}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 disabled:opacity-50"
            >
              <Square size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              className="h-2 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-100"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Quick Controls */}
        {selectedSubtitle && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Quick Position Controls
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button
                onClick={() => moveSubtitle("up")}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowUp size={16} />
              </button>
              <div></div>
              <button
                onClick={() => moveSubtitle("left")}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center justify-center">
                <MousePointer size={16} className="text-gray-400" />
              </div>
              <button
                onClick={() => moveSubtitle("right")}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowRight size={16} />
              </button>
              <div></div>
              <button
                onClick={() => moveSubtitle("down")}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowDown size={16} />
              </button>
              <div></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Use arrow keys for precise control (Shift for larger steps)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPanel;
