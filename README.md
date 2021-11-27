# Zendesk Ticket Viewer

Zendesk Ticket Viewer is a Node.js command line application that connects to the Zendesk API and views tickets. 

## Installation

Use [npm](https://docs.npmjs.com/about-npm) to install modules used for this project. 

```bash
npm i
```

## Authentication

In order to authenticate,
1. Replace the values in `src/creds/sample_api_token.json` with your Zendesk domain, email and API token.
2. Rename the file from `sample_api_token.json` to `api_token.json`.
## Usage
There are 6 commands, type them followed by a newline in the command line to trigger. 

- `menu`: Print the menu of commands.
- `1`: List all tickets (paginated).
- `2`: View a single ticket.
- `right arrow`: View the next page in the list.
- `left arrow`: View the previous page in the list.
- `quit`: Quit the application.

## License
[MIT](https://choosealicense.com/licenses/mit/)