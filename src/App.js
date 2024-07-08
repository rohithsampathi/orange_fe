import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Film, BarChart2, Briefcase, Mail } from 'lucide-react';
import Login from './components/Login';
import DashboardIcon from './components/DashboardIcon';
import JarvisInput from './components/JarvisInput';
import LoadingAnimation from './components/LoadingAnimation';
import ResultDisplay from './components/ResultDisplay';
import OrangeLogo from './components/OrangeLogo';

const API_BASE_URL = 'https://orange-be.onrender.com/api';

const defaultQuestions = [
  { id: 'agenda', text: "What is the agenda of the post?", type: "text" },
  { id: 'mood', text: "What mood will this post have?", type: "text" },
  { id: 'client', text: "Who is the client?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] },
  { id: 'additional_input', text: "Any additional inputs or offers?", type: "text" }
];

const emailQuestions = [
  { id: 'receiver', text: "Who is the receiver and their designation?", type: "textarea" },
  { id: 'client_company', text: "Tell me more about the client company", type: "textarea" },
  { id: 'client', text: "What company are we representing?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] },
  { id: 'target_industry', text: "What Industry does our Target Operate in?", type: "text" },
  { id: 'additional_input', text: "Any additional inputs or offers?", type: "textarea" }
];

const postTypeToEndpoint = {
  'Social Post': 'generate_orange_post',
  'Reel Post': 'generate_orange_reel',
  'Poll': 'generate_orange_poll',
  'Business Strategy': 'generate_orange_strategy',
  'CEO Email': 'generate_orange_email'
};

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
  const [questions, setQuestions] = useState(defaultQuestions);

  const handleLogin = useCallback((user, accessToken) => {
    setIsLoggedIn(true);
    setUsername(user);
    setToken(accessToken);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setToken('');
    setShowQuestionnaire(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers({});
  }, []);

  const handleIconClick = useCallback((type) => {
    setPostType(type);
    setShowQuestionnaire(true);
    setCurrentQuestion(0);
    setAnswers({});
    setQuestions(type === 'CEO Email' ? emailQuestions : defaultQuestions);
  }, []);

  const generateContent = useCallback(async (requestData) => {
    const endpoint = postTypeToEndpoint[postType];
    if (!endpoint) {
      throw new Error('Invalid post type');
    }

    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error('Invalid response from server');
    }
  }, [postType, token]);

  const handleAnswer = useCallback(async (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      setElapsedTime(0);
      const startTime = Date.now();
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      try {
        let requestData;
        if (postType === 'CEO Email') {
          requestData = {
            receiver: newAnswers.receiver,
            client_company: newAnswers.client_company,
            client: newAnswers.client,
            target_industry: newAnswers.target_industry,
            additional_input: newAnswers.additional_input || ''
          };
        } else {
          requestData = {
            agenda: newAnswers.agenda,
            mood: newAnswers.mood,
            client: newAnswers.client,
            additional_input: newAnswers.additional_input || ''
          };
        }

        const result = await generateContent(requestData);
        setResult(result);
      } catch (error) {
        console.error(`Error generating ${postType}:`, error);
        setResult(`Failed to generate ${postType}. Please try again.`);
      } finally {
        clearInterval(timer);
        setIsLoading(false);
        setShowResult(true);
      }
    }
  }, [answers, currentQuestion, questions, postType, generateContent]);

  const handleBack = useCallback(() => {
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
  }, [showResult, currentQuestion]);

  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setShowResult(false);

    try {
      let requestData;
      if (postType === 'CEO Email') {
        requestData = {
          receiver: answers.receiver,
          client_company: answers.client_company,
          client: answers.client,
          target_industry: answers.target_industry,
          additional_input: answers.additional_input || ''
        };
      } else {
        requestData = {
          agenda: answers.agenda,
          mood: answers.mood,
          client: answers.client,
          additional_input: answers.additional_input || ''
        };
      }

      const result = await generateContent(requestData);
      setResult(result);
    } catch (error) {
      console.error(`Error generating ${postType}:`, error);
      setResult(`Failed to generate ${postType}. Please try again.`);
    } finally {
      setIsLoading(false);
      setShowResult(true);
    }
  }, [answers, postType, generateContent]);


  const dashboardIcons = useMemo(() => [
    { Icon: Instagram, label: "Social Post", type: "Social Post" },
    { Icon: Film, label: "Reel Post", type: "Reel Post" },
    { Icon: BarChart2, label: "Facebook Ad", type: "Poll" },
    { Icon: Briefcase, label: "Business Strategy", type: "Business Strategy" },
    { Icon: Mail, label: "CEO Email", type: "CEO Email" }
  ], []);

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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {dashboardIcons.map(({ Icon, label, type }) => (
                  <DashboardIcon 
                    key={type}
                    Icon={Icon} 
                    label={label} 
                    onClick={() => handleIconClick(type)} 
                  />
                ))}
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