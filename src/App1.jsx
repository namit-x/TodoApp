import { useState, useRef, useEffect } from 'react'

function idGen() {
  let id = new Date().getTime()
  let num = Math.floor((10 + (10) * Math.random()))
  return (id + num)
}

function App() {

  const inputRef = useRef()

  const [todosList, setTodosList] = useState(() => {
    const storedList = localStorage.getItem('todoList');
    return storedList ? JSON.parse(storedList) : [];
  })
  const [finishList, setFinishList] = useState(() => {
    const storedList = localStorage.getItem('finishList');
    return storedList ? JSON.parse(storedList) : [];
  })
  const [displayList, setDisplayList] = useState(() => {
    const storedList = localStorage.getItem('todoList');
    return storedList ? JSON.parse(storedList) : [];
  })
  const [todo, setTodo] = useState()
  const [fCheck, setFCheck] = useState(false)



  const handleSave = () => {
    let TodoId = idGen()
    let Done = false    // All the todos are saved as not done.

    if (todosList.some((item) => item.TodoName == todo)) {
      alert('This todo already exist')
      setTodo('')
    }

    else if (todo) {
      let Todo = { id: TodoId, TodoName: todo, Done: false }
      let arr = [...todosList, Todo]
      setTodosList(arr)
      setDisplayList(arr)
      setTodo('')
      saveToLS(arr, 0)
    }
  }

  const enterSave = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  const todoName = (e) => {
    setTodo(e.target.value)
  }

  //          THIS IS LINKED WITH FINISHED-TODOS WALE CHECKBOX SE
  const displayTodos = () => {
    setFCheck(!fCheck)
    if (fCheck) {
      setDisplayList(finishList)
    }
    else {
      setDisplayList(todosList)
    }
  }

  const handleEdit = (e) => {
    let inx = todosList.findIndex(item => item.id == e.target.name)

    if (!todosList[inx].Done) {

      let arr = todosList.filter(item => item.id != e.target.name)
      setTodosList(arr)

      let name = todosList[inx].TodoName
      setTodo(name)
      inputRef.current.focus()
      saveToLS(arr, 0)
    }
    else {
      alert('You cannot edit Todo once it is finished.')
    }
  }

  const handleRemove = (e) => {
    let num = e.target.name
    let inx = displayList.findIndex(item => item.id == num)
    let arr = todosList
    arr = arr.filter(item => item.id != num)

    let arr2 = finishList
    arr2 = arr2.filter(item => item.id != num)
    setTodosList(arr)

    if (!displayList[inx].Done && fCheck) {
      setDisplayList(arr)
    }

    else if (displayList[inx].Done && fCheck) {
      setFinishList(arr2)
      setDisplayList(null)
      setDisplayList(arr)
    }

    else if (!fCheck) {
      setFinishList(arr2)
      setDisplayList(arr2)
    }
    saveToLS(arr, 1, arr2)
  }
  //            THIS IS LINKED (onClick of) WITH INDIVIDUAL CHECKBOXES OF TODOS
  const checkFinish = (e) => {
    let num = e.target.name

    let fList = todosList.filter(item => item.id == num)
    let fTodo = fList.pop()
    fTodo.Done = !fTodo.Done

    let arr = todosList.filter(item => item.id != num)
    arr = [...arr, fTodo]
    setTodosList(arr)
    // console.log(arr)

    if (fTodo.Done) {
      let arr2 = [...finishList, fTodo]
      setFinishList(arr2)
      saveToLS(arr, 1, arr2)
      return
    }

    if(!fTodo.Done && !fCheck) {                                                 // yahan p h hai tu
      let arr3 = finishList.filter(item => item.id != num)
      setFinishList(arr3)
      console.log('haan bhai kr rha hu kaam.')
      saveToLS(arr, 1, arr3)
      return
    }

    saveToLS(arr, 0)
  }

  const saveToLS = (T_list, i, F_list) => {
    localStorage.setItem('todoList', JSON.stringify(T_list))
    if (i == 1) {
      localStorage.setItem('finishList', JSON.stringify(F_list))
    }
  }

  useEffect(() => { displayTodos() }, [])

  return (
    <>
      <div className="sticky top-0 z-69 bg-slate-900 text-white flex justify-around text-2xl font-medium h-12 items-center">
        <div className="logo">
          Todo App
        </div>
        <div className="About">
          <ul className='flex justify-center gap-8'>
            <li>Home</li>
            <li>Your Todos</li>
          </ul>
        </div>
      </div>

      <div className="body py-4 flex justify-center">
        <div className="bg-purple-200 rounded-xl my-6 mx-96 h-min p-2">

          <div className="text-2xl font-medium w-fit mx-auto">
            iTasks- Manage your tasks at one place
          </div>

          <div className='text-xl font-medium my-2'>Add Your Todos</div>

          <div className="flex items-center gap-4">
            <div className="inp ">
              <input type="text" onKeyDown={(e) => enterSave(e)} ref={inputRef} className='w-[700px] rounded-2xl h-8 p-2' placeholder='Enter your Todo' value={todo} onChange={todoName} />
            </div>
            <div className="btn">
              <button className='text-white py-2 px-4 border-2 bg-purple-500 rounded-3xl' onClick={handleSave}>Save</button>
            </div>
          </div>

          <div className="my-4">
            <input type="checkbox" name="finish" id="finish" value={fCheck} onClick={displayTodos} />
            <label htmlFor="finish" className='cursor-pointer'>Finished Todos</label>
          </div>

          <div className="border-t-2 border-gray-600 mx-6"></div>

          <div className='font-semibold text-xl my-2'>Your Todos</div>

          {/* Dynamic Content/Todos */}

          {displayList.map(item => {

            return (
              <div className="flex justify-between m-2" key={item.id}>
                <div className="flex justify-around items-center gap-2">

                  <input className='cursor-pointer' type="checkbox" name={item.id} id={item.id} onClick={(e) => checkFinish(e)} checked={item.Done} />
                  <label className='cursor-pointer' htmlFor={item.id} >{item.TodoName}</label>

                </div>
                <div className="flex justify-around items-center gap-2">
                  <button name={item.id} className="px-3 py-1 bg-purple-500 rounded-2xl text-white font-medium" onClick={(e) => handleEdit(e)}>Edit</button>
                  <button name={item.id} className="px-3 py-1 bg-purple-500 rounded-2xl text-white font-medium" onClick={(e) => handleRemove(e)}>Remove</button>
                </div>
              </div>)
          })}
        </div>
      </div>
    </>
  )
}

export default App