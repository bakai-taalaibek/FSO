const Courses = ({courses}) => {
    return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(course => <div key={course.id}>
                                  <h2>{course.name}</h2>
                                  {course.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
                                  <b>total of {course.parts.reduce((accumulator, everyValue) => accumulator + everyValue.exercises, 0)}</b>
                               </div>)}
      </div>
    )
  }

export default Courses