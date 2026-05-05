'use client'
import React, {useState} from 'react'
import Modal from './Modal'

interface Hardcoded {
    name: string;
    breachDate: string;
    addedDate: string;
}

    const hardcodedBreaches: Hardcoded[] = [
      {
        name: "example1@gmail.com",
        breachDate: "2023-01-15",
        addedDate: "2023-01-01",
      },
      {
        name: "example2@gmail.com",
        breachDate: "2022-12-10",
        addedDate: "2022-12-01",
      },
      {
        name: "example3@gmail.com",
        breachDate: "2022-11-05",
        addedDate: "2022-11-01",
      },
    ];

export default function Login() {
const [email, setEmail] = useState<string>("");
const [modal, setModal] = useState<boolean>(false);
const [breaches, setBreaches] = useState<Hardcoded[]>([]);
const [suggestedPass, setSuggestedPass] = useState<boolean>(false);

const handleLogin = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     //simulated API

     const userBreaches = hardcodedBreaches;
     if(userBreaches.length > 0){
        setBreaches(userBreaches);
        setSuggestedPass(true);
        setModal(true);
     }
}

const closeModal = () => {
    setModal(false);
}


  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Modal isOpen={modal} Close={closeModal}>
        <h2>Breach found</h2>
        {suggestedPass && <p>we suggest you change your password</p>}
        {breaches.length > 0 ?(
            <ul>
                {breaches.map(({name, breachDate, addedDate}, i) => (
                    <li key={i}>
                        <h1>{name}</h1>
                        <p>{breachDate}</p>
                        <p>{addedDate}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p>no breach found</p>
        )}
      </Modal>
    </div>
  );
}
