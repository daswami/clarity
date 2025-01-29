import React, { useState, useEffect } from "react";
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link';
import StepOneForm from "../components/StepOneForm";
import StepTwoForm from "../components/StepTwoForm";
import StepThreeForm from "../components/StepThreeForm";
import StepFourForm from "../components/StepFourForm";

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
});

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    decision: '',
    decisionRating: 0,
    emotion: '',
    emotionRating: 0,
    today: '',
    todayRating: 0,
    fear: '',
    fearRating: 0,
    future: '',
    futureRating: 0,
    friend: '',
    friendRating: 0,
    assumption: '',
    assumptionRating: 0
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [angles, setAngles] = useState<any>(null);

  const handleStepOneSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      decision: data.decision,
      decisionRating: data.decisionRating,
      emotion: data.emotion,
      emotionRating: data.emotionRating
    }));
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      today: data.today,
      todayRating: data.todayRating,
      fear: data.fear,
      fearRating: data.fearRating
    }));
    setCurrentStep(3);
  };

  const handleStepThreeSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      future: data.future,
      futureRating: data.futureRating,
      friend: data.friend,
      friendRating: data.friendRating
    }));
    setCurrentStep(4);
  };

  const handleStepFourSubmit = async (data: any) => {
    setFormData(prev => ({
      ...prev,
      assumption: data.assumption,
      assumptionRating: data.assumptionRating
    }));
    setIsSubmitted(true);
  };

  const handleToolsClick = () => {
    setShowForm(false);
    setCurrentStep(1);
    setFormData({
      decision: '',
      decisionRating: 0,
      emotion: '',
      emotionRating: 0,
      today: '',
      todayRating: 0,
      fear: '',
      fearRating: 0,
      future: '',
      futureRating: 0,
      friend: '',
      friendRating: 0,
      assumption: '',
      assumptionRating: 0
    });
    setIsSubmitted(false);
    setAngles(null);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (!showForm) {
        setShowForm(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showForm]);

  const renderCurrentStep = () => {
    if (!showForm) return null;

    switch (currentStep) {
      case 1:
        return <StepOneForm onSubmit={handleStepOneSubmit} />;
      case 2:
        return (
          <StepTwoForm 
            onSubmit={handleStepTwoSubmit}
            previousResponses={{
              decision: formData.decision,
              decisionRating: formData.decisionRating,
              emotion: formData.emotion,
              emotionRating: formData.emotionRating
            }}
            editable={!isSubmitted}
          />
        );
      case 3:
        return (
          <StepThreeForm 
            onSubmit={handleStepThreeSubmit}
            previousResponses={{
              decision: formData.decision,
              decisionRating: formData.decisionRating,
              emotion: formData.emotion,
              emotionRating: formData.emotionRating,
              today: formData.today,
              todayRating: formData.todayRating,
              fear: formData.fear,
              fearRating: formData.fearRating
            }}
            
          />
        );
      case 4:
        return (
          <StepFourForm 
            onSubmit={handleStepFourSubmit}
            previousResponses={{
              decision: formData.decision,
              decisionRating: formData.decisionRating,
              emotion: formData.emotion,
              emotionRating: formData.emotionRating,
              today: formData.today,
              todayRating: formData.todayRating,
              fear: formData.fear,
              fearRating: formData.fearRating,
              future: formData.future,
              futureRating: formData.futureRating,
              friend: formData.friend,
              friendRating: formData.friendRating
            }}
           
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Menu Section */}
      <div className={`w-1/6 h-full bg-gradient-to-b from-rose-50 to-amber-50 flex flex-col items-start px-8 py-8 relative ${inter.className} border-r border-amber-100`}>
        <span className="absolute right-4 top-4 bg-teal-400/20 px-2 py-0.5 text-teal-700 text-sm rounded-full backdrop-blur-sm">
          AI
        </span>
        <h1 className={`text-gray-800 text-4xl mb-8 ${quicksand.className}`}>clarity</h1>
        <Link href="/" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">Home</Link>
        <Link href="/save" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">Saved Solutions</Link>
        <Link href="/history" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">History</Link>
        {/* <button 
          onClick={handleToolsClick}
          className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors"
        >
          Tools
        </button> */}
      </div>

      {/* Right Content Section */}
      <div className="w-5/6 h-screen overflow-auto bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100 p-8">
        <div className={`bg-gradient-to-b from-white/90 via-rose-50/20 to-white rounded-lg shadow-lg p-12 w-4/5 ${showForm ? 'min-h-fit' : 'min-h-[85vh]'} mx-auto my-4 text-center ${inter.className} text-[9pt]`}>
          <div className="max-w-2xl mx-auto">
              <h2 className={`text-4xl font-bold text-gray-800 mb-6 ${quicksand.className}`}>
                Personal AI Coach
              </h2>
              <div className="flex justify-center space-x-4 font-medium mb-4">
                <span className="bg-teal-400/20 px-3 py-1 text-teal-700 text-sm rounded-full backdrop-blur-sm">#lifeistough</span>
                <span className="bg-rose-400/20 px-3 py-1 text-rose-700 text-sm rounded-full backdrop-blur-sm">#personaljourney</span>
              </div>
              <p className="text-gray-700 text-lg mb-6">
              This service helps people navigate complex personal dilemmas. Example scenarios include "emotionally distant partner" or "stable job vs new opportunity".
              </p>
              <div className="bg-gradient-to-br from-white via-amber-50 to-white rounded-lg p-6 shadow-sm text-left">
                <h2 className={`text-lg font-bold text-gray-800 mb-2 ${plusJakarta.className}`}>
                  Let's get to know you!
                </h2>
                <p className="text-gray-700 text-lg">
                  Share the feelings and facts that are most important to you.
                  The AI applies a mix of logic, psychology, and problem-solving frameworks to break down the situation and provide three actionable paths.
                </p>
              </div>
              {!showForm && (
                <>
                  <button
                    className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white mt-2 py-3 px-16 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} font-semibold text-sm transition-all`}
                    onClick={() => setShowForm(true)}
                  >
                    Let's Go
                  </button>
                </>
              )}
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomePage;
