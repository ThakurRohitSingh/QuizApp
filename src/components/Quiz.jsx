import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Question from "../components/Question";
import blobTop from "../assets/blobTop.svg";
import blobBottom from "../assets/blobBottom.svg";
import Loader from "./Loader";


const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [restartGame, setRestartGame] = useState(false);
  const [loading, setLoading] = useState(false);

  function stateSetter(data) {
    //Returns proper object for questions state
    const myQuestion = data.map((item) => {
      return {
        id: nanoid(),
        question: decode(item.question),
        correctAnswer: decode(item.correct_answer),
        selectedAnswer: "",
        options: choices(item.incorrect_answers, item.correct_answer),
      };
    });
    setQuestions(myQuestion);
  }

  function choices(incorrect_answers, correct_answer) {
    //Returns shuffled array with id for options in state.
    let arr = [correct_answer, ...incorrect_answers].sort(
      () => Math.random() - 0.5
    );
    return arr.map((item) => {
      return {
        id: nanoid(),
        choice: decode(item),
      };
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch("link")   /// i need to add link there
      .then((res) => res.json())
      .then((data) => {
        stateSetter(data.results);
        setLoading(false);
      });
  }, [restartGame]);

  function handleButtonClick(choice, id) {
    setQuestions((question) =>
      question.map((item) => {
        if (item.id === id) {
          return { ...item, selectedAnswer: choice };
        } else {
          return item;
        }
      })
    );
  }

  const questionElements = questions.map((question) => {
    return (
      <Question
        key={question.id}
        {...question}
        handleButtonClick={handleButtonClick}
        isChecked={isChecked}
      />
    );
  });

  function checkAnswers() {
    // Calculating correct answers
    // for loop breaks if user has not selected any value
    let count = 0;
    let checker = true;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correctAnswer === questions[i].selectedAnswer) {
        count++;
      } else if (questions[i].selectedAnswer === "") {
        checker = false;
        count = 0;
        break;
      }
    }
    //Setting Correct no. of answers and isChecked to true if all questions are checked
    setCorrectAnswers(count);
    setIsChecked(checker);
  }

  function handlePlayAgain() {
    setRestartGame((prev) => !prev);
    setCorrectAnswers(0);
    setIsChecked(false);
  }
  return loading ? (
    <Loader />
  ) : (
    <div className="questions-container">
      {questionElements}
      <div className="answer-button-container">
        <button
          className="check-answer"
          onClick={isChecked ? handlePlayAgain : checkAnswers}
        >
          {isChecked ? "Play Again" : "Check Answers"}
        </button>
        {isChecked && <h1 className="answer">You Scored {correctAnswers}/5</h1>}
      </div>
      <img className="blob-top" src={blobTop} alt="" />
      <img className="blob-bottom" src={blobBottom} alt="" />
    </div>
  );

}

export default Quiz
