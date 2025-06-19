document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const setupPanel = document.querySelector('.setup-panel');
    const interviewPanel = document.querySelector('.interview-panel');
    const resultsPanel = document.querySelector('.results-panel');
    const startInterviewBtn = document.getElementById('start-interview');
    const endInterviewBtn = document.getElementById('end-interview');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const nextQuestionBtn = document.getElementById('next-question');
    const restartInterviewBtn = document.getElementById('restart-interview');
    const downloadReportBtn = document.getElementById('download-report');
    const userAnswerTextarea = document.getElementById('user-answer');
    const feedbackPanel = document.querySelector('.feedback-panel');
    const timerDisplay = document.querySelector('.timer');
    const questionsAnsweredDisplay = document.getElementById('questions-answered');
    const interviewDurationDisplay = document.getElementById('interview-duration');
    const performanceRatingDisplay = document.getElementById('performance-rating');
    const feedbackSummary = document.querySelector('.feedback-summary');
    
    // Interview state
    let interviewState = {
        jobRole: '',
        experienceLevel: 'entry',
        questionTypes: ['technical', 'behavioral'],
        questions: [],
        currentQuestionIndex: 0,
        startTime: null,
        timerInterval: null,
        answers: [],
        feedback: []
    };
    
    // Question bank (in a real app, these would come from an API or more extensive database)
    const questionBank = {
        technical: {
            entry: [
                "Explain the concept of object-oriented programming.",
                "What is the difference between == and === in JavaScript?",
                "How would you optimize a slow-loading webpage?"
            ],
            mid: [
                "Explain how you would design a RESTful API for a todo list application.",
                "What are some common security vulnerabilities in web applications and how would you prevent them?",
                "Describe your approach to debugging a complex issue in production."
            ],
            senior: [
                "How would you architect a scalable microservices-based e-commerce platform?",
                "Explain the trade-offs between monolithic and microservices architectures.",
                "Describe your strategy for leading a technical team through a major platform migration."
            ]
        },
        behavioral: {
            entry: [
                "Tell me about a time you faced a difficult challenge and how you handled it.",
                "Describe a situation where you had to work as part of a team.",
                "Give an example of how you've handled a tight deadline."
            ],
            mid: [
                "Describe a time when you had to persuade team members to adopt a new approach.",
                "Tell me about a time you made a mistake at work and how you handled it.",
                "Give an example of how you've mentored a junior colleague."
            ],
            senior: [
                "Describe a situation where you had to make a difficult decision without complete information.",
                "Tell me about a time you had to manage conflict within your team.",
                "How have you contributed to the strategic direction of a product or company?"
            ]
        },
        situational: {
            entry: [
                "If you discovered a teammate was consistently missing deadlines, what would you do?",
                "How would you handle receiving unclear instructions from a manager?",
                "What would you do if you found a critical bug right before a release?"
            ],
            mid: [
                "If you had to choose between delivering a feature on time with some technical debt or delaying to do it properly, what would you do?",
                "How would you handle a situation where stakeholders keep changing requirements mid-project?",
                "What would you do if you strongly disagreed with a technical decision made by your manager?"
            ],
            senior: [
                "How would you handle a situation where your team is resistant to organizational change?",
                "If you had to cut your budget by 30%, how would you prioritize?",
                "How would you approach merging two teams with different technical cultures?"
            ]
        }
    };
    
    // Initialize the app
    function init() {
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        startInterviewBtn.addEventListener('click', startInterview);
        endInterviewBtn.addEventListener('click', endInterview);
        submitAnswerBtn.addEventListener('click', submitAnswer);
        nextQuestionBtn.addEventListener('click', nextQuestion);
        restartInterviewBtn.addEventListener('click', restartInterview);
        downloadReportBtn.addEventListener('click', downloadReport);
    }
    
    // Start the interview
    function startInterview() {
        // Get user inputs
        interviewState.jobRole = document.getElementById('job-role').value || 'the position';
        interviewState.experienceLevel = document.getElementById('experience-level').value;
        
        // Get selected question types
        interviewState.questionTypes = [];
        document.querySelectorAll('input[name="question-type"]:checked').forEach(checkbox => {
            interviewState.questionTypes.push(checkbox.value);
        });
        
        // Validate at least one question type is selected
        if (interviewState.questionTypes.length === 0) {
            alert('Please select at least one question type.');
            return;
        }
        
        // Generate questions based on selections
        generateQuestions();
        
        // Set up interview panel
        setupPanel.classList.add('hidden');
        interviewPanel.classList.remove('hidden');
        
        // Start timer
        interviewState.startTime = new Date();
        interviewState.timerInterval = setInterval(updateTimer, 1000);
        
        // Display first question
        displayCurrentQuestion();
    }
    
    // Generate questions based on user selections
    function generateQuestions() {
        interviewState.questions = [];
        
        // For each selected question type, add 2 questions (for demo purposes)
        interviewState.questionTypes.forEach(type => {
            const levelQuestions = questionBank[type][interviewState.experienceLevel];
            if (levelQuestions) {
                // Shuffle and pick 2 questions (or all if less than 2)
                const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());
                interviewState.questions.push(...shuffled.slice(0, 2));
            }
        });
        
        // Shuffle all selected questions
        interviewState.questions = interviewState.questions.sort(() => 0.5 - Math.random());
    }
    
    // Display the current question
    function displayCurrentQuestion() {
        if (interviewState.currentQuestionIndex < interviewState.questions.length) {
            const question = interviewState.questions[interviewState.currentQuestionIndex];
            const questionElement = document.querySelector('.ai-question .message');
            questionElement.textContent = question;
            
            // Reset answer textarea
            userAnswerTextarea.value = '';
            feedbackPanel.classList.add('hidden');
        } else {
            // No more questions
            endInterview();
        }
    }
    
    // Submit answer and get AI feedback
    function submitAnswer() {
        const answer = userAnswerTextarea.value.trim();
        if (!answer) {
            alert('Please enter your answer before submitting.');
            return;
        }
        
        // Store answer
        interviewState.answers.push({
            question: interviewState.questions[interviewState.currentQuestionIndex],
            answer: answer
        });
        
        // Simulate AI feedback (in a real app, this would call an API)
        const feedback = generateAIFeedback(
            interviewState.questions[interviewState.currentQuestionIndex],
            answer
        );
        
        interviewState.feedback.push(feedback);
        
        // Display feedback
        displayFeedback(feedback);
    }
    
    // Generate simulated AI feedback
    function generateAIFeedback(question, answer) {
        // This is a simplified simulation - a real app would use an AI API
        const feedback = {
            strengths: [],
            improvements: []
        };
        
        // Analyze answer length
        const wordCount = answer.split(/\s+/).length;
        
        if (wordCount > 30) {
            feedback.strengths.push("Your answer was detailed and comprehensive.");
        } else if (wordCount > 15) {
            feedback.strengths.push("Your answer was concise and to the point.");
        } else {
            feedback.improvements.push("Your answer was quite brief. Consider expanding with more details or examples.");
        }
        
        // Check for examples/stories in behavioral questions
        if (question.toLowerCase().includes('time') || question.toLowerCase().includes('example')) {
            if (answer.toLowerCase().includes('i ') || answer.toLowerCase().includes('we ')) {
                feedback.strengths.push("Good use of a personal example to illustrate your point.");
            } else {
                feedback.improvements.push("For behavioral questions, try to provide specific examples from your experience.");
            }
        }
        
        // Check for technical terms in technical questions
        if (question.toLowerCase().includes('technical') || question.toLowerCase().includes('explain')) {
            const techTerms = ['algorithm', 'structure', 'framework', 'pattern', 'system', 'design', 'architecture'];
            const hasTechTerms = techTerms.some(term => answer.toLowerCase().includes(term));
            
            if (hasTechTerms) {
                feedback.strengths.push("You used appropriate technical terminology.");
            } else {
                feedback.improvements.push("Consider using more technical terms relevant to the question.");
            }
        }
        
        // Ensure we always have some feedback
        if (feedback.strengths.length === 0) {
            feedback.strengths.push("You provided a clear response to the question.");
        }
        
        if (feedback.improvements.length === 0) {
            feedback.improvements.push("Consider structuring your answer using the STAR method (Situation, Task, Action, Result) for even better responses.");
        }
        
        return feedback;
    }
    
    // Display feedback to user
    function displayFeedback(feedback) {
        const strengthsList = document.querySelector('.strengths-list');
        const improvementsList = document.querySelector('.improvements-list');
        
        // Clear previous feedback
        strengthsList.innerHTML = '';
        improvementsList.innerHTML = '';
        
        // Add strengths
        feedback.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        
        // Add improvements
        feedback.improvements.forEach(improvement => {
            const li = document.createElement('li');
            li.textContent = improvement;
            improvementsList.appendChild(li);
        });
        
        // Show feedback panel
        feedbackPanel.classList.remove('hidden');
    }
    
    // Move to next question
    function nextQuestion() {
        interviewState.currentQuestionIndex++;
        displayCurrentQuestion();
    }
    
    // Update timer display
    function updateTimer() {
        const now = new Date();
        const elapsed = Math.floor((now - interviewState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }
    
    // End the interview
    function endInterview() {
        // Stop timer
        clearInterval(interviewState.timerInterval);
        
        // Calculate duration
        const endTime = new Date();
        const duration = Math.floor((endTime - interviewState.startTime) / 1000);
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
        const seconds = (duration % 60).toString().padStart(2, '0');
        
        // Update results panel
        questionsAnsweredDisplay.textContent = interviewState.answers.length;
        interviewDurationDisplay.textContent = `${minutes}:${seconds}`;
        
        // Calculate performance rating (simplified for demo)
        const totalFeedbackPoints = interviewState.feedback.reduce((total, fb) => {
            return total + fb.strengths.length - fb.improvements.length;
        }, 0);
        
        const maxPossible = interviewState.answers.length * 2; // Assuming 2 points per question max
        const performancePercentage = Math.max(0, Math.floor((totalFeedbackPoints + maxPossible) / (maxPossible * 2) * 100));
        performanceRatingDisplay.textContent = `${performancePercentage}%`;
        
        // Generate feedback summary
        generateFeedbackSummary();
        
        // Switch to results panel
        interviewPanel.classList.add('hidden');
        resultsPanel.classList.remove('hidden');
    }
    
    // Generate overall feedback summary
    function generateFeedbackSummary() {
        feedbackSummary.innerHTML = '';
        
        // Count strengths and improvements across all feedback
        const allStrengths = interviewState.feedback.flatMap(fb => fb.strengths);
        const allImprovements = interviewState.feedback.flatMap(fb => fb.improvements);
        
        // Get most common feedback points
        const commonStrengths = getMostCommon(allStrengths, 3);
        const commonImprovements = getMostCommon(allImprovements, 3);
        
        // Add summary sections
        if (commonStrengths.length > 0) {
            const h4 = document.createElement('h4');
            h4.textContent = 'Your Strengths:';
            feedbackSummary.appendChild(h4);
            
            const ul = document.createElement('ul');
            commonStrengths.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            feedbackSummary.appendChild(ul);
        }
        
        if (commonImprovements.length > 0) {
            const h4 = document.createElement('h4');
            h4.textContent = 'Areas to Focus On:';
            feedbackSummary.appendChild(h4);
            
            const ul = document.createElement('ul');
            commonImprovements.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            feedbackSummary.appendChild(ul);
        }
        
        // Add general advice
        const advice = document.createElement('div');
        advice.innerHTML = `
            <h4>Final Advice:</h4>
            <p>Continue practicing with different question types. Focus on structuring your answers clearly and providing specific examples where possible.</p>
            <p>For technical questions, ensure you understand fundamental concepts related to ${interviewState.jobRole}.</p>
        `;
        feedbackSummary.appendChild(advice);
    }
    
    // Get most common items from array
    function getMostCommon(arr, count) {
        const frequency = {};
        arr.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(entry => entry[0]);
    }
    
    // Restart interview
    function restartInterview() {
        // Reset state
        interviewState = {
            ...interviewState,
            currentQuestionIndex: 0,
            questions: [],
            answers: [],
            feedback: [],
            startTime: null,
            timerInterval: null
        };
        
        // Switch back to setup panel
        resultsPanel.classList.add('hidden');
        setupPanel.classList.remove('hidden');
    }
    
    // Download report
    function downloadReport() {
        // In a real app, this would generate a PDF or text file
        alert('In a complete implementation, this would download a PDF report with your interview details and feedback.');
    }
    
    // Initialize the app
    init();
});