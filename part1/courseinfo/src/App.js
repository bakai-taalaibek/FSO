const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
} 
const Part1 = (props) => {
  console.log(props)
  return (
    <p>{props.part1.name} {props.part1.exercises}</p>
  )
}

const Part2 = (props) => {
  console.log(props)
  return (
    <p>{props.part2.name} {props.part2.exercises}</p>
  )
}

const Part3 = (props) => {
  console.log(props)
  return (
    <p>{props.part3.name} {props.part3.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <>
      <Part1 part1={props.parts[0]} />
      <Part2 part2={props.parts[1]} />
      <Part3 part3={props.parts[2]} />
    </>
  )
} 

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
    </p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div> 
      <Header name={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default App