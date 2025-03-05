# Money Transfer Bot

## Description

This Telegram bot helps users with money transfers. It offers two main functions:

1. **Tinder (Hawala)**: The bot helps find people who need to send money internationally. You can find someone who is ready to send money from the other side using the **Hawala** system.
   
2. **Cheap Route Search via P2P Platforms**: The bot tracks all major P2P platforms and provides users with buy and sell pairs based on their filters, showing where they can buy and sell currency at the best rates.

## Live Demo

The bot is currently running and can be tested. You can interact with the bot by visiting the following link:  
[Try the Money Transfer Bot](https://t.me/fe1p_bot)

## Installation

To install and run the bot, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/mahhis/fe1p_bot.git
    ```

2. Navigate to the project folder:

    ```bash
    cd fe1p_bot
    ```

3. Launch the [mongo database](https://www.mongodb.com/) locally

4. Create a `.env` file and add the necessary environment variables.

5. Install dependencies using Yarn:

    ```bash
    yarn install
    ```
6. To start the bot, run the following command::

    ```bash
    yarn start
    ```    

## Environment variables

- `TOKEN` — Telegram bot token
- `MONGO`— URL of the mongo database
- `TOKEN_NOTIFY` — Notifier bot
- `CHAT_ID` — User id to whom notifications are sent

Also, please, consider looking at `.env.example`.




