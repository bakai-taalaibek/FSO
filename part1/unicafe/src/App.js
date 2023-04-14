import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const sum = good + neutral + bad

  const StatisticLine = (props) => {
    return (
      <>
        <tr>
          <td>{props.text}</td><td>{props.value}</td> 
        </tr>
      </>
    )
  }

  const Statistics = () => {
    if (sum === 0) {
      return (
        <div>
          "No feedback has been given"
        </div>
      )
    }
    else {
      return (
        <table>
          <tbody>
            <StatisticLine text="good" value ={good} />
            <StatisticLine text="neutral" value ={neutral} /> 
            <StatisticLine text="bad" value ={bad} /> 
            <StatisticLine text="all" value ={sum} /> 
            <StatisticLine text="average" value ={new Intl.NumberFormat("en-US", {maximumFractionDigits: 1,}).format((good + neutral * 0 + bad * -1) / sum || 0)} />
            <StatisticLine text="positive" value ={new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1,}).format((good / sum) || 0)}/>
          </tbody>
        </table>
      )
    }
  }

  const Button = (props) => {
    return (
      <button onClick={props.handleClick}> {props.text}</button>
    )
  }

  return (
    <div>
      <h3> Give feedback </h3>
      <Button handleClick={() => setGood(good + 1)} text="good"/> 
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/> 
      <Button handleClick={() => setBad(bad + 1)} text="bad"/> 
      <h3> Statistics </h3>    
      <Statistics />
    </div>
  )
}

export default App