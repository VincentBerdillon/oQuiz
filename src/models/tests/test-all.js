/* eslint-disable no-unused-vars */
const { Quiz, Level, Tag, Question } = require("../index");

main();

async function main() {
  await testTag();
  await testQuestion();
  await testLevelWithQuestions();
  await testQuestionAnswer();
}


async function testTag() {
  const tags = await Tag.findAll();
  console.log(tags);
}

async function testQuestion() {
  const quizWithQuestions = await Quiz.findByPk(1, {
    include: "questions"
  });

  console.log(quizWithQuestions.get(null, { plain: true }));
}

async function testLevelWithQuestions() {
  const levelWithQuestion = await Level.findOne({
    where: { name: "Confirmé" },
    include: {
      association: "questions",
      attributes: ["wiki"]
    }
  });
  console.log(levelWithQuestion.get(null, { plain: true }));
}

async function testQuestionAnswer() {
  const questionWithPropositions = await Question.findByPk(1, {
    attributes: ["description"],
    include: {
      association: "propositions",
      attributes: ["description"]
    }
  });

  const questionWithGoodAnswer = await Question.findByPk(1, {
    attributes: ["description"],
    include: {
      association: "good_answer",
      attributes: ["description"]
    }
  });

  const question = await Question.findByPk(1, {
    attributes: ["description"],
    include: [
      {
        association: "propositions",
        attributes: ["description"]
      },
      {
        association: "good_answer",
        attributes: ["description"]
      }
    ]
  });
  console.log(questionWithPropositions.get(null, { plain: true }));
  console.log(questionWithGoodAnswer.get(null, { plain: true }));
  console.log(question.get(null, { plain: true }));
}
