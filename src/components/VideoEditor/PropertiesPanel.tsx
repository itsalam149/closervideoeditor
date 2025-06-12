import React from 'react';
import { Settings, Type, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedSubtitle: {
    id: number;
    text: string;
    start: number;
    end: number;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    backgroundColor: string;
  } | null;
  updateSubtitle: (id: number, updates: any) => void;
  deleteSubtitle: (id: number) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedSubtitle,
  updateSubtitle,
  deleteSubtitle,
}) => {
  return (
    <div className="xl:col-span-3">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Settings className="mr-2" size={20} />
          Properties
        </h2>

        {selectedSubtitle ? (
          <div className="space-y-6">
            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Content
              </label>
              <textarea
                value={selectedSubtitle.text}
                onChange={(e) =>
                  updateSubtitle(selectedSubtitle.id, {
                    text: e.target.value,
                  })
                }
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
                rows={3}
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedSubtitle.start}
                  onChange={(e) =>
                    updateSubtitle(selectedSubtitle.id, {
                      start: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedSubtitle.end}
                  onChange={(e) =>
                    updateSubtitle(selectedSubtitle.id, {
                      end: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  X Position (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedSubtitle.x}
                  onChange={(e) =>
                    updateSubtitle(selectedSubtitle.id, {
                      x: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Y Position (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedSubtitle.y}
                  onChange={(e) =>
                    updateSubtitle(selectedSubtitle.id, {
                      y: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Font Family
              </label>
              <select
                value={selectedSubtitle.fontFamily}
                onChange={(e) =>
                  updateSubtitle(selectedSubtitle.id, {
                    fontFamily: e.target.value,
                  })
                }
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors duration-200"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Font Size: {selectedSubtitle.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={selectedSubtitle.fontSize}
                onChange={(e) =>
                  updateSubtitle(selectedSubtitle.id, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={selectedSubtitle.color}
                onChange={(e) =>
                  updateSubtitle(selectedSubtitle.id, {
                    color: e.target.value,
                  })
                }
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={selectedSubtitle.backgroundColor
                  .replace("rgba(", "#")
                  .replace(/,.*/, "")}
                onChange={(e) =>
                  updateSubtitle(selectedSubtitle.id, {
                    backgroundColor: `${e.target.value}CC`,
                  })
                }
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => deleteSubtitle(selectedSubtitle.id)}
                className="w-full p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete Subtitle</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <Type size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a subtitle to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;