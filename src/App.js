import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Film, BarChart2, Briefcase } from 'lucide-react';
import Login from './components/Login';
import DashboardIcon from './components/DashboardIcon';
import JarvisInput from './components/JarvisInput';
import LoadingAnimation from './components/LoadingAnimation';
import ResultDisplay from './components/ResultDisplay';
import OrangeLogo from './components/OrangeLogo';

const questions = [
  { id: 'agenda', text: "What is the agenda of the post?", type: "text" },
  { id: 'mood', text: "What mood will this post have?", type: "text" },
  { id: 'client', text: "Who is the client?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] },
  { id: 'additional_input', text: "Any additional inputs or offers?", type: "text" }
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleLogin = (user, accessToken) => {
    setIsLoggedIn(true);
    setUsername(user);
    setToken(accessToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setToken('');
    setShowQuestionnaire(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleIconClick = (type) => {
    setPostType(type);
    setShowQuestionnaire(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = async (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      setElapsedTime(0);
      const startTime = Date.now();
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      const requestData = {
        agenda: answers.agenda,
        mood: answers.mood,
        client: answers.client,
        additional_input: answers.additional_input || ''
      };
      
      try {
        let endpoint;
        switch (postType) {
          case 'Social Post':
            endpoint = 'generate_orange_social_post';
            break;
          case 'Reel Post':
            endpoint = 'generate_orange_reel';
            break;
          case 'Poll':
            endpoint = 'generate_orange_poll';
            break;
          case 'Business Strategy':
            endpoint = 'generate_orange_business_strategy';
            break;
          default:
            throw new Error('Invalid post type');
        }
        
        const response = await axios.post(`https://orange-be.onrender.com/api/${endpoint}`, requestData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.result) {
          setResult(response.data.result);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error(`Error generating ${postType}:`, error);
        setResult(`Failed to generate ${postType}. Please try again.`);
      } finally {
        clearInterval(timer);
        setIsLoading(false);
        setShowResult(true);
      }
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      setShowQuestionnaire(false);
      setCurrentQuestion(0);
      setAnswers({});
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setShowQuestionnaire(false);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setShowResult(false);
    
    const requestData = {
      agenda: answers.agenda,
      mood: answers.mood,
      client: answers.client,
      additional_input: answers.additional_input || ''
    };
    
    try {
      let endpoint;
      switch (postType) {
        case 'Social Post':
          endpoint = 'generate_orange_social_post';
          break;
        case 'Reel Post':
          endpoint = 'generate_orange_reel';
          break;
        case 'Poll':
          endpoint = 'generate_orange_poll';
          break;
        case 'Business Strategy':
          endpoint = 'generate_orange_business_strategy';
          break;
        default:
          throw new Error('Invalid post type');
      }
      
      const response = await axios.post(`https://orange-be.onrender.com/api/${endpoint}`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.result) {
        setResult(response.data.result);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error(`Error generating ${postType}:`, error);
      setResult(`Failed to generate ${postType}. Please try again.`);
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <OrangeLogo />
            <span className="text-xl font-bold">Orange Zone</span>
          </div>
          <button onClick={handleLogout} className="text-white hover:text-orange-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>
      
      <main className="container mx-auto mt-8 px-4">
        <AnimatePresence mode="wait">
          {!showQuestionnaire && !showResult && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Your Dashboard, {username}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DashboardIcon Icon={Instagram} label="Social Post" onClick={() => handleIconClick('Social Post')} />
                <DashboardIcon Icon={Film} label="Reel Post" onClick={() => handleIconClick('Reel Post')} />
                <DashboardIcon Icon={BarChart2} label="Poll" onClick={() => handleIconClick('Poll')} />
                <DashboardIcon Icon={Briefcase} label="Business Strategy" onClick={() => handleIconClick('Business Strategy')} />
              </div>
            </motion.div>
          )}
          {showQuestionnaire && !showResult && !isLoading && (
            <JarvisInput
              key={currentQuestion}
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          )}
          {isLoading && <LoadingAnimation elapsedTime={elapsedTime} />}
          {showResult && (
            <ResultDisplay
              result={result}
              postType={postType}
              onBack={handleBack}
              onRetry={handleRetry}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
