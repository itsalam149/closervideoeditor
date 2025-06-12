"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Play, Pause, Square, Type, Move, Palette, Settings, Download, Maximize2, Plus, Trash2, MousePointer, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import InputPanel from "./InputPanel";
import VideoPanel from "./VideoPanel";
import PropertiesPanel from "./PropertiesPanel";

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [draggedElement, setDraggedElement] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const subtitleInputRef = useRef(null);

  // Sample subtitle data structure
  const [sampleSubtitles] = useState([
    {
      id: 1,
      start: 2,
      end: 5,
      text: "Welcome to our video editor",
      x: 50,
      y: 80,
      fontSize: 24,
      color: "#FFFFFF",
      fontFamily: "Arial",
      backgroundColor: "rgba(0,0,0,0.7)",
      visible: true,
    },
    {
      id: 2,
      start: 6,
      end: 9,
      text: "Create amazing videos with ease",
      x: 50,
      y: 75,
      fontSize: 20,
      color: "#00D4FF",
      fontFamily: "Arial",
      backgroundColor: "rgba(0,0,0,0.5)",
      visible: true,
    },
  ]);

  useEffect(() => {
    setSubtitles(sampleSubtitles);
  }, []);

  // Parse ASS subtitle file
  const parseAssFile = (content) => {
    const lines = content.split("\n");
    const dialogues = [];
    let id = 1;

    lines.forEach((line) => {
      if (line.startsWith("Dialogue:")) {
        const parts = line.split(",");
        if (parts.length >= 10) {
          const start = parseTime(parts[1]);
          const end = parseTime(parts[2]);
          const text = parts.slice(9).join(",").replace(/\\N/g, "\n");

          dialogues.push({
            id: id++,
            start,
            end,
            text,
            x: 50,
            y: 80,
            fontSize: 24,
            color: "#FFFFFF",
            fontFamily: "Arial",
            backgroundColor: "rgba(0,0,0,0.7)",
            visible: true,
          });
        }
      }
    });
    return dialogues;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":");
    return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  const handleSubtitleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedSubtitles = parseAssFile(content);
        setSubtitles(parsedSubtitles);
      };
      reader.readAsText(file);
      setSubtitleFile(file);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const getCurrentSubtitles = () => {
    return subtitles.filter(
      (sub) => sub.visible && currentTime >= sub.start && currentTime <= sub.end
    );
  };

  const addNewSubtitle = () => {
    const newSubtitle = {
      id: Date.now(),
      start: currentTime,
      end: currentTime + 3,
      text: "New subtitle",
      x: 50,
      y: 80,
      fontSize: 24,
      color: "#FFFFFF",
      fontFamily: "Arial",
      backgroundColor: "rgba(0,0,0,0.7)",
      visible: true,
    };
    setSubtitles([...subtitles, newSubtitle]);
    setSelectedSubtitle(newSubtitle);
  };

  const updateSubtitle = (id, updates) => {
    setSubtitles(
      subtitles.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
    if (selectedSubtitle && selectedSubtitle.id === id) {
      setSelectedSubtitle({ ...selectedSubtitle, ...updates });
    }
  };

  const deleteSubtitle = (id) => {
    setSubtitles(subtitles.filter((sub) => sub.id !== id));
    if (selectedSubtitle && selectedSubtitle.id === id) {
      setSelectedSubtitle(null);
    }
  };

  const moveSubtitle = (direction, step = 1) => {
    if (!selectedSubtitle) return;

    const updates = {};
    switch (direction) {
      case "up":
        updates.y = Math.max(0, selectedSubtitle.y - step);
        break;
      case "down":
        updates.y = Math.min(100, selectedSubtitle.y + step);
        break;
      case "left":
        updates.x = Math.max(0, selectedSubtitle.x - step);
        break;
      case "right":
        updates.x = Math.min(100, selectedSubtitle.x + step);
        break;
    }
    updateSubtitle(selectedSubtitle.id, updates);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedSubtitle) return;

      const step = e.shiftKey ? 5 : 1;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moveSubtitle("up", step);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveSubtitle("down", step);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveSubtitle("left", step);
          break;
        case "ArrowRight":
          e.preventDefault();
          moveSubtitle("right", step);
          break;
        case "Delete":
          deleteSubtitle(selectedSubtitle.id);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSubtitle]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              VideoForge Pro
            </h1>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <InputPanel
            videoFile={videoFile}
            subtitleFile={subtitleFile}
            fileInputRef={fileInputRef}
            subtitleInputRef={subtitleInputRef}
            handleVideoUpload={handleVideoUpload}
            handleSubtitleUpload={handleSubtitleUpload}
            addNewSubtitle={addNewSubtitle}
            subtitles={subtitles}
            selectedSubtitle={selectedSubtitle}
            setSelectedSubtitle={setSelectedSubtitle}
            updateSubtitle={updateSubtitle}
            deleteSubtitle={deleteSubtitle}
            formatTime={formatTime}
          />

          <VideoPanel
            videoFile={videoFile}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            videoRef={videoRef}
            handleTimeUpdate={handleTimeUpdate}
            handleLoadedMetadata={handleLoadedMetadata}
            getCurrentSubtitles={getCurrentSubtitles}
            selectedSubtitle={selectedSubtitle}
            setSelectedSubtitle={setSelectedSubtitle}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            handleSeek={handleSeek}
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            moveSubtitle={moveSubtitle}
          />

          <PropertiesPanel
            selectedSubtitle={selectedSubtitle}
            updateSubtitle={updateSubtitle}
            deleteSubtitle={deleteSubtitle}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;