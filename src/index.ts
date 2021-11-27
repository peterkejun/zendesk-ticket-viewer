import TicketViewer from './ticket_viewer';


// This is the entry point of the ticket viewer application

// create a new instance of the controller
const ticket_viewer = new TicketViewer();


// this will kick-start the user interface and prevent the event loop 
// to terminate. 
ticket_viewer.start();


