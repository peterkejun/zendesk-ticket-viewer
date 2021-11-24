import { list_tickets } from './api/list_tickets';
import { view_ticket } from './api/view_ticket';
import { make_ticket_list } from './ui/ticket-list';


const main = async () => {
    console.log('app running');

    let data = await list_tickets();

    const list_str = make_ticket_list(data);

    console.log(list_str);


    console.log('app stopped')
}

main();

