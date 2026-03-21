const baseQuestions = [
    {
        id: 1,
        text: "Which of the following aircraft is the backbone of the Indian Air Force fighter fleet?",
        options: ["Mirage 2000", "Sukhoi Su-30MKI", "HAL Tejas", "MiG-21 Bison"],
        correct: 1 // index 1 is Su-30MKI
    },
    {
        id: 2,
        text: "What is the motto of the Indian Air Force?",
        options: ["Service Before Self", "Touch the Sky with Glory", "Valour and Faith", "Lethal, Agile, Victorious"],
        correct: 1
    },
    {
        id: 3,
        text: "Identify the correct equivalent rank of 'Group Captain' (IAF) in the Indian Army.",
        options: ["Lieutenant Colonel", "Colonel", "Brigadier", "Major General"],
        correct: 1
    },
    {
        id: 4,
        text: "The highest peacetime gallantry award in India is:",
        options: ["Param Vir Chakra", "Maha Vir Chakra", "Ashoka Chakra", "Kirti Chakra"],
        correct: 2
    },
    {
        id: 5,
        text: "Where is the Indian Military Academy (IMA) located?",
        options: ["Pune", "Dehradun", "Khadakwasla", "Ezhimala"],
        correct: 1
    },
    {
        id: 6,
        text: "Which Indian missile is capable of carrying nuclear warheads and has a range of over 5000 km?",
        options: ["Agni-V", "BrahMos", "Prithvi-II", "Shaurya"],
        correct: 0
    },
    {
        id: 7,
        text: "The 'Garud Commando Force' is the special forces unit of which branch?",
        options: ["Indian Army", "Indian Navy", "Indian Air Force", "Indian Coast Guard"],
        correct: 2
    },
    {
        id: 8,
        text: "Who was the first Indian Commander-in-Chief of the Indian Army?",
        options: ["Sam Manekshaw", "K. M. Cariappa", "Arjan Singh", "K. S. Thimayya"],
        correct: 1
    },
    {
        id: 9,
        text: "Operation Trident was a naval offensive launched by India during which war?",
        options: ["1947 Indo-Pak War", "1965 Indo-Pak War", "1971 Indo-Pak War", "1999 Kargil War"],
        correct: 2
    },
    {
        id: 10,
        text: "Which aircraft carrier was indigenously built by India and commissioned in 2022?",
        options: ["INS Vikramaditya", "INS Vikrant", "INS Viraat", "INS Vishal"],
        correct: 1
    }
];

const questionsData = [];

// Generate 100 questions for the full CDS exam experience
for (let i = 0; i < 100; i++) {
    const template = baseQuestions[i % baseQuestions.length];
    questionsData.push({
        id: i + 1,
        text: `(Q${i + 1}) ` + template.text,
        options: [...template.options],
        correct: template.correct
    });
}
