import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Film, BarChart2, Briefcase, Mail, MessageSquare, Video } from 'lucide-react';
import Login from './components/Login';
import DashboardIcon from './components/DashboardIcon';
import JarvisInput from './components/JarvisInput';
import LoadingAnimation from './components/LoadingAnimation';
import ResultDisplay from './components/ResultDisplay';
import OrangeLogo from './components/OrangeLogo';
import ChatWindow from './components/ChatWindow';

const API_BASE_URL = 'https://orange-be.onrender.com/api';

const questionSets = {
  default: [
    { id: 'agenda', text: "What is the agenda of the post?", type: "text" },
    { id: 'mood', text: "What mood will this post have?", type: "text" },
    { id: 'client', text: "Who is the client?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] },
    { id: 'additional_input', text: "Any additional inputs or offers?", type: "text" }
  ],
  email: [
    { id: 'receiver', text: "Who is the receiver and their designation?", type: "textarea" },
    { id: 'client_company', text: "Tell me more about the client company", type: "textarea" },
    { id: 'client', text: "What company are we representing?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] },
    { id: 'target_industry', text: "What Industry does our Target Operate in?", type: "text" },
    { id: 'additional_input', text: "Any additional inputs or offers?", type: "textarea" }
  ],
  strategy: [
    { id: 'industry', text: "What industry are you working on?", type: "text" },
    { id: 'purpose', text: "What is the purpose of this strategy discussion?", type: "text" },
    { id: 'client', text: "Who is the client?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] }
  ],
  script: [
    { id: 'industry', text: "What industry is our target audience?", type: "text" },
    { id: 'purpose', text: "What is the purpose of this video?", type: "text" },
    { id: 'client', text: "Who are we representing?", type: "dropdown", options: ["Luxofy", "1acre", "Montaigne"] }
  ]
};

const postTypeToEndpoint = {
  'Social Post': 'generate_orange_post',
  'Reel Post': 'generate_orange_reel',
  'Poll': 'generate_orange_poll',
  'Business Strategy': 'generate_orange_strategy',
  'CEO Email': 'generate_orange_email',
  'Strategy Chat': 'generate_orange_strategy_chat',
  'Script Generator': 'generate_orange_script'
};

const App = () => {
  const [state, setState] = useState({
    isLoggedIn: false,
    username: '',
    token: '',
    currentQuestion: 0,
    answers: {},
    showQuestionnaire: false,
    showResult: false,
    showChat: false,
    result: '',
    isLoading: false,
    postType: '',
    elapsedTime: 0,
    questions: questionSets.default
  });

  const updateState = (newState) => setState(prev => ({ ...prev, ...newState }));

  const handleLogin = useCallback((username, token) => {
    updateState({ isLoggedIn: true, username, token });
  }, []);

  const handleLogout = useCallback(() => {
    updateState({
      isLoggedIn: false,
      username: '',
      token: '',
      showQuestionnaire: false,
      showResult: false,
      showChat: false,
      currentQuestion: 0,
      answers: {}
    });
  }, []);

  const handleIconClick = useCallback((type) => {
    const questions = type === 'CEO Email' ? questionSets.email :
                      type === 'Strategy Chat' ? questionSets.strategy :
                      type === 'Script Generator' ? questionSets.script :
                      questionSets.default;
    updateState({
      postType: type,
      showQuestionnaire: true,
      currentQuestion: 0,
      answers: {},
      questions
    });
  }, []);

  const generateContent = useCallback(async (requestData) => {
    const endpoint = postTypeToEndpoint[state.postType];
    if (!endpoint) throw new Error('Invalid post type');

    try {
      console.log(`Sending request to ${API_BASE_URL}/${endpoint}`, JSON.stringify(requestData, null, 2));
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, requestData, {
        headers: { 
          Authorization: `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.result) return response.data.result;
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error(`Error generating ${state.postType}:`, error);
      if (error.response) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response status:', error.response.status);
        console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw new Error(`Failed to generate ${state.postType}. ${error.response ? error.response.data.detail || error.response.statusText : error.message}`);
    }
  }, [state.postType, state.token]);

  const handleAnswer = useCallback(async (answer) => {
    const newAnswers = { ...state.answers, [state.questions[state.currentQuestion].id]: answer };
    
    if (state.currentQuestion < state.questions.length - 1) {
      updateState({ answers: newAnswers, currentQuestion: state.currentQuestion + 1 });
    } else if (state.postType === 'Strategy Chat') {
      updateState({ answers: newAnswers, showQuestionnaire: false, showChat: true });
    } else {
      updateState({ isLoading: true, elapsedTime: 0 });
      const startTime = Date.now();
      const timer = setInterval(() => {
        updateState({ elapsedTime: Math.floor((Date.now() - startTime) / 1000) });
      }, 1000);

      try {
        let requestData;
        if (state.postType === 'CEO Email') {
          requestData = {
            receiver: newAnswers.receiver,
            client_company: newAnswers.client_company,
            client: newAnswers.client,
            target_industry: newAnswers.target_industry,
            additional_input: newAnswers.additional_input || ''
          };
        } else if (state.postType === 'Script Generator') {
          requestData = {
            industry: newAnswers.industry,
            purpose: newAnswers.purpose,
            client: newAnswers.client
          };
        } else {
          requestData = {
            agenda: newAnswers.agenda,
            mood: newAnswers.mood,
            client: newAnswers.client,
            additional_input: newAnswers.additional_input || ''
          };
        }

        console.log('Sending request data:', JSON.stringify(requestData, null, 2));

        const result = await generateContent(requestData);
        updateState({ result, showResult: true });
      } catch (error) {
        console.error('Error in handleAnswer:', error);
        updateState({ result: `Failed to generate ${state.postType}. Please try again.` });
      } finally {
        clearInterval(timer);
        updateState({ isLoading: false });
      }
    }
  }, [state, generateContent]);

  const handleBack = useCallback(() => {
    if (state.showResult || state.showChat) {
      updateState({
        showResult: false,
        showChat: false,
        showQuestionnaire: false,
        currentQuestion: 0,
        answers: {}
      });
    } else if (state.currentQuestion > 0) {
      updateState({ currentQuestion: state.currentQuestion - 1 });
    } else {
      updateState({
        showQuestionnaire: false,
        currentQuestion: 0,
        answers: {}
      });
    }
  }, [state.showResult, state.showChat, state.currentQuestion]);

  const handleRetry = useCallback(async () => {
    updateState({ isLoading: true, showResult: false, elapsedTime: 0 });
    const startTime = Date.now();
    const timer = setInterval(() => {
      updateState({ elapsedTime: Math.floor((Date.now() - startTime) / 1000) });
    }, 1000);

    try {
      const result = await generateContent(state.answers);
      updateState({ result });
    } catch (error) {
      updateState({ result: `Failed to generate ${state.postType}. Please try again.` });
    } finally {
      clearInterval(timer);
      updateState({ isLoading: false, showResult: true });
    }
  }, [state.answers, state.postType, generateContent]);

  const dashboardIcons = useMemo(() => [
    { Icon: Instagram, label: "Social Post", type: "Social Post" },
    { Icon: Film, label: "Reel Post", type: "Reel Post" },
    { Icon: BarChart2, label: "Facebook Ad", type: "Poll" },
    { Icon: Briefcase, label: "Business Strategy", type: "Business Strategy" },
    { Icon: Mail, label: "CEO Email", type: "CEO Email" },
    { Icon: MessageSquare, label: "Discuss Strategy", type: "Strategy Chat" },
    { Icon: Video, label: "Script Generator", type: "Script Generator" }
  ], []);

  if (!state.isLoggedIn) return <Login onLogin={handleLogin} />;

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
          {!state.showQuestionnaire && !state.showResult && !state.showChat && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Your Dashboard, {state.username}</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
          {state.showQuestionnaire && !state.showResult && !state.isLoading && (
            <JarvisInput
              key={state.currentQuestion}
              question={state.questions[state.currentQuestion]}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          )}
          {state.isLoading && <LoadingAnimation elapsedTime={state.elapsedTime} />}
          {state.showResult && (
            <ResultDisplay
              result={state.result}
              postType={state.postType}
              onBack={handleBack}
              onRetry={handleRetry}
            />
          )}
          {state.showChat && (
            <ChatWindow
              industry={state.answers.industry}
              purpose={state.answers.purpose}
              client={state.answers.client}
              token={state.token}
              apiBaseUrl={API_BASE_URL}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;