import { ITicket } from "../src/types";

export const sample_ticket: ITicket = {
    url: 'https://www.example.com/tickets/1.json',
    id: 1,
    created_at: '2021-11-28T02:44:49Z',
    updated_at: '2021-11-29T02:44:49Z',
    type: 'incident',
    subject: 'Sample subject',
    raw_subject: 'Sample raw subject',
    description: 'Sample description',
    priority: 'normal',
    status: 'open',
    tags: ['sample', 'coding', 'project'],
}

export const sample_ticket_rendered: string =
    `ID                  1
Subject             Sample subject
Date Created        2021-11-28T02:44:49Z
Date Updated        2021-11-29T02:44:49Z
Type                incident
Priority            normal
Status              open
Tags                sample,coding,project
Description
Sample description`;

export const sample_ticket_row_rendered: string =
    `Showing 1 of 1 pages (10 tickets)

ID             Subject                       Date Created                  Priority            Status              
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                
1              Sample subject                2021-11-28T02:44:49Z          normal              open                

Use left/right arrow keys to view the previous/next page.`;