import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Navbarr from "../../component/Navbarr";
import { getUserDetails } from "../../util/GetUser";
import ToDoServices from "../../services/ToDoServices"
import { useNavigate } from "react-router-dom";
import { Card, Tag, Space, Empty, message } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleFilled, CheckCircleOutlined, AudioOutlined } from '@ant-design/icons';
import { getErrorMessage } from "../../util/GetError";
import moment from "moment";
import logo from '../../assets/logo.png';
import NotificationService from "../../services/NotificationService";

export default function ToDoList() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  //const [isListening, setIsListening] = useState(false); // for when asking "How can I help you?"

  const [isRecording, setIsRecording] = useState(false); // for recording popup

  const [allToDo, setAllToDo] = useState([]);

  const [currentEditItem, setCurrentEditItem] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedDeadLine, setUpdatedDeadLine] = useState('');

  const [currentTaskType, setCurrentTaskType] = useState("InComplete");

  const [completedToDo, setCompletedToDo] = useState([]);
  const [IncompletedTodo, setInCompletedToDo] = useState([]);
  const [currentToDoTask, setCurrentToDoTask] = useState([]);

  const [filteredTodo, setFilteredToDO] = useState([]);

  /*const formatDate = (date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // Returns formatted date as yyyy-mm-dd
  };*/


  const getAllToDo = async () => {
    try {
      let user = getUserDetails();
      const response = await ToDoServices.getAllToDo(user?.userId);

      console.table(response.data);
      setAllToDo(response.data);
      console.log("deadline : ", deadLine);
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }

  useEffect(() => {
    let user = getUserDetails();

    const getAllToDo = async () => {
      try {
        await NotificationService.checkDeadlines(); // 🔔 Trigger notifications first
      
        const response = await ToDoServices.getAllToDo(user?.userId);

        console.table(response.data);
        setAllToDo(response.data);

      } catch (err) {
        console.log(err);
        message.error(getErrorMessage(err));
      }
    }

    if (user && user?.userId) {
      getAllToDo();
    }
    else {
      navigate('/login');
    }

  }, [navigate]); // Add empty dependency array to prevent repeated calls


  useEffect(() => {

    const InComplete = allToDo.filter((item) => item.isCompleted === false);
    const complete = allToDo.filter((item) => item.isCompleted === true);

    setInCompletedToDo(InComplete);
    setCompletedToDo(complete);

    if (currentTaskType === "InComplete") {

      setCurrentToDoTask(InComplete);
    }
    else {

      setCurrentToDoTask(complete);
    }

  }, [allToDo])

  /*const handleSubmitTask = async () => {

    try {
      const userId = getUserDetails().userId;
      const data = {
        title,
        description,
        deadLine ,
        isCompleted: false,
        createdBy: userId
      }

      const response = await ToDoServices.createToDo(data);
      console.log("short date",deadLine);
      console.log("5User response :-", response);
      console.table(response.data);

      message.success("Task Added Successfully");
      setIsAdding(false);
      getAllToDo();

    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }
*/
  /*const getFormattedDate = (value) => {
    let date = new Date(value);
    let dateString = date.toDateString();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();
    let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }*/

  // Voice recognition initialization (same as previous code)
  let recognition;
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
  } else {
    recognition = null;
  }


  const handleSubmitTask = async () => {
    try {
      const userId = getUserDetails().userId;

      const data = {
        title,
        description,
        deadLine,
        isCompleted: false,
        createdBy: userId,
      };

      const response = await ToDoServices.createToDo(data);
      const createdTask = response.data.task;

      console.log("Task Added:", createdTask);

      // ✅ Create a notification using the correct taskId
      await NotificationService.createNotification({
        userId,
        taskId: createdTask._id,
        message: "Task added successfully!",
      });

      message.success("Task Added Successfully");
      setIsAdding(false);
      getAllToDo(); // Refresh task list
    } catch (err) {
      console.error("Error in creating task or notification:", err);
      message.error(getErrorMessage(err));
    }
  };


  // Start voice input (same as previous code)
  const startVoiceInput = () => {
    // Play a simple beep sound when the mic button is clicked
    const beep = new Audio("data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEAgAAEAAIAF5LAAEAAf5AIAAA"); // A beep sound
    beep.play();

    if (!recognition) {
      message.error("Voice recognition not supported in this browser.");
      return;
    }

    recognition.start();
    setIsRecording(true); // Show recording modal
    message.info("Listening... voice input started");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice Transcript:", transcript);

      // Parse Title, Description, and Deadline
      const titleMatch = transcript.match(/title\s(.*?)\s(description|deadline|$)/);
      const descriptionMatch = transcript.match(/description\s(.*?)\s(deadline|$)/);
      const deadlineMatch = transcript.match(/deadline\s(.+)/);

      if (titleMatch) {
        setTitle(titleMatch[1].trim());
      }

      if (descriptionMatch) {
        setDescription(descriptionMatch[1].trim());
      }

      if (deadlineMatch) {
        let deadlineText = deadlineMatch[1].trim();

        // You can improve this simple conversion
        if (deadlineText.includes("today")) {
          const today = new Date().toISOString().split('T')[0];
          setDeadLine(today);
        } else if (deadlineText.includes("tomorrow")) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setDeadLine(tomorrow.toISOString().split('T')[0]);
        } else {
          setDeadLine(deadlineText);
        }
      }

      setIsRecording(false); // Hide recording modal

      // Auto-submit after small delay
      setTimeout(() => {
        handleSubmitTask();
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error", event.error);
      setIsRecording(false);
      message.error("Voice recognition error: " + event.error);
    };
  };

  const handleEdit = (item) => {
    console.log(item);
    setCurrentEditItem(item);
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
    setUpdatedDeadLine(item?.deadLine);
    setIsEditing(true);
  }

  const handleDelete = async (item) => {
    try {
      const response = await ToDoServices.deleteToDo(item._id);
      console.log("delete task", response.data);
      message.success("Task Deleted Successfully");
      getAllToDo();
    }
    catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }

 /* const handleUpdateStatus = async (id, status) => {
    console.log(id);
    try {
      const userId = getUserDetails().userId;

      const response = await ToDoServices.updateToDo(id, { isCompleted: status });
      
      console.log(response);
      // ✅ Create a notification using the correct taskId
      await NotificationService.createNotification({
        userId,
        taskId: id,
        message: "Task Completed successfully!",
      });
      console.log("task update id - " ,taskId);
      message.success("Task status updated");
      getAllToDo();
     
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }
*/

const handleUpdateStatus = async (id, status) => {
  try {
    const userId = getUserDetails().userId;

    const response = await ToDoServices.updateToDo(id, { isCompleted: status });

    // Create a notification only if the task is marked as completed
    if (status) {
      await NotificationService.createNotification({
        userId,
        taskId: id,
        message: "Task marked as completed!",
      });
    } else {
      await NotificationService.createNotification({
        userId,
        taskId: id,
        message: "Task marked as incomplete.",
      });
    }

    console.log("task update id -", id);
    message.success("Task status updated");
    getAllToDo();

  } catch (err) {
    console.log(err);
    message.error(getErrorMessage(err));
  }
};

  
  const handleUpdateTask = async () => {
    try {
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedStatus,
        deadLine: updatedDeadLine
      }

      console.table(" Updated data ", data);
      const response = await ToDoServices.updateToDo(currentEditItem?._id, data);

      console.table("Updates Details ", response.data);
      message.success("Task Updated Successfully");

      getAllToDo();
      setIsEditing(false);

    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }
  /*
       const handleUpdateTask = async () => { 
        try {
            // Determine if the task should be marked completed
            const isStatusChangingToCompleted = updatedStatus && !currentEditItem?.isCompleted;
    
            const data = {
                title: updatedTitle,
                description: updatedDescription,
                isCompleted: isStatusChangingToCompleted ? true : currentEditItem?.isCompleted, 
                ...(isStatusChangingToCompleted && { completedOn: new Date().toISOString() }) // Only add completedOn if status changes to completed
            };
    
            console.table(data);
    
            const response = await ToDoServices.updateToDo(currentEditItem?._id, data);
    
            console.table(response.data);
            message.success("Task Updated Successfully");
    
            // Fetch latest tasks only after successful update
            await getAllToDo();
    
            setIsEditing(false);
    
        } catch (err) {
            console.error("Update Error:", err);
            message.error(getErrorMessage(err));
        }
    };
    */

  const handleTypeChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setCurrentTaskType(value);
    if (value === "inComplete") {

      setCurrentToDoTask(IncompletedTodo);
    }
    else {

      setCurrentToDoTask(completedToDo);
    }
  }

  const handleSearch = (e) => {

    let query = e.target.value;

    let filteredllist = allToDo.filter(
      (item) =>
        item.title.toLowerCase().match(query.toLowerCase())
    );

    if (filteredllist.length > 0 && query) {

      setFilteredToDO(filteredllist);

    } else {
      setFilteredToDO([]);
    }
  };




  return (
    <>
      <Navbarr active='myTask' />

      <div className="d-flex flex-wrap md:flex-nowrap items-center justify-around p-4 bg-gray-100 shadow-md w-full gap-4">

        <h1 className="font-bold flex-1 text-center my-1 justify-evenly">
          <img src={logo} style={{ width: "150px", maxWidth: "100%" }} alt="profile" />
        </h1>

        <Form.Control
          type="search"
          placeholder="Search your task"
          className="flex-1 text-center my-2 "
          aria-label="Search"
          onChange={handleSearch}
          style={{ padding: "4px", minWidth: "300px", maxWidth: "600px", flexGrow: 2 }}
        />

        <Button
          className="flex-1 text-center my-2 "
          onClick={() => setIsAdding(true)}
          variant="outline-success"
          style={{ marginLeft: "40px" }}
        >
          Add Task
        </Button>

        <Form.Group className="flex-1 text-center my-2 " style={{ marginLeft: "40px" }}>
          <Form.Select
            id="status"
            value={currentTaskType}
            onChange={handleTypeChange}
            className="form-select"
          >
            <option value={"inComplete"}>InCompleted</option>
            <option value={"complete"}>Completed</option>
          </Form.Select>


        </Form.Group>

      </div>


      <div className="item-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", padding: "16px" }}>

        {filteredTodo.length > 0 ? (
          filteredTodo.map((item) => (
            <Card
              key={item?._id}
              title={item.title}
              bordered={true}
              style={{ width: 350 }}
              extra={
                <Tag color={item?.isCompleted ? "green" : "red"}>
                  {item?.isCompleted ? "Completed" : "Incompleted"}
                </Tag>
              }
            >
              <p>{item?.description}</p>
              <p>Created At : <Tag color="blue">{moment(item?.createdAt).format("DD MMM YYYY, hh:mm A")}</Tag> </p>
              <p>Due date : <Tag color="black">{moment(item?.deadLine).format("DD MMM YYYY")}</Tag></p>


              <Space style={{ marginTop: "5px", float: "right" }}>

                <EditOutlined style={{ color: "#1890ff", fontSize: "20px" }} onClick={() => handleEdit(item)} />
                <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => handleDelete(item)} />

                {item?.isCompleted ? (

                  <CheckCircleFilled style={{ color: "green", fontSize: "20px" }} onClick={() => handleUpdateStatus(item._id, false)} />

                ) : (

                  <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} onClick={() => handleUpdateStatus(item._id, true)} />

                )}

              </Space>
            </Card>
          ))

        ) : currentToDoTask.length > 0 ? (
          currentToDoTask.map((item) => (

            <Card
              key={item?._id}
              title={item.title}
              bordered={true}
              style={{ width: 350 }}
              extra={
                <Tag color={item?.isCompleted ? "green" : "red"}>
                  {item?.isCompleted ? "Completed" : "Incompleted"}
                </Tag>
              }
            >
              <p>{item?.description}</p>

              <p>Created At : <Tag color="blue">{moment(item?.createdAt).format("DD MMM YYYY, hh:mm A")}</Tag></p>
              <p>Due Date : <Tag color="black">{moment(item?.deadLine).format("DD MMM YYYY")}</Tag></p>

              <Space style={{ marginTop: "5px", float: "right" }}>
                <EditOutlined style={{ color: "#1890ff", fontSize: "20px" }} onClick={() => handleEdit(item)} />
                <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => handleDelete(item)} />
                {item?.isCompleted ? (
                  <CheckCircleFilled style={{ color: "green", fontSize: "20px" }} onClick={() => handleUpdateStatus(item._id, false)} />
                ) : (
                  <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} onClick={() => handleUpdateStatus(item._id, true)} />
                )}
              </Space>
            </Card>
          ))

        ) : (
          <Empty />
        )}

      </div>

      {/* <Modal show={isAdding} onHide={() => setIsAdding(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New ToDo Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Due date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter task DeadLine"
                value={deadLine}
                onChange={(e) => setDeadLine(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitTask}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal > */}

      <Modal show={isAdding} onHide={() => setIsAdding(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New ToDo Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Due date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter task DeadLine"
                value={deadLine}
                onChange={(e) => setDeadLine(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitTask}>
            Save Task
          </Button>
          <Button variant="info" onClick={startVoiceInput}>
            <AudioOutlined /> Add Task by Voice
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Show Recording Modal */}
      {isRecording && (
        <Modal
          show={isRecording}
          onHide={() => setIsRecording(false)}
          centered
        >
          <Modal.Body>
            <h3>🎙️ Listening...</h3><br />
            <p> Speak your task details now.. <br /> Please say: <b>Title</b> [your task] <b>Description</b> [your task details] <b>Deadline</b> [your deadline]</p>
          </Modal.Body>
        </Modal>

      )}
      <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update {currentEditItem.title} Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Update Task title"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="update task description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Task Due date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter task DeadLine"
                value={updatedDeadLine}
                onChange={(e) => setUpdatedDeadLine(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                id="status"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"

              >
                <option value={false}>Not Completed</option>
                <option value={true}>Completed</option>
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  )
}