import './App.css';
import {useState, useEffect} from "react";
import { ethers }  from  "ethers";
import Manager from  "./artifacts/contracts/Manager.sol/Manager.json";

function App() {
  const [name, setName] =useState("");
  const [account, setAccount] =useState("");
  const [contract, setContract] =useState(null);
  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    const res = await contract.getTickets();
    console.log(res)
    setTickets(res);
  }

  const createTicket = async (_name) => {
    const transaction = await contract.createTicket(_name);
    await transaction.wait();
    getTickets();
  }

  const updateTicketStatus = async (_index, _status) => {
    const transaction = await contract.updateTicketStatus(_index, _status);
    await transaction.wait();
    getTickets();
  }

  const renameTicket = async (_index) => {
    let newName = prompt("Please enter new ticket name", "");
    const transaction = await contract.updateTicketName(_index, newName);
    await transaction.wait();
    getTickets();
  }

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      setAccount(accounts[0]);
      setContract(
          new ethers.Contract(
"0xCba82c0Ce9dd02b3E67418e15d5f12A92121cA46",
              Manager.abi,
              newSigner
          )
      );

    } else {
      console.log("Please install Metamask!");
    }
  }

  useEffect( () => {
    initConnection();

      }, []);

  console.log(contract)

  return (
    <div className="flex flex-col w-full h-screen bg-violet-400">
      <div className="header h-11 bg-slate-50 text-stone-900 flex items-center justify-between px-5 text-base">
        <p>Task Manager</p>
        { account && account !== "" ? (
            <p>{account.substring(0,9)}...</p>
        ) : (
            <button className="px-2 py-0.5 bg-stone-100 rounded cursor-pointer" onClick={initConnection}> connect</button>
          )}
      </div>

      <div className="input_section h-11 bg-slate-700 text-stone-900 flex items-center justify-between px-5 text-base">
        <div>
          <button  className="px-2 py-0.5 bg-stone-100 rounded cursor-pointer" onClick={() => createTicket(name)}>
          Create Ticket
          </button>
          <input
          className="inputClass ml-10 px-2 py-0.5 bg-stone-100 rounded cursor-pointer"
          onChange={(e) => setName(e.target.value)}
          placeholder="Ticket Name"
          />
        </div>
        <button className="px-2 py-0.5 bg-stone-100 rounded cursor-pointer" onClick={getTickets}>
          Load Data
        </button>
      </div>

      <div className="main flex flex-1 bg-stone-50">
        <div className="main_col flex flex-1 p-5 flex-col bg-stone-90" style={{backgroundColor: "lightPink"}}>
          <div className="main_col_header mb-5">ToDo</div>
          { tickets
              .map((t,i) => ({id: i, item : t}) )
              .filter((t) => t.item.status == 0)
              .map(((ticket, index) => {
            return (
                <div key={index} className="main_ticket_card flex flex-col mb-2 p-5 rounded-lg relative bg-white">
                  <p className="text-xs absolute -top-2 -right-2 bg-white p-2 rounded-lg">#{ticket.id}</p>
                  <p>{ticket.item.name}</p>
                  <div className="main_ticket_button_section flex self-end mt-4 flex-wrap">
                    <button style={{backgroundColor: "cyan"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer"  onClick={() => updateTicketStatus(ticket.id, 1)}>
                      Busy
                    </button>
                    <button style={{backgroundColor: "lightGreen"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => updateTicketStatus(ticket.id, 2)}>
                      Done
                    </button>
                    <button className="bg-gray-200 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => renameTicket(ticket.id)}>
                      Rename
                    </button>
                  </div>
                </div>
            );
          }))
          }
        </div>
        <div className="main_col flex flex-1 p-5 flex-col bg-stone-90" style={{backgroundColor: "cyan"}}>
          <div className="main_col_header mb-5">Busy</div>
          { tickets
              .map((t,i) => ({id: i, item : t}) )
              .filter((t) => t.item.status == 1)
              .map(((ticket, index) => {
                return (
                    <div key={index} className="main_ticket_card flex flex-col mb-2 p-5 rounded-lg relative bg-white">
                      <p className="text-xs absolute -top-2 -right-2 bg-white p-2 rounded-lg">#{ticket.id}</p>
                      <p>{ticket.item.name}</p>
                      <div className="main_ticket_button_section flex self-end mt-4 flex-wrap">
                        <button style={{backgroundColor: "lightPink"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => updateTicketStatus(ticket.id, 0)}>
                          ToDo
                        </button>
                        <button style={{backgroundColor: "lightGreen"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => updateTicketStatus(ticket.id, 2)}>
                          Done
                        </button>
                        <button className="bg-gray-200 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => renameTicket(ticket.id)}>
                          Rename
                        </button>
                      </div>
                    </div>
                );
              }))
          }
        </div>
        <div className="main_col flex flex-1 p-5 flex-col bg-stone-90" style={{backgroundColor: "lightGreen"}}>
          <div className="main_col_header mb-5">Done</div>
          { tickets
              .map((t,i) => ({id: i, item : t}) )
              .filter((t) => t.item.status == 2)
              .map(((ticket, index) => {
                return (
                    <div key={index} className="main_ticket_card flex flex-col mb-2 p-5 rounded-lg relative bg-white">
                      <p className="text-xs absolute -top-2 -right-2 bg-white p-2 rounded-lg">#{ticket.id}</p>
                      <p>{ticket.item.name}</p>
                      <div className="main_ticket_button_section flex self-end mt-4 flex-wrap">
                        <button style={{backgroundColor: "lightPink"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => updateTicketStatus(ticket.id, 0)}>
                          ToDo
                        </button>
                        <button style={{backgroundColor: "cyan"}} className="mr-0.5 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => updateTicketStatus(ticket.id, 1)}>
                          Busy
                        </button>
                        <button  className="bg-gray-200 px-2 py-0.5 bg-stone-100 rounded-full cursor-pointer" onClick={() => renameTicket(ticket.id)}>
                          Rename
                        </button>
                      </div>
                    </div>
                );
              }))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
