let currentQuestionIndex = 0;
let testState = [];
/* testState item shape:
{
    id: q.id,
    status: 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'answered-marked',
    selectedOption: null | number (0-3)
}
*/

document.addEventListener('DOMContentLoaded', () => {
    // Basic auth check
    const name = localStorage.getItem('cds_candidate_name');
    if(!name) { window.location.href = 'index.html'; return; }
    
    document.getElementById('headerName').textContent = name;
    document.getElementById('headerRoll').textContent = localStorage.getItem('cds_candidate_roll');
    document.getElementById('headerAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

    initTestState();
    renderPalette();
    loadQuestion(0);
});

function initTestState() {
    const saved = localStorage.getItem('cds_test_state');
    if (saved) {
        testState = JSON.parse(saved);
        // Find first unanswered or start
        currentQuestionIndex = 0; 
    } else {
        testState = questionsData.map((q, idx) => ({
            id: q.id,
            status: idx === 0 ? 'not-answered' : 'not-visited',
            selectedOption: null
        }));
        saveState();
    }
    updateSummaryCounts();
}

function saveState() {
    localStorage.setItem('cds_test_state', JSON.stringify(testState));
    updateSummaryCounts();
}

function loadQuestion(index) {
    if (index < 0 || index >= questionsData.length) return;
    
    // Update previous question status if we navigate away and it was not-visited
    if (testState[currentQuestionIndex].status === 'not-visited') {
        testState[currentQuestionIndex].status = 'not-answered';
    }

    currentQuestionIndex = index;
    const qData = questionsData[index];
    const qState = testState[index];

    // Mark as not-answered if it was not-visited
    if (qState.status === 'not-visited') {
        qState.status = 'not-answered';
        saveState();
    }

    // Render UI
    document.getElementById('qNumBadge').textContent = `Question ${index + 1}`;
    document.getElementById('qText').innerHTML = qData.text;
    
    const optionsHtml = qData.options.map((opt, i) => {
        const isSelected = qState.selectedOption === i;
        return `
            <label class="option-label ${isSelected ? 'selected' : ''}">
                <input type="radio" name="answer" value="${i}" ${isSelected ? 'checked' : ''} onchange="selectOption(${i})">
                ${opt}
            </label>
        `;
    }).join('');
    
    document.getElementById('cmdOptions').innerHTML = optionsHtml;
    
    // Nav buttons
    document.getElementById('btnPrev').disabled = index === 0;
    
    // Update palette active states
    renderPalette();
}

function selectOption(index) {
    // Update visual state of options
    const labels = document.querySelectorAll('.option-label');
    labels.forEach((lbl, i) => {
        if(i === index) {
            lbl.classList.add('selected');
        } else {
            lbl.classList.remove('selected');
        }
    });
    
    // Local state (not saved to global status until 'Save & Next')
    testState[currentQuestionIndex].tempSelected = index;
}

function getSelectedRadio() {
    const radios = document.getElementsByName('answer');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) return parseInt(radios[i].value);
    }
    return null;
}

function saveAndNext() {
    const selected = getSelectedRadio();
    const state = testState[currentQuestionIndex];
    
    if (selected !== null) {
        state.selectedOption = selected;
        state.status = 'answered';
    } else {
        if(state.status === 'not-visited' || state.status === 'not-answered') {
            state.status = 'not-answered';
        }
        // If it was marked or answered-marked, keep old logic or clear it?
        // Usually Save & Next clears 'marked' flag if no answer
        if(state.status === 'marked' && selected === null) {
            state.status = 'not-answered';
        }
        if(state.status === 'answered-marked' && selected !== null) {
            state.status = 'answered'; // Clear mark flag
            state.selectedOption = selected;
        }
    }
    
    saveState();
    navigate(1);
}

function clearResponse() {
    const state = testState[currentQuestionIndex];
    state.selectedOption = null;
    
    if(state.status === 'answered' || state.status === 'answered-marked') {
        state.status = 'not-answered';
    }
    
    saveState();
    loadQuestion(currentQuestionIndex); // reload to clear UI
}

function markForReviewAndNext() {
    const selected = getSelectedRadio();
    const state = testState[currentQuestionIndex];
    
    if (selected !== null) {
        state.selectedOption = selected;
        state.status = 'answered-marked';
    } else {
        state.status = 'marked';
    }
    
    saveState();
    navigate(1);
}

function navigate(dir) {
    let nextIdx = currentQuestionIndex + dir;
    if (nextIdx >= 0 && nextIdx < questionsData.length) {
        loadQuestion(nextIdx);
    } else if (nextIdx >= questionsData.length) {
        // Reached end, maybe go back to 0 or show summary
        loadQuestion(0); 
    }
}

function renderPalette() {
    const palette = document.getElementById('qPalette');
    palette.innerHTML = testState.map((st, i) => {
        const isActive = i === currentQuestionIndex ? 'box-shadow: 0 0 0 2px var(--navy-primary); transform: scale(1.1);' : '';
        return `
            <div class="palette-btn ${st.status}" style="${isActive}" onclick="loadQuestion(${i})">
                ${i + 1}
            </div>
        `;
    }).join('');
}

function updateSummaryCounts() {
    let counts = { 'answered': 0, 'not-answered': 0, 'not-visited': 0, 'marked': 0, 'answered-marked': 0 };
    testState.forEach(st => counts[st.status]++);
    
    document.getElementById('countAnswered').textContent = counts['answered'];
    document.getElementById('countNotAnswered').textContent = counts['not-answered'];
    document.getElementById('countNotVisited').textContent = counts['not-visited'];
    document.getElementById('countMarked').textContent = counts['marked'];
    document.getElementById('countAnsMarked').textContent = counts['answered-marked'];
}

/* Submit Flow */
function showSubmitModal() {
    saveState(); // Ensure current changes saved
    
    const total = testState.length;
    let attempted = 0;
    let marked = 0;
    
    testState.forEach(st => {
        if(st.status === 'answered' || st.status === 'answered-marked') attempted++;
        if(st.status === 'marked' || st.status === 'answered-marked') marked++;
    });
    
    document.getElementById('modalTotal').textContent = total;
    document.getElementById('modalAttempted').textContent = attempted;
    document.getElementById('modalUnattempted').textContent = total - attempted;
    document.getElementById('modalMarked').textContent = marked;
    
    document.getElementById('submitModal').classList.add('active');
}

function hideSubmitModal() {
    document.getElementById('submitModal').classList.remove('active');
}

function finishTest(isAuto = false) {
    saveState(); 
    // Flag that test is completed
    localStorage.setItem('cds_test_completed', 'true');
    window.location.href = 'result.html';
}

/* ========================================= */
/* MOBILE RESPONSIVE CONTROLLERS             */
/* ========================================= */
function toggleMobilePanel(panel) {
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    const tabQuestions = document.getElementById('tabQuestions');
    const tabPalette = document.getElementById('tabPalette');

    if (panel === 'questions') {
        leftPanel.classList.remove('hidden-mobile');
        rightPanel.classList.remove('active-mobile');
        tabQuestions.classList.add('active');
        tabPalette.classList.remove('active');
    } else {
        leftPanel.classList.add('hidden-mobile');
        rightPanel.classList.add('active-mobile');
        tabQuestions.classList.remove('active');
        tabPalette.classList.add('active');
    }
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('menu-open');
}

// Auto close hamburger menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.hamburger-btn');
    if (menu && menu.classList.contains('menu-open') && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.remove('menu-open');
    }
});
