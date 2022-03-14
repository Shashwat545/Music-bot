# Music bot for discord
This is a bot I made just for the sake of learning how to make Discord bots using [discord.js](https://discord.js.org/). It can play music by taking a Youtube song link as input.

## Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [FFMPEG](https://www.ffmpeg.org/)

## Getting started
First, make sure you have all the above three installed on your local machine then continue with these steps.

### Installation

```bash
# Clone the repository
git clone https://github.com/Shashwat545/Music-bot.git
# Enter into the directory
cd Music-bot/
# Install the dependencies
npm install
```

## Required bot permissions
Make sure that your bot has the `Send messages`, `Manage messages`, `Join voice` and `Speak` permissions in your server, which can be found under the `OAuth2` tap on the [developer portal](https://discord.com/developers/applications/)

### Configuration
After cloning the project and installing all dependencies, you need to add your Discord API token in the config.json file.

### Starting the application
```bash
node index.js
```
