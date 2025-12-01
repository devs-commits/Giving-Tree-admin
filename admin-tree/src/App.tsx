import './App.css'
import AdminDashboard from './pages/AdminDashboard';
// import Login from './pages/Login';

function App() {

  const payNow = async () => {
    const email = "hi@gmail.com";
    const amount = 5000;
    const id = 1;

    const response = await fetch('http://127.0.0.1:5000/payments/api/initialize-payment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
        amount: amount,
        id: id
      })
    });

    console.log(response)
  }

  return (
    <>
      <AdminDashboard />
      {/* <Login /> */}

    <button onClick={payNow}>SUBMIT</button>
    </>
  )
}

export default App
