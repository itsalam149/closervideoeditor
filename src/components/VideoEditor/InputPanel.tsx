import React from 'react';
import { Upload, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';

interface InputPanelProps {
  videoFile: string | null;
  subtitleFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  subtitleInputRef: React.RefObject<HTMLInputElement>;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubtitleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addNewSubtitle: () => void;
  subtitles: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    visible: boolean;
  }>;
  selectedSubtitle: any;
  setSelectedSubtitle: (subtitle: any) => void;
  updateSubtitle: (id: number, updates: any) => void;
  deleteSubtitle: (id: number) => void;
  formatTime: (time: number) => string;
}

const InputPanel: React.FC<InputPanelProps> = ({
  videoFile,
  subtitleFile,
  fileInputRef,
  subtitleInputRef,
  handleVideoUpload,
  handleSubtitleUpload,
  addNewSubtitle,
  subtitles,
  selectedSubtitle,
  setSelectedSubtitle,
  updateSubtitle,
  deleteSubtitle,
  formatTime,
}) => {
  return (
    <div className="xl:col-span-3">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Upload className="mr-2" size={20} />
          Media Input
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File (MP4)
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-cyan-500/50 rounded-xl hover:border-cyan-400 transition-colors duration-300 text-cyan-400 hover:bg-cyan-500/10"
            >
              {videoFile ? "Video Uploaded ✓" : "Click to upload video"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle File (ASS)
            </label>
            <input
              type="file"
              accept=".ass"
              onChange={handleSubtitleUpload}
              ref={subtitleInputRef}
              className="hidden"
            />
            <button
              onClick={() => subtitleInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-purple-500/50 rounded-xl hover:border-purple-400 transition-colors duration-300 text-purple-400 hover:bg-purple-500/10"
            >
              {subtitleFile ? "Subtitles Uploaded ✓" : "Click to upload subtitles"}
            </button>
          </div>

          <button
            onClick={addNewSubtitle}
            className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Subtitle</span>
          </button>
        </div>

        {/* Subtitle Timeline */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Timeline</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {subtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                onClick={() => setSelectedSubtitle(subtitle)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSubtitle?.id === subtitle.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">
                    {formatTime(subtitle.start)} - {formatTime(subtitle.end)}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSubtitle(subtitle.id, {
                          visible: !subtitle.visible,
                        });
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      {subtitle.visible ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSubtitle(subtitle.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-white truncate">{subtitle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;