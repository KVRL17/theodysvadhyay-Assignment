import React, { useState } from 'react';
import { ChevronLeft, MessageSquare, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Angerr from './Anger.png';
import Sadd from './Sad.png';
import Neutrall from './Neutral.png';
import Happyy from './Happy.png';
import Awee from './Awe.png';
import Contentt from './Content.png';

interface EmotionCheckIn {
  emotion: string;
  intensity: number;
  tags: string[];
  notes: string;
  timestamp: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const EMOTIONS = {
  angry: {
    name: 'Angry',
    color: 'bg-red-500',
    emoji: Angerr,
    description: 'Anger is a complex emotion',
    subtitle: 'Identifying your emotions is the first step to releasing them',
    tags: ['Irritated', 'Annoyed', 'Frustrated', 'Fed Up', 'Grumpy', 'Touchy']
  },
  happy: {
    name: 'Happy',
    color: 'bg-yellow-500',
    emoji: Happyy,
    description: 'Happiness brings light to your day',
    subtitle: 'Embracing joy helps spread positivity to others',
    tags: ['Excited', 'Content', 'Cheerful', 'Elated', 'Optimistic', 'Grateful']
  },
  sad: {
    name: 'Sad',
    color: 'bg-blue-500',
    emoji: Sadd,
    description: 'Sadness is a natural response',
    subtitle: 'Acknowledging sadness is part of emotional healing',
    tags: ['Disappointed', 'Melancholy', 'Grief', 'Lonely', 'Dejected', 'Heartbroken']
  },
  anxious: {
    name: 'Awe',
    color: 'bg-purple-500',
    emoji: Awee,
    description: 'Anxiety signals our concerns',
    subtitle: 'Understanding anxiety helps us find calm',
    tags: ['Worried', 'Nervous', 'Stressed', 'Overwhelmed', 'Restless', 'Tense']
  },
  excited: {
    name: 'Excitement',
    color: 'bg-orange-500',
    emoji: Contentt,
    description: 'Excitement energizes us',
    subtitle: 'Channel this energy into positive action',
    tags: ['Thrilled', 'Eager', 'Enthusiastic', 'Energetic', 'Motivated', 'Inspired']
  },
  calm: {
    name: 'Neutral',
    color: 'bg-green-500',
    emoji: Neutrall,
    description: 'Calmness brings peace',
    subtitle: 'Inner peace radiates outward to others',
    tags: ['Peaceful', 'Relaxed', 'Serene', 'Balanced', 'Centered', 'Tranquil']
  }
};

const MoodCheckIn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'success' | 'error'>('selection');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(50);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleEmotionSelect = (emotionKey: string) => {
    setSelectedEmotion(emotionKey);
    setSelectedTags([]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleContinue = () => {
    if (selectedEmotion) {
      setCurrentStep('details');
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setNotes(value);
    }
  };

  const submitCheckIn = async () => {
    if (!selectedEmotion) return;

    setIsSubmitting(true);
    
    const checkInData: EmotionCheckIn = {
      emotion: EMOTIONS[selectedEmotion as keyof typeof EMOTIONS].name,
      intensity,
      tags: selectedTags,
      notes,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData),
      });

      if (response.ok) {
        setResponseMessage('Check-in submitted successfully!');
        setCurrentStep('success');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setResponseMessage('Failed to submit. Please try again.');
      setCurrentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('selection');
    setSelectedEmotion('');
    setIntensity(50);
    setSelectedTags([]);
    setNotes('');
    setResponseMessage('');
  };

  const currentEmotion = selectedEmotion ? EMOTIONS[selectedEmotion as keyof typeof EMOTIONS] : null;

  if (currentStep === 'success' || currentStep === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="mb-6">
            {currentStep === 'success' ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">
              {currentStep === 'success' ? 'Success!' : 'Oops!'}
            </h2>
            <p className="text-gray-600">{responseMessage}</p>
          </div>
          <button
            onClick={resetForm}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Start New Check-in
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setCurrentStep('selection')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <button 
              onClick={() => setCurrentStep('selection')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              What is making you feel this way?
            </h2>
          </div>

          <div className="mb-6">
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="I feel this way because..."
              className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {notes.length}/500 characters
              </span>
              {notes.length > 450 && (
                <span className="text-sm text-orange-500">
                  {500 - notes.length} remaining
                </span>
              )}
            </div>
          </div>

          {(selectedTags.length > 0 || currentEmotion) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {currentEmotion && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentEmotion.name}
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={submitCheckIn}
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>

        {!selectedEmotion ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                How are you feeling today?
              </h2>
              <p className="text-gray-600">
                Select the emotion that best describes your current state
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(EMOTIONS).map(([key, emotion]) => (
                <button
                  key={key}
                  onClick={() => handleEmotionSelect(key)}
                  className="p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="flex justify-center items-center">
                    <img src={emotion.emoji} alt="Emoji" className="w-16 h-16" />
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{emotion.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentEmotion?.description}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentEmotion?.subtitle}
              </p>
              <div className="flex justify-center items-center">
                <img src={currentEmotion?.emoji} alt="Emoji" className="w-24 h-24" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Slightly {currentEmotion?.name}</span>
                <span>Very {currentEmotion?.name}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="mb-8">
              <p className="text-gray-700 font-medium mb-3">
                What stage is your {currentEmotion?.name.toLowerCase()} in?
              </p>
              <div className="flex flex-wrap gap-2">
                {currentEmotion?.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedEmotion('')}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Add Emotion
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckIn;