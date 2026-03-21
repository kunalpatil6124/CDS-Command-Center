document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const name = localStorage.getItem('cds_candidate_name');
    if(!name) { window.location.href = 'index.html'; return; }
    
    document.getElementById('resName').textContent = name;
    document.getElementById('resRoll').textContent = localStorage.getItem('cds_candidate_roll');
    document.getElementById('resAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

    const stateStr = localStorage.getItem('cds_test_state');
    if(!stateStr) {
        // No test taken
        window.location.href = 'instructions.html';
        return;
    }

    const testState = JSON.parse(stateStr);
    calculateResults(testState);
});

let reviewData = [];

function calculateResults(testState) {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    
    reviewData = questionsData.map((q, idx) => {
        const state = testState[idx];
        const selected = state.selectedOption;
        const actualCorrect = q.correct;
        
        // Count as attempted if answered OR answered-marked
        const isAttempted = (state.status === 'answered' || state.status === 'answered-marked');
        let statusStr = 'unattempted';
        
        if (isAttempted && selected !== null) {
            if (selected === actualCorrect) {
                correct++;
                statusStr = 'correct';
            } else {
                wrong++;
                statusStr = 'wrong';
            }
        } else {
            unattempted++;
            statusStr = 'unattempted';
        }
        
        return {
            qNum: idx + 1,
            question: q.text,
            options: q.options,
            userAnswer: selected,
            correctAnswer: actualCorrect,
            status: statusStr
        };
    });

    const totalQuestions = questionsData.length;
    const attempted = correct + wrong;
    
    // Scoring logic (CDS: +3 correct, -1 wrong)
    const score = (correct * 3) - (wrong * 1);
    const maxScore = totalQuestions * 3;
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : 0;

    // Update DOM Score Card
    document.getElementById('finalScore').textContent = score;
    document.getElementById('maxScore').textContent = maxScore;
    
    document.getElementById('statAttempted').textContent = attempted;
    document.getElementById('statCorrect').textContent = correct;
    document.getElementById('statWrong').textContent = wrong;
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;

    // Visual Analysis (Progress Bars)
    const pctCorrect = ((correct / totalQuestions) * 100).toFixed(1);
    const pctWrong = ((wrong / totalQuestions) * 100).toFixed(1);
    const pctUnattempted = ((unattempted / totalQuestions) * 100).toFixed(1);

    setTimeout(() => {
        document.getElementById('barCorrect').style.width = `${pctCorrect}%`;
        document.getElementById('barWrong').style.width = `${pctWrong}%`;
        document.getElementById('barUnattempted').style.width = `${pctUnattempted}%`;
    }, 100);

    document.getElementById('pctCorrectTxt').textContent = `${pctCorrect}%`;
    document.getElementById('pctWrongTxt').textContent = `${pctWrong}%`;
    document.getElementById('pctUnattemptedTxt').textContent = `${pctUnattempted}%`;

    renderReview('all');
}

function filterReview(filterType) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filterType) {
            btn.classList.add('active');
        }
    });

    renderReview(filterType);
}

function renderReview(filterType) {
    const list = document.getElementById('reviewList');
    let html = '';

    const filtered = filterType === 'all' 
        ? reviewData 
        : reviewData.filter(item => item.status === filterType);

    if (filtered.length === 0) {
        html = `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">No questions found for this filter.</div>`;
    } else {
        filtered.forEach(item => {
            
            let badgeClass = '';
            let badgeText = '';
            let marksHtml = '';
            
            if (item.status === 'correct') {
                badgeClass = 'badge-correct';
                badgeText = 'Correct Answer';
                marksHtml = `<span style="color: var(--status-answered); font-weight:700;">+3 Marks</span>`;
            } else if (item.status === 'wrong') {
                badgeClass = 'badge-wrong';
                badgeText = 'Wrong Answer';
                marksHtml = `<span style="color: var(--status-not-answered); font-weight:700;">-1 Mark</span>`;
            } else {
                badgeClass = 'badge-unattempted';
                badgeText = 'Unattempted';
                marksHtml = `<span style="color: var(--text-muted); font-weight:700;">0 Marks</span>`;
            }

            const optionsHtml = item.options.map((opt, i) => {
                let optClass = 'review-option';
                let icon = '';
                
                if (i === item.correctAnswer) {
                    optClass += ' is-correct';
                    icon = '✓ ';
                } else if (i === item.userAnswer && item.status === 'wrong') {
                    optClass += ' is-wrong';
                    icon = '✗ ';
                }
                
                return `<div class="${optClass}">${icon}${opt}</div>`;
            }).join('');

            html += `
                <div class="review-card">
                    <div class="review-header">
                        <div>
                            <span style="font-weight:700; color: var(--navy-primary); margin-right: 0.5rem;">Q${item.qNum}.</span>
                            <span class="badge ${badgeClass}">${badgeText}</span>
                        </div>
                        <div>
                            ${marksHtml}
                        </div>
                    </div>
                    <div class="review-question">${item.question}</div>
                    <div class="review-options">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });
    }

    list.innerHTML = html;
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function downloadPDF() {
    const pdfReport = document.getElementById('pdfReport');
    const layout = document.querySelector('.result-layout');
    const header = document.querySelector('.app-header');

    // 1. Gather all necessary candidate info
    const username = localStorage.getItem('cds_candidate_name') || 'Candidate';
    const roll = localStorage.getItem('cds_candidate_roll') || 'Roll Number';
    const date = new Date().toLocaleDateString();

    // 2. Tally accurate stats
    let correct = 0, wrong = 0, unattempted = 0;
    reviewData.forEach(item => {
        if (item.status === 'correct') correct++;
        else if (item.status === 'wrong') wrong++;
        else unattempted++;
    });

    const attempted = correct + wrong;
    const score = (correct * 3) - (wrong * 1);
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : 0;

    // 3. Generate static, print-friendly HTML String
    let html = `
        <div style="font-family: Arial, sans-serif; color: #000; padding: 20px; font-size: 14px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0 0 10px 0; font-size: 24px;">CDS Command Center</h1>
                <h2 style="margin: 0; font-size: 18px; font-weight: normal;">Examination Performance Report</h2>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                    <td style="border: 1px solid #ccc; padding: 10px;"><strong>Candidate Name:</strong> ${username}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;"><strong>Roll Number:</strong> ${roll}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;"><strong>Date:</strong> ${date}</td>
                </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; text-align: center;">
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ccc; padding: 10px;">Total Score</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Correct</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Wrong</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Unattempted</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Accuracy</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 15px; font-size: 18px; font-weight: bold;">${score}</td>
                    <td style="border: 1px solid #ccc; padding: 15px; color: green; font-weight: bold;">${correct}</td>
                    <td style="border: 1px solid #ccc; padding: 15px; color: red; font-weight: bold;">${wrong}</td>
                    <td style="border: 1px solid #ccc; padding: 15px; font-weight: bold;">${unattempted}</td>
                    <td style="border: 1px solid #ccc; padding: 15px; font-weight: bold;">${accuracy}%</td>
                </tr>
            </table>
            
            <h3 style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; font-size: 18px;">Detailed Question Analysis</h3>
    `;

    reviewData.forEach((item, index) => {
        const uAns = item.userAnswer !== null ? item.options[item.userAnswer] : "Not Answered";
        const cAns = item.options[item.correctAnswer];
        
        let marksStr = "0";
        if(item.status === 'correct') marksStr = "+3";
        else if(item.status === 'wrong') marksStr = "-1";

        html += `
            <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Q${item.qNum}. ${item.question}</div>
                <div style="margin-bottom: 5px;"><strong>Your Answer:</strong> ${uAns}</div>
                <div style="margin-bottom: 5px;"><strong>Correct Answer:</strong> ${cAns}</div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc;">
                    <strong>Status:</strong> ${item.status.toUpperCase()} 
                    <span style="margin-left: 20px;"><strong>Marks:</strong> ${marksStr}</span>
                </div>
            </div>
        `;

        // 4. Pagination Fix: Inject a clear page break after every 5 questions natively
        if ((index + 1) % 5 === 0 && index < reviewData.length - 1) {
            html += `<div style="page-break-after: always; clear: both; height: 0; line-height: 0;"></div>`;
        }
    });

    html += `</div>`;
    pdfReport.innerHTML = html;

    // 5. Hide UI layer, show print layer to generate clean off-DOM map
    layout.style.display = 'none';
    header.style.display = 'none';
    document.body.style.background = '#fff';
    pdfReport.style.display = 'block';

    // 6. Enforce requested PDF Generation Method settings precisely
    html2pdf().set({
        margin: 10,
        filename: 'CDS_Result.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    }).from(pdfReport).save().then(() => {
        // 7. Cleanup & Restore regular UI
        pdfReport.style.display = 'none';
        pdfReport.innerHTML = '';
        layout.style.display = 'block';
        header.style.display = 'flex';
        document.body.style.background = '';
    }).catch(err => {
        console.error("PDF Error: ", err);
        pdfReport.style.display = 'none';
        pdfReport.innerHTML = '';
        layout.style.display = 'block';
        header.style.display = 'flex';
        document.body.style.background = '';
    });
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
